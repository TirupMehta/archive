"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LinkModelProps {
  isOpen: boolean;
  initialText: string;
  initialUrl: string;
  onConfirm: (text: string, url: string) => void;
  onCancel: () => void;
}

export default function LinkModel({ isOpen, initialText, initialUrl, onConfirm, onCancel }: LinkModelProps) {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setText(initialText);
    setUrl(initialUrl || 'https://');
  }, [initialText, initialUrl]);

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
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999,
    }}>
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '20px',
        padding: '24px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Insert Link</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Text to display</label>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text"
              autoFocus
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--text-secondary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Link URL</label>
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && url) onConfirm(text, url);
              }}
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--text-secondary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onCancel}
            style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Cancel
          </button>
          <button 
            disabled={!url}
            onClick={() => onConfirm(text, url)}
            style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: url ? 'pointer' : 'not-allowed', transition: 'all 0.2s', backgroundColor: url ? 'var(--text-primary)' : 'rgba(255,255,255,0.15)', border: 'none', color: '#171717' }}
            onMouseOver={(e) => { if(url) e.currentTarget.style.opacity = '0.9'; }}
            onMouseOut={(e) => { if(url) e.currentTarget.style.opacity = '1'; }}
          >
            Insert Link
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
