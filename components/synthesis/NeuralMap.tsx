import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-force';
import { Agent, MemoryEntry } from '../../types';

interface NeuralMapProps {
    agents: Agent[];
    memories: any[]; // Extended memory type with agentName etc.
    convergence: number; // 0 to 100
}

interface Node extends d3.SimulationNodeDatum {
    id: string;
    type: 'AGENT' | 'MEMORY';
    name: string;
    color: string;
    value?: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string;
    target: string;
}

const NeuralMap: React.FC<NeuralMapProps> = ({ agents, memories, convergence }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

    useEffect(() => {
        // Build graph data
        const newNodes: Node[] = [];
        const newLinks: Link[] = [];

        // Add Agents
        agents.forEach(agent => {
            newNodes.push({
                id: agent.id,
                type: 'AGENT',
                name: agent.name,
                color: agent.color === 'blue' ? '#458588' : agent.color === 'yellow' ? '#fabd2f' : '#fb4934'
            });
        });

        // Add Memories
        memories.forEach(mem => {
            newNodes.push({
                id: mem.id,
                type: 'MEMORY',
                name: mem.key,
                value: mem.value,
                color: '#83a598'
            });

            if (mem.agentId) {
                newLinks.push({
                    source: mem.agentId,
                    target: mem.id
                });
            }
        });

        setNodes(newNodes);
        setLinks(newLinks);
    }, [agents, memories]);

    useEffect(() => {
        if (!svgRef.current || nodes.length === 0) return;

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        // Force simulation
        const simulation = d3.forceSimulation<Node>(nodes)
            .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(50))
            .force('charge', d3.forceManyBody().strength(-150))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(20));

        // Adjust link strength based on convergence to pull things together
        const linkForce = simulation.force('link') as d3.ForceLink<Node, Link>;
        linkForce.strength(convergence / 100);

        simulation.on('tick', () => {
            setNodes([...simulation.nodes()]);
        });

        return () => {
            simulation.stop();
        };
    }, [nodes.length, links.length, convergence]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            <svg ref={svgRef} className="w-full h-full">
                <g>
                    {links.map((link, i) => {
                        const sourceNode = nodes.find(n => n.id === (link.source as any).id || n.id === link.source);
                        const targetNode = nodes.find(n => n.id === (link.target as any).id || n.id === link.target);
                        if (!sourceNode || !targetNode) return null;
                        
                        return (
                            <line
                                key={i}
                                x1={sourceNode.x}
                                y1={sourceNode.y}
                                x2={targetNode.x}
                                y2={targetNode.y}
                                stroke="#aeadaf"
                                strokeOpacity={0.2}
                                strokeWidth={1}
                            />
                        );
                    })}
                    {nodes.map((node) => (
                        <g 
                            key={node.id} 
                            transform={`translate(${node.x},${node.y})`}
                            onMouseEnter={() => setHoveredNode(node)}
                            onMouseLeave={() => setHoveredNode(null)}
                            className="cursor-pointer transition-transform hover:scale-125"
                        >
                            <circle
                                r={node.type === 'AGENT' ? 8 : 4}
                                fill={node.color}
                                className={node.type === 'AGENT' ? 'animate-pulse' : ''}
                            />
                            {node.type === 'AGENT' && (
                                <text
                                    dy="-12"
                                    textAnchor="middle"
                                    className="text-[10px] fill-gb-fg font-bold uppercase pointer-events-none"
                                >
                                    {node.name}
                                </text>
                            )}
                        </g>
                    ))}
                </g>
            </svg>

            {/* Hover Tooltip */}
            {hoveredNode && hoveredNode.type === 'MEMORY' && (
                <div className="absolute p-3 bg-gb-bg1 border border-gb-gray/30 text-[10px] max-w-[200px] pointer-events-none z-50 shadow-2xl"
                     style={{ left: (hoveredNode.x || 0) + 15, top: (hoveredNode.y || 0) - 40 }}>
                    <div className="text-gb-aqua font-bold mb-1 uppercase tracking-tighter decoration-gb-aqua underline">Artifact Identified</div>
                    <div className="text-gb-fg font-bold mb-1">{hoveredNode.name}</div>
                    <div className="text-gb-gray opacity-80 break-words italic">"{hoveredNode.value}"</div>
                </div>
            )}
            
            {/* Background scanlines for flavor */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline" />
        </div>
    );
};

export default NeuralMap;
