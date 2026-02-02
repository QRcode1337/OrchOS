import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CHART_DATA } from '../../constants';

const ThroughputChart: React.FC = () => {
  return (
    <div className="console-panel border-t-8 border-t-gb-purple border-3 border-gb-bg0 bg-gb-bg0/40 relative shadow-inner">
      <div className="flex justify-between items-center bg-gb-bg0 p-4 border-b-2 border-gb-bg-h">
        <div>
          <h3 className="text-xl font-display font-bold uppercase tracking-tighter text-gb-fg">Throughput Overview</h3>
          <p className="text-[10px] text-gb-gray font-bold uppercase">Telemetry Stream: IO_METRICS_V4</p>
        </div>
        <div className="flex gap-1">
          <button className="px-3 py-1 bg-gb-purple text-gb-bg-h text-[10px] font-bold uppercase hover:brightness-110">Live</button>
          <button className="px-3 py-1 border border-gb-gray text-gb-fg text-[10px] font-bold uppercase hover:bg-gb-gray hover:text-gb-bg0">History</button>
        </div>
      </div>
      <div className="p-4 h-64 bg-black/20 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3c3836" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
            <Area 
                type="monotone" 
                dataKey="uv" 
                stroke="#d3869b" 
                strokeWidth={3} 
                strokeDasharray="8 4" 
                fill="rgba(211, 134, 155, 0.1)" 
            />
             <XAxis 
                dataKey="name" 
                tick={{fontSize: 10, fill: '#928374', fontFamily: 'JetBrains Mono'}} 
                axisLine={false} 
                tickLine={false}
                interval={1}
            />
             {/* Hidden YAxis just for scaling */}
             <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThroughputChart;
