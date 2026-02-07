import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { CHART_DATA } from '../../constants';

// Helper to generate initial live data
const generateInitialLiveData = () => {
    const data = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 1000);
        data.push({
            name: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
            uv: 3000 + Math.random() * 2000
        });
    }
    return data;
};

const ThroughputChart: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [data, setData] = useState(generateInitialLiveData());

  useEffect(() => {
    if (!isLive) {
        setData(CHART_DATA);
        return;
    }

    // Reset to live data structure if switching back
    if (data.length < 15 || data[0].name.length < 3) {
        setData(generateInitialLiveData());
    }

    const interval = setInterval(() => {
      setData(prevData => {
        const lastVal = prevData[prevData.length - 1].uv;
        const change = (Math.random() - 0.5) * 1000;
        let newVal = lastVal + change;
        // Clamp
        if (newVal < 1000) newVal = 1000 + Math.random() * 500;
        if (newVal > 8000) newVal = 8000 - Math.random() * 500;
        
        const now = new Date();
        const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        return [...prevData.slice(1), { name: timeLabel, uv: newVal }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="console-panel border-t-8 border-t-gb-purple border-3 border-gb-bg0 bg-gb-bg0/40 relative shadow-inner">
      <div className="flex justify-between items-center bg-gb-bg0 p-4 border-b-2 border-gb-bg-h">
        <div>
          <h3 className="text-xl font-display font-bold uppercase tracking-tighter text-gb-fg">Throughput Overview</h3>
          <p className="text-[10px] text-gb-gray font-bold uppercase flex items-center gap-2">
            Telemetry Stream: IO_METRICS_V4
            {isLive && <span className="w-1.5 h-1.5 bg-gb-green rounded-full animate-pulse"/>}
          </p>
        </div>
        <div className="flex gap-1">
          <button 
             onClick={() => setIsLive(true)}
             className={`px-3 py-1 text-[10px] font-bold uppercase transition-colors ${isLive ? 'bg-gb-purple text-gb-bg-h' : 'border border-gb-gray text-gb-fg hover:bg-gb-gray hover:text-gb-bg0'}`}
          >
              Live
          </button>
          <button 
             onClick={() => setIsLive(false)}
             className={`px-3 py-1 text-[10px] font-bold uppercase transition-colors ${!isLive ? 'bg-gb-purple text-gb-bg-h' : 'border border-gb-gray text-gb-fg hover:bg-gb-gray hover:text-gb-bg0'}`}
          >
              History
          </button>
        </div>
      </div>
      <div className="p-4 h-64 bg-black/20 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3c3836" strokeWidth="1"/>
              </pattern>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d3869b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#d3869b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1d2021', border: '1px solid #504945', fontFamily: 'monospace' }}
                itemStyle={{ color: '#d3869b' }}
                labelStyle={{ color: '#a89984' }}
            />
            <Area 
                type="monotone" 
                dataKey="uv" 
                stroke="#d3869b" 
                strokeWidth={3} 
                fill="url(#colorUv)" 
                animationDuration={500}
                isAnimationActive={isLive}
            />
             <XAxis 
                dataKey="name" 
                tick={{fontSize: 10, fill: '#928374', fontFamily: 'JetBrains Mono'}} 
                axisLine={false} 
                tickLine={false}
                interval={isLive ? 4 : 1}
            />
             {/* Hidden YAxis just for scaling */}
             <YAxis hide domain={[0, 'dataMax + 1000']} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThroughputChart;
