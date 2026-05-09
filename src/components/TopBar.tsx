"use client";

import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { signOut, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmModel from './ConfirmModel';
import { useAuth } from '@/hooks/useAuth';

import { useToast } from '@/hooks/useToast';
import { SaveStatus } from '@/hooks/useEditorSync';

interface TopBarProps {
  user: User | null;
  settings: {
    isFullScreen: boolean;
    isLightTheme: boolean;
    showCounter: boolean;
    showFormatting: boolean;
    showSpellcheck: boolean;
  };
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  editor?: any;
  toggleSidebar?: () => void;
  deleteProject?: (id: string) => void;
  activeProjectId?: string | null;
  saveStatus?: SaveStatus;
  manualSave?: () => Promise<void>;
}

export default function TopBar({ user, settings, setSettings, editor, toggleSidebar, deleteProject, activeProjectId, saveStatus, manualSave }: TopBarProps) {
  const { showToast } = useToast();
  const { isPro } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [ModelState, setModelState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Delete',
    confirmColor: '#ef4444'
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleDeleteAccount = () => {
    setModelState({
      isOpen: true,
      title: 'Delete Account?',
      message: 'This will permanently delete your account and all projects. This action cannot be undone.',
      onConfirm: async () => {
        if (!user) return;
        try {
          const { deleteDoc, doc } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase');
          await deleteDoc(doc(db, 'users', user.uid));
          await user.delete();
          showToast("Account deleted successfully.");
          router.push('/');
        } catch (error: any) {
          if (error.code === 'auth/requires-recent-login') {
            showToast("Please sign out and sign back in to delete your account.");
          }
        }
        setModelState(s => ({ ...s, isOpen: false }));
      },
      confirmText: 'Delete Everything',
      confirmColor: '#ef4444'
    });
  };

  const handleDeleteCurrentProject = () => {
    if (!deleteProject || !activeProjectId) return;
    setModelState({
      isOpen: true,
      title: 'Delete Project?',
      message: 'Are you sure you want to delete this project? All notes will be permanently removed.',
      onConfirm: () => {
        deleteProject(activeProjectId);
        setMenuOpen(false);
        setModelState(s => ({ ...s, isOpen: false }));
      },
      confirmText: 'Delete Project',
      confirmColor: '#ef4444'
    });
  };

  const handleExport = () => {
    if (!editor) return;
    const text = editor.getText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Archive_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleDictation = () => {
    if (!editor) return;
    
    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice typing isn't fully supported by your browser. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        editor.chain().focus().insertContent(finalTranscript + ' ').run();
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'network') {
        showToast("Voice typing is currently unavailable. Please check your browser's privacy shields or connection.");
      } else if (event.error === 'not-allowed') {
        showToast("Microphone access is required for voice typing.");
      } else {
        showToast("Voice typing stopped unexpectedly.");
      }
      setIsDictating(false);
    };

    recognition.onend = () => {
      setIsDictating(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsDictating(true);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
      setSettings((s: any) => ({ ...s, isFullScreen: true }));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setSettings((s: any) => ({ ...s, isFullScreen: false }));
      }
    }
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = !settings.isLightTheme;
    setSettings((s: any) => ({ ...s, isLightTheme: newTheme }));
    if (newTheme) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    setMenuOpen(false);
  };



  const toggleCounter = () => {
    setSettings((s: any) => ({ ...s, showCounter: !s.showCounter }));
    setMenuOpen(false);
  };

  const toggleFormatting = () => {
    setSettings((s: any) => ({ ...s, showFormatting: !s.showFormatting }));
    setMenuOpen(false);
  };

  const toggleSpellcheck = () => {
    setSettings((s: any) => ({ ...s, showSpellcheck: !s.showSpellcheck }));
    setMenuOpen(false);
  };

  return (
    <header className="top-bar">
      <ConfirmModel 
        isOpen={ModelState.isOpen}
        title={ModelState.title}
        message={ModelState.message}
        onConfirm={ModelState.onConfirm}
        onCancel={() => setModelState(s => ({ ...s, isOpen: false }))}
        confirmText={ModelState.confirmText}
        confirmColor={ModelState.confirmColor}
      />

      <div className="top-left">
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'inherit', gap: '8px', padding: 0 }}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.displayName || 'Signed In'}</span>
            {isPro && <span className="pro-badge">PRO</span>}
          </div>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Sign in</Link>
        )}
      </div>
      <div className="top-right">
        <button className="icon-btn" onClick={toggleDictation}
          style={{ color: isDictating ? '#ef4444' : 'inherit' }}
          title="Voice Typing"
        >
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
        </button>
        {user && manualSave && (
          <button 
            className="icon-btn save-btn" 
            onClick={manualSave}
            title={saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Save failed' : 'Save to cloud'}
            style={{ color: saveStatus === 'saved' ? 'var(--text-primary)' : saveStatus === 'error' ? '#ef4444' : saveStatus === 'saving' ? 'var(--text-secondary)' : 'inherit' }}
          >
            {saveStatus === 'saving' ? (
              <svg className="icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
            ) : saveStatus === 'saved' ? (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : saveStatus === 'error' ? (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            ) : (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            )}
          </button>
        )}
        <button className="icon-btn" onClick={handleExport} title="Export as .txt">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </button>
        <div className="menu-container">
          <button 
            ref={btnRef}
            id="menu-btn" 
            className={`icon-btn ${menuOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="19" cy="12" r="1.5"></circle>
              <circle cx="5" cy="12" r="1.5"></circle>
            </svg>
          </button>
          <div ref={menuRef} id="dropdown-menu" className={`dropdown-menu ${!menuOpen ? 'hidden' : ''}`}>
            <button className="dropdown-item" onClick={toggleFullScreen}>
              {settings.isFullScreen ? 'Exit full screen' : 'Full screen'}
            </button>
            <button className="dropdown-item" onClick={toggleTheme}>
              {settings.isLightTheme ? 'Dark theme' : 'Light theme'}
            </button>
            <div className="separator"></div>
            <button className="dropdown-item" onClick={toggleCounter}>
              {settings.showCounter ? 'Hide counter' : 'Show counter'}
            </button>
            <button className="dropdown-item" onClick={toggleFormatting}>
              {settings.showFormatting ? 'Hide formatting' : 'Show formatting'}
            </button>
            <button className="dropdown-item" onClick={toggleSpellcheck}>
              {settings.showSpellcheck ? 'Hide spellcheck' : 'Show spellcheck'}
            </button>
            <div className="separator"></div>
            {user ? (
              <>
                <button className="dropdown-item" onClick={handleSignOut}>Sign Out</button>
                <div className="separator"></div>
                <button className="dropdown-item" style={{ color: '#ef4444' }} onClick={handleDeleteCurrentProject}>Delete Current Project</button>
                <button className="dropdown-item" style={{ color: '#ef4444' }} onClick={handleDeleteAccount}>Delete Account</button>
              </>
            ) : (
              <button className="dropdown-item" onClick={() => router.push('/login')}>Sign in for more...</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
