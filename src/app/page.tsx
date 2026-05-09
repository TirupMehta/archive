"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEditorSync } from '@/hooks/useEditorSync';
import TopBar from '@/components/TopBar';
import BottomCard from '@/components/BottomCard';
import Sidebar from '@/components/Sidebar';
import FormattingToolbar from '@/components/FormattingToolbar';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import CodeBlockView from '@/components/CodeBlockView';

const extensions = [
  StarterKit.configure({
    codeBlock: false, // use our custom CodeBlock with copy button
  }),
  CodeBlock.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockView);
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      class: 'editor-link',
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  Placeholder.configure({
    placeholder: 'Start writing...',
  })
];

import ConfirmModel from '@/components/ConfirmModel';

export default function Home() {
  const { user, loading, isPro } = useAuth();
  const { content, handleChange, isInitializing, projects, activeProjectId, createProject, switchProject, deleteProject, saveStatus, manualSave } = useEditorSync(user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [currentActiveId, setCurrentActiveId] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    isFullScreen: false,
    isLightTheme: false,
    showCounter: false,
    showFormatting: false,
    showSpellcheck: false,
  });

  const editor = useEditor({
    extensions: extensions,
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `editor-textarea`,
        spellcheck: settings.showSpellcheck.toString(),
      }
    }
  });

  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: `editor-textarea`,
            spellcheck: settings.showSpellcheck.toString(),
          }
        }
      });
    }
  }, [settings.showSpellcheck, editor]);

  // Sync editor content when switching projects
  useEffect(() => {
    if (editor && activeProjectId && activeProjectId !== currentActiveId) {
      setCurrentActiveId(activeProjectId);
      setTimeout(() => {
        editor.commands.setContent(content);
      }, 0);
    }
  }, [activeProjectId, editor, content, currentActiveId]);

  if (loading || isInitializing) {
    return (
      <div className="editor-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  const plainText = editor ? editor.getText() : content.replace(/<[^>]*>?/gm, '');
  const words = plainText.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars = plainText.length;

  return (
    <>
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        projects={projects || {}} 
        activeProjectId={activeProjectId} 
        createProject={createProject} 
        switchProject={(id) => { switchProject(id); setIsSidebarOpen(false); }} 
        onDeleteClick={(id) => setProjectToDelete(id)} 
      />
      <TopBar 
        user={user} 
        settings={settings} 
        setSettings={setSettings} 
        editor={editor} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        deleteProject={deleteProject}
        activeProjectId={activeProjectId}
        saveStatus={saveStatus}
        manualSave={manualSave}
      />
      {editor && (
        <BubbleMenu 
          editor={editor} 
          shouldShow={({ editor }) => editor.isActive('link')}
        >
          <div className="link-bubble">
            <a 
              href={editor.getAttributes('link').href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-bubble-url"
            >
              {editor.getAttributes('link').href}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          </div>
        </BubbleMenu>
      )}
      {settings.showFormatting && <FormattingToolbar editor={editor} isPro={isPro} />}
      <main className="editor-container">
        <EditorContent editor={editor} style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }} />
      </main>
      {!user && <BottomCard />}
      {settings.showCounter && (
        <div className="counter-display">
          {words} words | {chars} characters
        </div>
      )}
      <ConfirmModel 
        isOpen={!!projectToDelete}
        title="Delete Project?"
        message="This will permanently delete this note. This action cannot be undone."
        onConfirm={() => {
          if (projectToDelete) deleteProject(projectToDelete);
          setProjectToDelete(null);
        }}
        onCancel={() => setProjectToDelete(null)}
      />
    </>
  );
}
