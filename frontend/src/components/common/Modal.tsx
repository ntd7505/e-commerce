import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Click outside to close (optional, but good UX)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`w-full ${maxWidth} bg-surface rounded-xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h2 id="modal-title" className="text-lg font-bold text-text">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:bg-surface-alt hover:text-text transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
