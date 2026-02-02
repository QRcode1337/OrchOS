import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsVisible(false), 200); // Allow exit animation
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className="absolute inset-0 bg-gb-bg-h/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className={`relative w-full max-w-2xl bg-gb-bg0 border-6 border-gb-bg-h shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex items-center justify-between p-4 bg-gb-bg-h border-b-4 border-gb-bg0">
          <h2 className="text-xl font-display font-bold uppercase tracking-tighter text-gb-fg flex items-center gap-2">
            <span className="material-symbols-outlined text-gb-orange">terminal</span>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gb-bg0 hover:bg-gb-red hover:text-white transition-colors border-2 border-transparent hover:border-gb-bg-h"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
