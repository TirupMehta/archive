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
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999999,
      backdropFilter: 'blur(8px)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#1e1e1e',
        border: '1px solid #262626',
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '20px', 
          fontWeight: 700, 
          color: '#ededed',
          fontFamily: 'Inter, sans-serif'
        }}>{title}</h3>
        
        <p style={{ 
          margin: '0 0 32px 0', 
          fontSize: '15px', 
          lineHeight: '1.6', 
          color: '#a1a1aa',
          fontFamily: 'Inter, sans-serif'
        }}>{message}</p>
        
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
              border: '1px solid #262626', 
              color: '#ededed',
              fontFamily: 'inherit'
            }}
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
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
