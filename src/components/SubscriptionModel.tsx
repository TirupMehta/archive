"use client";
import { useEffect } from 'react';

interface SubscriptionModelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModel({ isOpen, onClose }: SubscriptionModelProps) {
  if (!isOpen) return null;

  return (
    <div className="Model-overlay">
      <div className="Model-content sub-premium-Model">
        <div className="sub-header">
          <div className="sub-header-content">
            <h2>Archive Pro</h2>
            <p>Elevate your writing experience</p>
          </div>
          <button className="sub-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="pro-grid">
          <div className="pro-item">
            <div className="pro-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"></path><path d="M12 10V3"></path><path d="M12 21v-7"></path><path d="M12 14l-4-4"></path><path d="M12 14l4-4"></path></svg>
            </div>
            <div className="pro-info">
              <h4>AI Auto-formatting</h4>
              <p>Gemini AI optimizes your structure, grammar, and typos.</p>
            </div>
          </div>
          <div className="pro-item">
            <div className="pro-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </div>
            <div className="pro-info">
              <h4>Infinite Voice Typing</h4>
              <p>Dictate documents without limits or interruptions.</p>
            </div>
          </div>
          <div className="pro-item">
            <div className="pro-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 10h9L11 22l2-10H4l9-10z"></path></svg>
            </div>
            <div className="pro-info">
              <h4>Early Access</h4>
              <p>Be the first to test upcoming experimental features.</p>
            </div>
          </div>
        </div>

        <div className="sub-footer">
          <p>Activation is <strong>free</strong>. Contact the developer to unlock.</p>
          <a href="mailto:tirupmehta1@gmail.com?subject=Archive Pro Activation" className="sub-action-btn">
            Contact to Activate
          </a>
        </div>

        <button className="sub-secondary-btn" onClick={onClose}>
          Maybe Later
        </button>
      </div>
    </div>
  );
}
