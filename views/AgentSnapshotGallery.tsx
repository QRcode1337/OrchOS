import React, { useState, useEffect } from 'react';

/**
 * Represents a snapshot of the system state at a point in time
 */
interface Snapshot {
  id: string;
  hash: string;
  name: string;
  timestamp: string;
  tokens: string;
  entropy: string;
  status: 'STABLE' | 'TRAINED' | 'REFINED' | 'REDUNDANT' | 'CRITICAL' | 'INITIAL';
  visualPattern: number[][]; // 2D grid for visualization
}

interface AgentSnapshotGalleryProps {
  onBack: () => void;
}

/**
 * AgentSnapshotGallery - System state snapshot management interface
 *
 * Features:
 * - Timeline scrubber showing historical snapshots
 * - Grid view of all snapshots with visual state representations
 * - Snapshot comparison and restoration
 * - Manual snapshot creation
 * - Filtering by status type
 */
const AgentSnapshotGallery: React.FC<AgentSnapshotGalleryProps> = ({ onBack }) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'STABLE' | 'ANOMALIES' | 'ARCHIVES'>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [systemUptime, setSystemUptime] = useState<string>('142:09:44');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonSnapshots, setComparisonSnapshots] = useState<Snapshot[]>([]);

  // Generate sample snapshots on mount
  useEffect(() => {
    const sampleSnapshots: Snapshot[] = [
      {
        id: 'alpha-9',
        hash: '#ADX-02-BETA',
        name: 'ALPHA-9',
        timestamp: 'OCT-24 14:02',
        tokens: '4,092KB',
        entropy: '0.42%',
        status: 'STABLE',
        visualPattern: generatePattern('stable')
      },
      {
        id: 'echo-delta',
        hash: '#ED-991-REF',
        name: 'ECHO-DELTA',
        timestamp: 'OCT-23 09:15',
        tokens: '8,122KB',
        entropy: '0.11%',
        status: 'TRAINED',
        visualPattern: generatePattern('trained')
      },
      {
        id: 'sigma-7',
        hash: '#S7-ANM-00',
        name: 'SIGMA-7',
        timestamp: 'OCT-22 23:59',
        tokens: 'ERROR',
        entropy: '99.9%',
        status: 'CRITICAL',
        visualPattern: generatePattern('critical')
      },
      {
        id: 'beta-4',
        hash: '#B4-INIT-SYS',
        name: 'BETA-4',
        timestamp: 'OCT-21 11:30',
        tokens: '1,024KB',
        entropy: '0.00%',
        status: 'INITIAL',
        visualPattern: generatePattern('initial')
      },
      {
        id: 'gamma-2',
        hash: '#G2-REF-142',
        name: 'GAMMA-2',
        timestamp: 'OCT-20 18:45',
        tokens: '6,552KB',
        entropy: '0.19%',
        status: 'REFINED',
        visualPattern: generatePattern('refined')
      },
      {
        id: 'zeta-9',
        hash: '#Z9-RED-99',
        name: 'ZETA-9',
        timestamp: 'OCT-19 08:20',
        tokens: '2,048KB',
        entropy: '0.02%',
        status: 'REDUNDANT',
        visualPattern: generatePattern('redundant')
      }
    ];

    setSnapshots(sampleSnapshots);
    setCurrentIndex(2); // SIGMA-7 is current
  }, []);

  // Generate visual patterns based on status
  const generatePattern = (status: string): number[][] => {
    const size = 5;
    const pattern: number[][] = [];

    for (let i = 0; i < size; i++) {
      pattern[i] = [];
      for (let j = 0; j < size; j++) {
        if (status === 'stable') {
          pattern[i][j] = (i + j) % 3 === 0 ? 1 : 0;
        } else if (status === 'trained') {
          pattern[i][j] = (i === 2 || j === 2) ? 1 : 0;
        } else if (status === 'critical') {
          pattern[i][j] = 1; // All red
        } else if (status === 'initial') {
          pattern[i][j] = 0; // All gray
        } else if (status === 'refined') {
          pattern[i][j] = (i < 3 && j < 3) ? 1 : 0;
        } else if (status === 'redundant') {
          pattern[i][j] = ((i + j) % 2 === 0 && i < 3) ? 1 : 0;
        }
      }
    }

    return pattern;
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'STABLE': return 'gb-green';
      case 'TRAINED': return 'gb-blue';
      case 'REFINED': return 'gb-purple';
      case 'REDUNDANT': return 'gb-orange';
      case 'CRITICAL': return 'gb-red';
      case 'INITIAL': return 'gb-gray';
      default: return 'gb-gray';
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string): string => {
    const color = getStatusColor(status);
    return `bg-${color} text-gb-bg0 px-2 py-1 text-xs font-mono font-bold uppercase`;
  };

  // Filter snapshots
  const filteredSnapshots = snapshots.filter(snapshot => {
    // Filter by status
    let statusMatch = true;
    if (activeFilter === 'STABLE') statusMatch = ['STABLE', 'TRAINED', 'REFINED'].includes(snapshot.status);
    else if (activeFilter === 'ANOMALIES') statusMatch = snapshot.status === 'CRITICAL';
    else if (activeFilter === 'ARCHIVES') statusMatch = ['REDUNDANT', 'INITIAL'].includes(snapshot.status);

    // Filter by search query
    const searchMatch = searchQuery === '' ||
      snapshot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snapshot.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snapshot.id.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Handle snapshot actions
  const handleRestore = (snapshot: Snapshot) => {
    if (confirm(`Restore system to snapshot ${snapshot.name}?\n\nThis will revert to state: ${snapshot.timestamp}`)) {
      alert(`Restoring ${snapshot.name}...\nTimestamp: ${snapshot.timestamp}\nTokens: ${snapshot.tokens}\n\nSystem restoration initiated.`);
      // In production: API call to restore snapshot
    }
  };

  const handlePurge = (snapshot: Snapshot) => {
    if (confirm(`⚠️ CRITICAL ACTION ⚠️\n\nPermanently delete snapshot ${snapshot.name}?\n\nThis action CANNOT be undone.`)) {
      setSnapshots(prev => prev.filter(s => s.id !== snapshot.id));
      alert(`Snapshot ${snapshot.name} purged from system.`);
      // In production: API call to delete snapshot
    }
  };

  const handleInspect = (snapshot: Snapshot) => {
    setSelectedSnapshot(snapshot);
  };

  const handleCompare = (snapshot: Snapshot) => {
    if (!compareMode) {
      setCompareMode(true);
      setComparisonSnapshots([snapshot]);
      alert(`Comparison mode activated. Select another snapshot to compare with ${snapshot.name}.`);
    } else {
      if (comparisonSnapshots.length < 2) {
        setComparisonSnapshots(prev => [...prev, snapshot]);
        alert(`Comparing:\n\n${comparisonSnapshots[0].name} (${comparisonSnapshots[0].timestamp})\nvs\n${snapshot.name} (${snapshot.timestamp})\n\nDelta Analysis:\n• Token Difference: ${Math.abs(parseInt(comparisonSnapshots[0].tokens) - parseInt(snapshot.tokens))}KB\n• Entropy Delta: ${Math.abs(parseFloat(comparisonSnapshots[0].entropy) - parseFloat(snapshot.entropy))}%`);
        setCompareMode(false);
        setComparisonSnapshots([]);
      }
    }
  };

  const handleManualSnapshot = () => {
    const snapshotName = prompt('Enter snapshot name:', `MANUAL-${Date.now()}`);
    if (snapshotName) {
      const newSnapshot: Snapshot = {
        id: `manual-${Date.now()}`,
        hash: `#${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        name: snapshotName.toUpperCase(),
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', ''),
        tokens: `${Math.floor(Math.random() * 10000)}KB`,
        entropy: `${(Math.random() * 2).toFixed(2)}%`,
        status: 'STABLE',
        visualPattern: generatePattern('stable')
      };
      setSnapshots(prev => [newSnapshot, ...prev]);
      alert(`Manual snapshot created: ${snapshotName}`);
      // In production: API call to create snapshot
    }
  };

  return (
    <div className="w-full h-screen bg-gb-bg0 flex flex-col font-mono overflow-hidden">
      {/* Header */}
      <header className="border-b-4 border-gb-fg px-8 py-4 flex items-center justify-between bg-gb-bg0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gb-red hover:bg-gb-red/80 flex items-center justify-center transition-colors"
            aria-label="Back to dashboard"
          >
            <span className="material-symbols-outlined text-gb-fg text-2xl">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gb-fg flex items-center justify-center">
              <span className="material-symbols-outlined text-gb-bg0 text-xl">photo_camera</span>
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-gb-fg">
              AGENT_SNAPSHOT_V1.0
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-gb-fg text-gb-bg0 px-4 py-2 font-bold hover:bg-white transition-colors">
            GALLERY
          </button>
          <button
            onClick={() => alert(`SYSTEM LOGS:\n\n[${new Date().toLocaleTimeString()}] Snapshot gallery initialized\n[${new Date().toLocaleTimeString()}] ${snapshots.length} snapshots loaded\n[${new Date().toLocaleTimeString()}] Filter: ${activeFilter}\n[${new Date().toLocaleTimeString()}] Uptime: ${systemUptime}`)}
            className="bg-gb-bg-h text-gb-fg px-4 py-2 font-bold border border-gb-gray/30 hover:border-gb-gray transition-colors"
          >
            LOGS
          </button>
          <button
            onClick={() => {
              if (comparisonSnapshots.length >= 2) {
                alert(`DELTA VIEW:\n\nComparing ${comparisonSnapshots.length} snapshots:\n\n${comparisonSnapshots.map((s, i) => `[${i+1}] ${s.name} - ${s.timestamp}`).join('\n')}\n\nDelta analysis available in comparison mode.`);
              } else {
                alert('DELTA VIEW requires at least 2 snapshots selected for comparison.\n\nEnter COMPARE mode and select snapshots to analyze deltas.');
              }
            }}
            className="bg-gb-red text-gb-fg px-4 py-2 font-bold hover:bg-gb-red/80 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">analytics</span>
            <span>DELTA VIEW</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 bg-gb-bg-h border border-gb-gray/30 hover:border-gb-gray flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-gb-fg">settings</span>
          </button>
          <button
            onClick={() => setShowNotifications(true)}
            className="w-10 h-10 bg-gb-bg-h border border-gb-gray/30 hover:border-gb-gray flex items-center justify-center transition-colors relative"
          >
            <span className="material-symbols-outlined text-gb-fg">notifications</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gb-red rounded-full animate-pulse"></div>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-8 py-4 border-b border-gb-gray/20">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gb-gray">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hash..."
            className="w-full bg-gb-bg-h border border-gb-gray/30 pl-10 pr-4 py-2 text-gb-fg font-mono focus:outline-none focus:border-gb-gray"
          />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="px-8 py-6 border-b border-gb-gray/20">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gb-gray uppercase tracking-wider">
              CHRONOLOGICAL SCRUBBER
            </h2>
            <h3 className="text-2xl font-display font-bold text-gb-fg">
              GLOBAL_TIMELINE
            </h3>
          </div>
          <div className="text-right">
            <div className="text-sm text-gb-gray uppercase">CURRENT INDEX:</div>
            <div className="text-xl font-bold text-gb-red">OCT-24-2023 14:02:11</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative h-16 bg-gb-bg-h border-t-2 border-b-2 border-gb-gray/30">
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <div className="text-xs text-gb-gray">OCT 19</div>
            <div className="text-xs text-gb-gray">OCT 21</div>
            <div className="text-xs text-gb-gray">OCT 23</div>
            <div className="text-xs text-gb-gray">LIVE</div>
          </div>

          {/* Current position indicator */}
          <div
            className="absolute top-0 w-1 h-full bg-gb-red"
            style={{ left: '65%' }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gb-red border-2 border-gb-fg"></div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-8 py-4 flex items-center gap-2 border-b border-gb-gray/20">
        {(['ALL SNAPSHOTS', 'STABLE STATES', 'ANOMALIES', 'ARCHIVES'] as const).map((filter, idx) => {
          const filterKey = filter.replace(' ', '_').split('_')[0].toUpperCase() as 'ALL' | 'STABLE' | 'ANOMALIES' | 'ARCHIVES';
          const isActive = activeFilter === filterKey;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filterKey)}
              className={`px-4 py-2 font-mono text-sm font-bold uppercase transition-colors ${
                isActive
                  ? 'bg-gb-fg text-gb-bg0 border-2 border-gb-fg'
                  : 'bg-gb-bg-h text-gb-gray border-2 border-gb-gray/30 hover:border-gb-gray'
              }`}
            >
              {filter}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2 text-xs text-gb-gray uppercase">
          <span className="material-symbols-outlined text-gb-green text-sm">circle</span>
          <span>UPTIME: {systemUptime}</span>
        </div>
      </div>

      {/* Snapshot Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnapshots.map((snapshot, idx) => (
            <div
              key={snapshot.id}
              className={`border-4 transition-all ${
                snapshot.status === 'CRITICAL'
                  ? 'border-gb-red bg-gb-red/10'
                  : 'border-gb-gray/30 bg-gb-bg-h hover:border-gb-gray'
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b-2 border-gb-gray/20 flex items-start justify-between bg-gb-bg0/50">
                <div>
                  <h3 className="text-2xl font-display font-bold text-gb-fg mb-1">
                    {snapshot.name}
                  </h3>
                  <div className="text-xs text-gb-gray font-mono">
                    HASH: {snapshot.hash}
                  </div>
                </div>
                <div className={getStatusBadge(snapshot.status)}>
                  {snapshot.status}
                </div>
              </div>

              {/* Critical Badge Overlay */}
              {snapshot.status === 'CRITICAL' && (
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-gb-red border-l-[60px] border-l-transparent">
                  <div className="absolute -top-14 right-1 transform rotate-45 text-gb-fg text-xs font-bold">
                    CRITICAL
                  </div>
                </div>
              )}

              {/* Visual Pattern */}
              <div className="p-8 flex items-center justify-center bg-black">
                <div className="grid grid-cols-5 gap-1.5">
                  {snapshot.visualPattern.map((row, i) =>
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`w-8 h-8 ${
                          cell === 1
                            ? `bg-${getStatusColor(snapshot.status)}`
                            : 'bg-gb-gray/20'
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 space-y-2 text-xs font-mono bg-gb-bg0/50">
                <div className="flex justify-between">
                  <span className="text-gb-gray uppercase">TIMESTAMP:</span>
                  <span className="text-gb-fg font-bold">{snapshot.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gb-gray uppercase">TOKENS:</span>
                  <span className={`font-bold ${snapshot.tokens === 'ERROR' ? 'text-gb-red' : 'text-gb-fg'}`}>
                    {snapshot.tokens}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gb-gray uppercase">ENTROPY:</span>
                  <span className={`font-bold ${
                    snapshot.status === 'CRITICAL' ? 'text-gb-red' : 'text-gb-fg'
                  }`}>
                    {snapshot.entropy}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 grid grid-cols-2 gap-2 border-t-2 border-gb-gray/20">
                {snapshot.status === 'CRITICAL' ? (
                  <>
                    <button
                      onClick={() => handleInspect(snapshot)}
                      className="bg-gb-bg-h text-gb-gray px-4 py-2 font-bold uppercase text-xs border border-gb-gray/30 hover:border-gb-gray hover:text-gb-fg transition-colors"
                    >
                      INSPECT
                    </button>
                    <button
                      onClick={() => handlePurge(snapshot)}
                      className="bg-gb-red text-gb-fg px-4 py-2 font-bold uppercase text-xs hover:bg-gb-red/80 transition-colors"
                    >
                      PURGE
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleCompare(snapshot)}
                      className={`px-4 py-2 font-bold uppercase text-xs border transition-colors ${
                        compareMode && comparisonSnapshots.some(s => s.id === snapshot.id)
                          ? 'bg-gb-aqua text-gb-bg0 border-gb-aqua'
                          : 'bg-gb-bg-h text-gb-gray border-gb-gray/30 hover:border-gb-gray hover:text-gb-fg'
                      }`}
                    >
                      {compareMode && comparisonSnapshots.some(s => s.id === snapshot.id) ? '✓ SELECTED' : 'COMPARE'}
                    </button>
                    <button
                      onClick={() => handleRestore(snapshot)}
                      className="bg-gb-red text-gb-fg px-4 py-2 font-bold uppercase text-xs hover:bg-gb-red/80 transition-colors"
                    >
                      RESTORE STATE
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Manual Snapshot Card */}
          <button
            onClick={handleManualSnapshot}
            className="border-4 border-dashed border-gb-gray/30 hover:border-gb-gray transition-all bg-gb-bg-h hover:bg-gb-bg0 min-h-[400px] flex flex-col items-center justify-center gap-4 group"
          >
            <div className="w-20 h-20 border-4 border-gb-gray/30 group-hover:border-gb-gray bg-gb-bg0 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-gb-gray group-hover:text-gb-fg text-5xl transition-colors">
                photo_camera
              </span>
            </div>
            <div className="text-center">
              <div className="text-xl font-display font-bold text-gb-gray group-hover:text-gb-fg mb-2 transition-colors">
                MANUAL SNAPSHOT
              </div>
              <div className="text-xs text-gb-gray font-mono uppercase">
                Create new system state
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Status */}
      <footer className="border-t-2 border-gb-gray/20 px-8 py-3 bg-gb-bg0 flex items-center justify-between text-xs font-mono text-gb-gray">
        <div className="flex items-center gap-4">
          <span className="uppercase">SYSTEM: ACTIVE</span>
          <span className="uppercase">DISK: 78%</span>
          <span className="uppercase">BUFFER: OK</span>
        </div>
        <div className="uppercase">
          © 2024 AGENT_CORE_ANALYTICS // NODE_014
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-gb-bg0 border-4 border-gb-fg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gb-fg p-4 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold uppercase text-gb-bg0">SYSTEM SETTINGS</h2>
              <button onClick={() => setShowSettings(false)} className="text-gb-bg0 hover:text-gb-red">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gb-gray uppercase tracking-wider">Snapshot Configuration</h3>
                <div className="bg-gb-bg-h border border-gb-gray/20 p-4 space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gb-fg">Auto-capture on critical events</span>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gb-fg">Retain redundant snapshots</span>
                    <input type="checkbox" className="w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gb-fg">Enable delta compression</span>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </label>
                </div>
              </div>
              <button
                onClick={() => {
                  alert('Settings saved successfully.');
                  setShowSettings(false);
                }}
                className="w-full bg-gb-aqua text-gb-bg0 py-3 font-bold uppercase hover:bg-gb-aqua/80 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowNotifications(false)}>
          <div className="bg-gb-bg0 border-4 border-gb-red max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gb-red p-4 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold uppercase text-gb-fg">SYSTEM NOTIFICATIONS</h2>
              <button onClick={() => setShowNotifications(false)} className="text-gb-fg hover:text-gb-bg0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 font-mono text-xs">
              <div className="bg-gb-red/10 border-l-4 border-gb-red p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-gb-red">warning</span>
                  <div>
                    <div className="font-bold text-gb-red uppercase mb-1">Critical Snapshot Detected</div>
                    <div className="text-gb-fg">SIGMA-7 requires immediate attention. Entropy at 99.9%</div>
                    <div className="text-gb-gray text-[10px] mt-2">OCT-22 23:59</div>
                  </div>
                </div>
              </div>
              <div className="bg-gb-yellow/10 border-l-4 border-gb-yellow p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-gb-yellow">info</span>
                  <div>
                    <div className="font-bold text-gb-yellow uppercase mb-1">New Snapshot Created</div>
                    <div className="text-gb-fg">ECHO-DELTA successfully captured at OCT-23 09:15</div>
                    <div className="text-gb-gray text-[10px] mt-2">OCT-23 09:15</div>
                  </div>
                </div>
              </div>
              <div className="bg-gb-green/10 border-l-4 border-gb-green p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-gb-green">check_circle</span>
                  <div>
                    <div className="font-bold text-gb-green uppercase mb-1">System Stable</div>
                    <div className="text-gb-fg">All STABLE snapshots verified. No anomalies detected.</div>
                    <div className="text-gb-gray text-[10px] mt-2">OCT-24 14:02</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSnapshot(null)}>
          <div className="bg-gb-bg0 border-4 border-gb-red max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gb-red p-4 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold uppercase text-gb-fg">SNAPSHOT INSPECTION: {selectedSnapshot.name}</h2>
              <button onClick={() => setSelectedSnapshot(null)} className="text-gb-fg hover:text-gb-bg0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gb-bg-h border border-gb-gray/20 p-4">
                  <div className="text-[10px] text-gb-gray uppercase mb-2">Snapshot ID</div>
                  <div className="font-mono text-gb-fg">{selectedSnapshot.id}</div>
                </div>
                <div className="bg-gb-bg-h border border-gb-gray/20 p-4">
                  <div className="text-[10px] text-gb-gray uppercase mb-2">Hash</div>
                  <div className="font-mono text-gb-fg">{selectedSnapshot.hash}</div>
                </div>
                <div className="bg-gb-bg-h border border-gb-gray/20 p-4">
                  <div className="text-[10px] text-gb-gray uppercase mb-2">Timestamp</div>
                  <div className="font-mono text-gb-fg">{selectedSnapshot.timestamp}</div>
                </div>
                <div className="bg-gb-bg-h border border-gb-gray/20 p-4">
                  <div className="text-[10px] text-gb-gray uppercase mb-2">Status</div>
                  <div className={`font-mono font-bold text-${getStatusColor(selectedSnapshot.status)}`}>{selectedSnapshot.status}</div>
                </div>
                <div className="bg-gb-bg-h border border-gb-gray/20 p-4">
                  <div className="text-[10px] text-gb-gray uppercase mb-2">Token Count</div>
                  <div className="font-mono text-gb-fg">{selectedSnapshot.tokens}</div>
                </div>
                <div className="bg-gb-bg-h border border-gb-gray/20 p-4">
                  <div className="text-[10px] text-gb-gray uppercase mb-2">Entropy</div>
                  <div className={`font-mono font-bold ${selectedSnapshot.status === 'CRITICAL' ? 'text-gb-red animate-pulse' : 'text-gb-fg'}`}>{selectedSnapshot.entropy}</div>
                </div>
              </div>

              <div className="bg-gb-red/10 border border-gb-red p-4">
                <div className="text-sm font-bold text-gb-red uppercase mb-3">Diagnostic Report</div>
                <div className="space-y-2 text-xs font-mono text-gb-fg">
                  <div className="flex justify-between">
                    <span>Anomaly Detection:</span>
                    <span className="text-gb-red font-bold">CRITICAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Integrity:</span>
                    <span className="text-gb-yellow">COMPROMISED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recovery Potential:</span>
                    <span className="text-gb-yellow">MODERATE</span>
                  </div>
                  <div className="mt-3 p-3 bg-black/30">
                    <div className="text-gb-gray mb-1">Recommendation:</div>
                    <div className="text-gb-red">Immediate purge recommended. Snapshot contains corrupted state that may propagate errors if restored.</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handlePurge(selectedSnapshot);
                    setSelectedSnapshot(null);
                  }}
                  className="flex-1 bg-gb-red text-gb-fg py-3 font-bold uppercase hover:bg-gb-red/80 transition-colors"
                >
                  Purge Snapshot
                </button>
                <button
                  onClick={() => setSelectedSnapshot(null)}
                  className="flex-1 bg-gb-bg-h border border-gb-gray/30 text-gb-fg py-3 font-bold uppercase hover:border-gb-gray transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSnapshotGallery;
