import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

const LOCAL_STORAGE_KEY = 'archive_draft';

export interface Project {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useEditorSync(user: User | null) {
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const savedTimer = useRef<NodeJS.Timeout | null>(null);
  const projectsRef = useRef(projects);
  const activeProjectIdRef = useRef(activeProjectId);

  useEffect(() => { projectsRef.current = projects; }, [projects]);
  useEffect(() => { activeProjectIdRef.current = activeProjectId; }, [activeProjectId]);

  // Load initial content
  useEffect(() => {
    const loadContent = async () => {
      setIsInitializing(true);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 5000));
          const docSnap: any = await Promise.race([getDoc(docRef), timeoutPromise]);
          
          if (docSnap && docSnap.exists && docSnap.exists()) {
            const data = docSnap.data();
            if (data.projects) {
              setProjects(data.projects);
              const active = data.activeProjectId || Object.keys(data.projects)[0];
              setActiveProjectId(active);
              setContent(data.projects[active]?.content || '');
            } else if (data.content) {
              const newId = Date.now().toString();
              const newProject = { id: newId, title: 'Project 1', content: data.content, updatedAt: Date.now() };
              const newProjects = { [newId]: newProject };
              setProjects(newProjects);
              setActiveProjectId(newId);
              setContent(data.content);
              await setDoc(docRef, { projects: newProjects, activeProjectId: newId }, { merge: true });
            }
          } else {
            const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
            const newId = Date.now().toString();
            const newProject = { id: newId, title: 'Project 1', content: localDraft || '', updatedAt: Date.now() };
            const newProjects = { [newId]: newProject };
            
            setProjects(newProjects);
            setActiveProjectId(newId);
            setContent(localDraft || '');
            
            await Promise.race([setDoc(docRef, { projects: newProjects, activeProjectId: newId }), timeoutPromise]).catch(e => console.error(e));
            if (localDraft) localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        } catch (error: any) {
          console.error("Firestore Permission/Fetch Error:", error);
          const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
          setContent(localDraft || '');
        }
      } else {
        const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
        setContent(localDraft || '');
      }
      setIsInitializing(false);
    };

    loadContent();
  }, [user]);

  const markSaved = useCallback(() => {
    setSaveStatus('saved');
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaveStatus('idle'), 3000);
  }, []);

  // Handle content change (debounced autosave)
  const handleChange = (newContent: string) => {
    setContent(newContent);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      const currentProjectId = activeProjectIdRef.current;
      const currentProjects = projectsRef.current;

      if (user && currentProjectId) {
        setSaveStatus('saving');
        try {
          const updatedProject = {
            ...currentProjects[currentProjectId],
            content: newContent,
            updatedAt: Date.now()
          };
          const updatedProjects = { ...currentProjects, [currentProjectId]: updatedProject };
          setProjects(updatedProjects);

          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, { projects: updatedProjects }, { merge: true });
          markSaved();
        } catch (error: any) {
          console.error("Error saving to Firestore", error);
          setSaveStatus('error');
          if (error.code === 'permission-denied') {
            localStorage.setItem(LOCAL_STORAGE_KEY, newContent);
          }
        }
      } else if (!user) {
        localStorage.setItem(LOCAL_STORAGE_KEY, newContent);
      }
    }, 1500); // 1.5s debounce
  };

  // Manual save — force immediate Firestore write
  const manualSave = useCallback(async () => {
    const currentProjectId = activeProjectIdRef.current;
    const currentProjects = projectsRef.current;
    if (!user || !currentProjectId) return;
    setSaveStatus('saving');
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { projects: currentProjects, activeProjectId: currentProjectId }, { merge: true });
      markSaved();
    } catch (e) {
      console.error("Manual save failed:", e);
      setSaveStatus('error');
    }
  }, [user, markSaved]);

  const createProject = async () => {
    if (!user) return;
    const newId = Date.now().toString();
    const newProject = { id: newId, title: `Project ${Object.keys(projects).length + 1}`, content: '', updatedAt: Date.now() };
    const updatedProjects = { ...projects, [newId]: newProject };
    
    setProjects(updatedProjects);
    setActiveProjectId(newId);
    setContent('');
    
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { projects: updatedProjects, activeProjectId: newId }, { merge: true });
  };

  const switchProject = async (id: string) => {
    if (!user || !projects[id] || id === activeProjectId) return;
    setActiveProjectId(id);
    setContent(projects[id].content);
    
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { activeProjectId: id }, { merge: true });
  };

  const deleteProject = async (id: string) => {
    if (!user) return;
    const updatedProjects = { ...projects };
    delete updatedProjects[id];
    
    let newActiveId = activeProjectId;
    let newContent = content;
    
    if (activeProjectId === id) {
      const remainingIds = Object.keys(updatedProjects);
      if (remainingIds.length > 0) {
        newActiveId = remainingIds[0];
        newContent = updatedProjects[newActiveId].content;
      } else {
        const fallbackId = Date.now().toString();
        const fallbackProject = { id: fallbackId, title: 'Project 1', content: '', updatedAt: Date.now() };
        updatedProjects[fallbackId] = fallbackProject;
        newActiveId = fallbackId;
        newContent = '';
      }
    }
    
    setProjects(updatedProjects);
    setActiveProjectId(newActiveId);
    setContent(newContent);
    
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { projects: updatedProjects, activeProjectId: newActiveId }, { merge: true });
  };

  return { content, handleChange, isInitializing, projects, activeProjectId, createProject, switchProject, deleteProject, saveStatus, manualSave };
}
