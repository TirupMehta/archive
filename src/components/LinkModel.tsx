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
        maxWidth: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 700, color: '#ededed', fontFamily: 'Inter, sans-serif' }}>Insert Link</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Text to display</label>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text"
              autoFocus
              style={{ width: '100%', padding: '14px 18px', backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px', color: '#ededed', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#404040'}
              onBlur={(e) => e.target.style.borderColor = '#262626'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Link URL</label>
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && url) onConfirm(text, url);
              }}
              style={{ width: '100%', padding: '14px 18px', backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px', color: '#ededed', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#404040'}
              onBlur={(e) => e.target.style.borderColor = '#262626'}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onCancel}
            style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: 'transparent', border: '1px solid #262626', color: '#ededed', fontFamily: 'inherit' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#262626'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Cancel
          </button>
          <button 
            disabled={!url}
            onClick={() => onConfirm(text, url)}
            style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: url ? 'pointer' : 'not-allowed', transition: 'all 0.2s', backgroundColor: url ? '#ededed' : 'rgba(255,255,255,0.1)', border: 'none', color: '#171717', fontFamily: 'inherit' }}
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
