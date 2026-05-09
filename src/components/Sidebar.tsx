"use client";

import { User } from 'firebase/auth';
import { Project } from '@/hooks/useEditorSync';
import { useState } from 'react';
import ConfirmModel from './ConfirmModel';

interface SidebarProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  projects: Record<string, Project>;
  activeProjectId: string | null;
  createProject: () => void;
  switchProject: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export default function Sidebar({ user, isOpen, onClose, projects, activeProjectId, createProject, switchProject, onDeleteClick }: SidebarProps) {
  if (!user) return null;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Archive</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <button className="new-project-btn" onClick={createProject}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Project
        </button>

        <div className="project-list">
          {Object.values(projects)
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map(project => (
            <div 
              key={project.id} 
              className={`project-item ${activeProjectId === project.id ? 'active' : ''}`}
              onClick={() => switchProject(project.id)}
            >
              <div className="project-info">
                <span className="project-title">{project.title}</span>
                <span className="project-preview">
                  {project.content.replace(/<[^>]*>?/gm, '').substring(0, 30) || 'Empty note...'}
                </span>
              </div>
              <button 
                className="delete-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(project.id);
                }}
                aria-label="Delete project"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
