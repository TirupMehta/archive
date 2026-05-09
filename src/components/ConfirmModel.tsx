"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModelProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmColor?: string;
}

export default function ConfirmModel({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", confirmColor = "#ef4444" }: ConfirmModelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999,
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out forwards',
      willChange: 'opacity, backdrop-filter'
    }}>
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '32px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'ModelIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        willChange: 'transform, opacity'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ margin: '0 0 32px 0', fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onCancel}
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              backgroundColor: 'transparent', 
              border: '1px solid var(--card-border)', 
              color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              backgroundColor: confirmColor, 
              border: 'none', 
              color: '#fff',
              fontFamily: 'inherit',
              boxShadow: `0 4px 12px ${confirmColor}44`
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
