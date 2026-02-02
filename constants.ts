import { Agent, LogEntry } from './types';

export const INITIAL_LOGS: LogEntry[] = [
  { id: '1', timestamp: '14:22:01', level: 'INF', source: 'NEXUS-07', message: 'Chunk 482 processed successfully. Integrity hash verified.' },
  { id: '2', timestamp: '14:21:55', level: 'SYS', source: 'SYSTEM', message: 'Auto-scaling active. Spawned instance 12 on Node-B.' },
  { id: '3', timestamp: '14:21:30', level: 'WRN', source: 'CORTEX-ANALYZER', message: 'State changed to IDLE. Data buffer underflow.' },
  { id: '4', timestamp: '14:20:12', level: 'FAT', source: 'LOGIC-GATE', message: 'FATAL_ERROR: Timed out after 30s. Connection reset by peer.' },
  { id: '5', timestamp: '14:19:59', level: 'SYS', source: 'WALLET', message: 'Token balance updated. -240 credits applied to account.' },
  { id: '6', timestamp: '14:18:45', level: 'INF', source: 'NEXUS-07', message: 'Starting analysis of batch #0912. 12 files queued.' },
  { id: '7', timestamp: '14:15:00', level: 'SYS', source: 'HEARTBEAT', message: 'Signal received from Cluster-A. Latency: 4ms.' },
];

export const AGENTS: Agent[] = [
  {
    id: 'nexus-07',
    name: 'NEXUS-07',
    role: 'DATA_PROCESSOR',
    status: 'RUNNING',
    version: 'v2.1.0_STABLE',
    message: 'Synthesizing quarterly revenue reports for the EMEA sales region...',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACJWeXdJb2hU9V5nwnzud6NX40OMbTxgv7Q-4aBOAEZev5cOSre3JvXLE_i1F_HZwkUw-y8xHwsIHZvl7eTW8E_mt0GGgh-DmYXOV-y61gBg46xFvidl61aIZmmjabgzFNlQ3yu-dqNvnNy3LRTFJbz0yWHuq6ywNBlVHRoTTYFJGT8kRcOQ5zJcw3KZGvX3TYXEJ9ikGLFgfb03suXbfHhFQQj203WWayinFuX76kNPnT4mHuumO5CVV9LueJdzwabQHeaskG3MA',
    color: 'blue',
    progress: 85,
  },
  {
    id: 'cortex-analyzer',
    name: 'CORTEX-ANALYZER',
    role: 'PATTERN_RECOGNITION',
    status: 'IDLE',
    version: 'v1.4.2_BETA',
    message: 'Waiting for next data batch from pipeline integration...',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpUEpwmwOAlDjYE0S03E8v2nhLdg6Cxa_r65eBSvjHhbUYwXNESGtFX7ovE3OXTEMlSfNcnclyyDah0-_ltzk9_Qr4cInLwCHQrW9tm2eTI5w0oB0XvHRq2Z8SiJzs8l9qljMG-umx3EHK4wxRLvlEZMV-z2cTqyZKP5nhhLjf9Fib-IgNnxN8aKTzah6ucYEhbW1HdgzWV1L4a1G17XLrO5HTeZyVvSQx50VXNUPM_OX30FtKc6VBAuzi1d8ufbY1SrCqgORWZe4',
    color: 'yellow',
    progress: 15,
  },
  {
    id: 'logic-gate',
    name: 'LOGIC-GATE',
    role: 'DECISION_ENGINE',
    status: 'ERROR',
    version: 'v3.0.1_HOTFIX',
    message: 'API Connection timeout: Connection to LLM endpoint refused...',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCurGHt_KDykVvvgmc-0983JQBNm1Q96lrXDrmi1rx2V_roz35YsGF7XpI_F-V2OUbO15e2QDv3KTV3IbLD6uNdjFd08T2Z-LUjiUCbXNhGCG9-ca223leV9sXN41zZMEjpK_bCDfTNQOvWFaAAnCD-0csHkjXpDNvN-wQhf1Jft73LBNAQcI06LdrCEXzy8pBHpfczYCAaowVbTto4uprqTRiVzLuFEENakf_D9zjzsAc6UwTMcXF8YHrhTm9CFhQSxgUn03FQ7pw',
    color: 'red',
    progress: 100,
  }
];

export const PROFILE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCr6jviaY4fpdYV_Z8kZdt0yw9bLNagORMZfg14z0vQ_Ieqpoy7A7Q_-dZ11MKSShpe-X1yJATEyNhEmfdOEE2n4NkuPdnDgq1dX5DnaJO3PkQ9Hr7eCS-lkqQaQsn4KelQn50baJY1VceKmTx0uNmiQEKIKnmXpTEGpLBGsmYYRtJ-AOYe6WsVBg053eu9pzTyumfOe5SI8pyUNHrDt1Ux6r0DO6q1D2dgBhEQqKzIgaqWMlkiWFtiI36RvdomJ_icVZy0Qy3nFGk";

export const CHART_DATA = [
  { name: '00', uv: 2000 },
  { name: '02', uv: 3000 },
  { name: '04', uv: 2500 },
  { name: '06', uv: 4000 },
  { name: '08', uv: 3500 },
  { name: '10', uv: 2800 },
  { name: '12', uv: 4500 },
  { name: '14', uv: 3800 },
  { name: '16', uv: 5000 },
  { name: '18', uv: 4200 },
  { name: '20', uv: 3000 },
  { name: '22', uv: 3500 },
];

export const AGENT_TEMPLATES = [
  // DevOps Squad
  {
    name: 'BUG_HUNTER',
    role: 'QA_SPECIALIST',
    color: 'red',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCurGHt_KDykVvvgmc-0983JQBNm1Q96lrXDrmi1rx2V_roz35YsGF7XpI_F-V2OUbO15e2QDv3KTV3IbLD6uNdjFd08T2Z-LUjiUCbXNhGCG9-ca223leV9sXN41zZMEjpK_bCDfTNQOvWFaAAnCD-0csHkjXpDNvN-wQhf1Jft73LBNAQcI06LdrCEXzy8pBHpfczYCAaowVbTto4uprqTRiVzLuFEENakf_D9zjzsAc6UwTMcXF8YHrhTm9CFhQSxgUn03FQ7pw', // Reusing red bot
    message: 'Scanning codebase for regression patterns...'
  },
  {
    name: 'OPTIMIZER_PRIME',
    role: 'PERFORMANCE_ENG',
    color: 'blue',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACJWeXdJb2hU9V5nwnzud6NX40OMbTxgv7Q-4aBOAEZev5cOSre3JvXLE_i1F_HZwkUw-y8xHwsIHZvl7eTW8E_mt0GGgh-DmYXOV-y61gBg46xFvidl61aIZmmjabgzFNlQ3yu-dqNvnNy3LRTFJbz0yWHuq6ywNBlVHRoTTYFJGT8kRcOQ5zJcw3KZGvX3TYXEJ9ikGLFgfb03suXbfHhFQQj203WWayinFuX76kNPnT4mHuumO5CVV9LueJdzwabQHeaskG3MA',
    message: 'Analyzing heap snapshots for memory leaks...'
  },
  {
    name: 'DEPLOY_BOT',
    role: 'RELEASE_MGR',
    color: 'green',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpUEpwmwOAlDjYE0S03E8v2nhLdg6Cxa_r65eBSvjHhbUYwXNESGtFX7ovE3OXTEMlSfNcnclyyDah0-_ltzk9_Qr4cInLwCHQrW9tm2eTI5w0oB0XvHRq2Z8SiJzs8l9qljMG-umx3EHK4wxRLvlEZMV-z2cTqyZKP5nhhLjf9Fib-IgNnxN8aKTzah6ucYEhbW1HdgzWV1L4a1G17XLrO5HTeZyVvSQx50VXNUPM_OX30FtKc6VBAuzi1d8ufbY1SrCqgORWZe4', // Reusing yellow bot (changing color in props usually overrides this but image is static) - wait, let's use a standard one
    message: 'Orchestrating canary deployment to cluster-B...'
  },
  // Security Squad
  {
    name: 'FIREWALL_SENTINEL',
    role: 'NET_SEC',
    color: 'red',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCurGHt_KDykVvvgmc-0983JQBNm1Q96lrXDrmi1rx2V_roz35YsGF7XpI_F-V2OUbO15e2QDv3KTV3IbLD6uNdjFd08T2Z-LUjiUCbXNhGCG9-ca223leV9sXN41zZMEjpK_bCDfTNQOvWFaAAnCD-0csHkjXpDNvN-wQhf1Jft73LBNAQcI06LdrCEXzy8pBHpfczYCAaowVbTto4uprqTRiVzLuFEENakf_D9zjzsAc6UwTMcXF8YHrhTm9CFhQSxgUn03FQ7pw',
    message: 'Packet inspection active. Zero anomalies detected.'
  },
  // Analytics Squad
  {
    name: 'TREND_PREDICTOR',
    role: 'DATA_SCIENTIST',
    color: 'purple',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpUEpwmwOAlDjYE0S03E8v2nhLdg6Cxa_r65eBSvjHhbUYwXNESGtFX7ovE3OXTEMlSfNcnclyyDah0-_ltzk9_Qr4cInLwCHQrW9tm2eTI5w0oB0XvHRq2Z8SiJzs8l9qljMG-umx3EHK4wxRLvlEZMV-z2cTqyZKP5nhhLjf9Fib-IgNnxN8aKTzah6ucYEhbW1HdgzWV1L4a1G17XLrO5HTeZyVvSQx50VXNUPM_OX30FtKc6VBAuzi1d8ufbY1SrCqgORWZe4',
    message: 'Training forecasting model on Q4 dataset...'
  }
] as const;

export const CLI_COMMANDS = [
  { cmd: 'deploy <agent>', desc: 'Initialize new agent instance' },
  { cmd: 'sys_status', desc: 'Display core metrics' },
  { cmd: 'net_flush', desc: 'Clear local buffer cache' },
  { cmd: 'kill -9 <pid>', desc: 'Force terminate process' },
];
