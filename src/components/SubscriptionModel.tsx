"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SubscriptionModelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModel({ isOpen, onClose }: SubscriptionModelProps) {
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
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999999,
      backdropFilter: 'blur(10px)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#1e1e1e',
        border: '1px solid #262626',
        borderRadius: '28px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#ededed', letterSpacing: '-0.5px' }}>Archive Pro</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#a1a1aa' }}>Elevate your writing experience</p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ededed'}
            onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
          {[
            { title: 'AI Auto-formatting', desc: 'Gemini AI optimizes your structure, grammar, and typos.', icon: 'M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z' },
            { title: 'Infinite Voice Typing', desc: 'Dictate documents without limits or interruptions.', icon: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' },
            { title: 'Early Access', desc: 'Be the first to test upcoming experimental features.', icon: 'm13 2-2 10h9L11 22l2-10H4l9-10z' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#ededed' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}></path></svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#ededed' }}>{item.title}</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#a1a1aa', lineHeight: '1.4' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#262626', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#a1a1aa' }}>Activation is <strong>free</strong>. Contact the developer to unlock.</p>
          <a 
            href="mailto:contact@tirup.in?subject=Archive Pro Activation" 
            style={{ 
              display: 'block',
              width: '100%',
              padding: '14px',
              backgroundColor: '#ededed',
              color: '#171717',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 700,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Contact to Activate
          </a>
        </div>

        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: '8px' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#ededed'}
          onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}
        >
          Maybe Later
        </button>
      </div>
    </div>,
    document.body
  );
}
