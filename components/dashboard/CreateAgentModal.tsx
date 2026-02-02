import React, { useState } from 'react';
import { Agent, AgentColor } from '../../types';
import Modal from '../shared/Modal';
import AgentCard from './AgentCard';
import { AGENT_TEMPLATES } from '../../constants';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agent: Agent) => void;
}

const COLORS: AgentColor[] = ['blue', 'yellow', 'red', 'green', 'purple', 'aqua', 'orange'];
const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuACJWeXdJb2hU9V5nwnzud6NX40OMbTxgv7Q-4aBOAEZev5cOSre3JvXLE_i1F_HZwkUw-y8xHwsIHZvl7eTW8E_mt0GGgh-DmYXOV-y61gBg46xFvidl61aIZmmjabgzFNlQ3yu-dqNvnNy3LRTFJbz0yWHuq6ywNBlVHRoTTYFJGT8kRcOQ5zJcw3KZGvX3TYXEJ9ikGLFgfb03suXbfHhFQQj203WWayinFuX76kNPnT4mHuumO5CVV9LueJdzwabQHeaskG3MA";

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: 'NEW_AGENT_01',
    role: 'GENERAL_PURPOSE',
    imageUrl: '',
    color: 'green' as AgentColor,
    message: 'Initializing primary directives...'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      status: 'IDLE',
      version: 'v1.0.0',
      progress: 0,
      ...formData,
      imageUrl: formData.imageUrl || DEFAULT_IMAGE
    };
    onCreate(newAgent);
    onClose();
    // Reset form slightly
    setFormData(prev => ({ ...prev, name: `NEW_AGENT_${Math.floor(Math.random() * 99)}` }));
  };

  const applyTemplate = (template: typeof AGENT_TEMPLATES[number]) => {
      setFormData({
          name: template.name,
          role: template.role,
          imageUrl: template.imageUrl,
          color: template.color as AgentColor,
          message: template.message
      });
  };

  const previewAgent: Agent = {
    id: 'preview',
    status: 'IDLE',
    version: 'v1.0.0',
    progress: 0,
    ...formData,
    imageUrl: formData.imageUrl || DEFAULT_IMAGE
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initialize New Agent">
      <div className="flex flex-col gap-6">
        {/* Templates */}
        <div className="flex gap-2 pb-4 border-b-2 border-gb-bg-h overflow-x-auto">
            <span className="text-[10px] font-bold uppercase text-gb-gray tracking-widest shrink-0 flex items-center mr-2">LOAD SQUAD TEMPLATE:</span>
            {AGENT_TEMPLATES.map(t => (
                <button 
                    key={t.name}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className="px-3 py-1 bg-gb-bg0 border border-gb-gray text-[10px] font-bold uppercase hover:bg-gb-aqua hover:text-gb-bg-h transition-colors whitespace-nowrap"
                >
                    {t.role}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gb-gray tracking-widest">Agent Designation</label>
                <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                className="w-full bg-gb-bg-h border-3 border-gb-bg0 p-3 text-xs font-mono text-gb-fg focus:border-gb-aqua focus:ring-0 outline-none"
                placeholder="E.g. OMEGA-12"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gb-gray tracking-widest">Operational Role</label>
                <input 
                required
                type="text" 
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value.toUpperCase() }))}
                className="w-full bg-gb-bg-h border-3 border-gb-bg0 p-3 text-xs font-mono text-gb-fg focus:border-gb-aqua focus:ring-0 outline-none"
                placeholder="E.g. DATA_MINING"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gb-gray tracking-widest">Avatar URL (Optional)</label>
                <input 
                type="url" 
                value={formData.imageUrl}
                onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full bg-gb-bg-h border-3 border-gb-bg0 p-3 text-xs font-mono text-gb-fg focus:border-gb-aqua focus:ring-0 outline-none"
                placeholder="https://..."
                />
                <p className="text-[9px] text-gb-gray">Leave empty for default synth.</p>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gb-gray tracking-widest">System Color</label>
                <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                    <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-none border-2 transition-all ${
                        formData.color === color 
                        ? 'border-gb-fg scale-110 shadow-lg' 
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: `var(--color-gb-${color})` }}
                    >
                        <div className={`w-full h-full bg-gb-${color}`}></div>
                    </button>
                ))}
                </div>
            </div>

            <button 
                type="submit"
                className="mt-4 bg-gb-aqua text-gb-bg-h font-display font-bold uppercase py-4 border-b-4 border-r-4 border-gb-bg-h active:border-0 active:translate-y-1 active:translate-x-1 transition-all hover:brightness-110"
            >
                Deploy Unit
            </button>
            </form>

            {/* Preview Section */}
            <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase text-gb-gray tracking-widest mb-4">Visual Preview</label>
            <div className="flex-1 flex items-center justify-center bg-black/10 border-2 border-dashed border-gb-bg0 p-4">
                <div className="w-full max-w-xs pointer-events-none select-none">
                    <AgentCard agent={previewAgent} onClick={() => {}} />
                </div>
            </div>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAgentModal;
