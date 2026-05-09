"use client";

import { Editor } from '@tiptap/react';
import { useState, useEffect } from 'react';
import LinkModel from './LinkModel';
import SubscriptionModel from './SubscriptionModel';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/useToast';

interface FormattingToolbarProps {
  editor: Editor | null;
  isPro?: boolean;
}

export default function FormattingToolbar({ editor, isPro }: FormattingToolbarProps) {
  const { showToast } = useToast();
  const [, setUpdate] = useState(0);
  const [linkModelState, setLinkModelState] = useState({
    isOpen: false,
    text: '',
    url: ''
  });
  const [isSubModelOpen, setIsSubModelOpen] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  useEffect(() => {
    if (!editor) return;
    const handler = () => setUpdate(s => s + 1);
    editor.on('transaction', handler);
    editor.on('selectionUpdate', handler);
    editor.on('update', handler);
    return () => {
      editor.off('transaction', handler);
      editor.off('selectionUpdate', handler);
      editor.off('update', handler);
    };
  }, [editor]);

  if (!editor) return null;

  const isActive = (type: string, options?: any) => editor.isActive(type, options);

  const openLinkModel = () => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ');
    const url = editor.getAttributes('link').href || '';
    setLinkModelState({ isOpen: true, text, url });
  };

  const handleLinkConfirm = (text: string, url: string) => {
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const { from, to } = editor.state.selection;
      if (from === to && text) {
        // Inserting a new link at cursor
        editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
      } else {
        // Updating existing link or selected text
        editor.chain().focus().extendMarkRange('link').insertContent(`<a href="${url}">${text || url}</a>`).run();
      }
    }
    setLinkModelState({ ...linkModelState, isOpen: false });
  };

  const handleAutoFormat = async () => {
    if (!isPro) {
      setIsSubModelOpen(true);
      return;
    }

    if (isFormatting) return;

    const content = editor.getHTML();
    if (!content || content === '<p></p>') return;

    setIsFormatting(true);
    
    try {
      const { getAI, getGenerativeModel, GoogleAIBackend } = await import("firebase/ai");
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, { model: "gemini-3-flash-preview" });

      const prompt = `You are an expert digital content designer and editor.
      Task: Transform the provided messy text into a beautifully structured, professional document that looks stunning in a minimalist note-taking app.
      
      Instructions:
      1. FIX: Correct all grammar, spelling, and punctuation errors.
      2. STRUCTURE: Use appropriate HTML tags (<h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>) to make the content organized and easy to read.
      3. TOPIC: Ensure the flow is logical. Add headings where they make sense based on the content's topics.
      4. SPACING (CRITICAL): 
         - Always insert an empty paragraph <p></p> before every heading UNLESS it is the very first element.
         - Always insert an empty paragraph <p></p> after every heading before the content begins.
         - When switching between two different topics or sections, add TWO empty paragraphs <p></p><p></p> to create a clear visual separation.
         - Never place headings or paragraphs back to back without breathing room.
      5. CODE BLOCKS (CRITICAL): Any code, commands, file paths, or technical snippets MUST be wrapped in <pre><code>...</code></pre> tags. Never put code inline in a paragraph. Each code block must be on its own line, separated from surrounding text by empty <p></p> paragraphs.
      6. CONSTRAINTS: DO NOT remove any information. DO NOT change the core meaning. Just make it look professional and well-formatted.
      7. LINKS: ABSOLUTELY PRESERVE all <a> tags (hyperlinks). Do not remove links or change their URLs.
      8. OUTPUT: Return ONLY the raw HTML string. No markdown code blocks, no intro, no outro.
      
      Content to transform: ${content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();

      editor.commands.setContent(text);
    } catch (e) {
      console.error("AI Formatting Error:", e);
      showToast("AI formatting failed. Please check your internet.");
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <>
      <LinkModel 
        isOpen={linkModelState.isOpen}
        initialText={linkModelState.text}
        initialUrl={linkModelState.url}
        onConfirm={handleLinkConfirm}
        onCancel={() => setLinkModelState({ ...linkModelState, isOpen: false })}
      />
      <SubscriptionModel 
        isOpen={isSubModelOpen} 
        onClose={() => setIsSubModelOpen(false)} 
      />
      <div className="toolbar-wrapper">
        <div className="formatting-toolbar">
          <button 
            onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('bold') ? 'active' : ''}`} 
          style={{ fontWeight: 800 }} 
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          B
        </button>
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('italic') ? 'active' : ''}`} 
          style={{ fontStyle: 'italic', fontWeight: 600 }} 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          /
        </button>
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('underline') ? 'active' : ''}`} 
          style={{ textDecoration: 'underline' }} 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          U
        </button>
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('strike') ? 'active' : ''}`} 
          style={{ textDecoration: 'line-through' }} 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          S
        </button>
        
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('link') ? 'active' : ''}`} 
          onClick={openLinkModel}
          title="Link"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </button>

        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('codeBlock') ? 'active' : ''}`} 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>
        
        <div className="toolbar-separator"></div>
        
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('heading', { level: 1 }) ? 'active' : ''}`} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          H1
        </button>
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('heading', { level: 2 }) ? 'active' : ''}`} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          H2
        </button>
        
        <div className="toolbar-separator"></div>
        
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('orderedList') ? 'active' : ''}`} 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
        </button>
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isActive('bulletList') ? 'active' : ''}`} 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>

        <div className="toolbar-separator"></div>
        
        <button 
          onMouseDown={(e) => e.preventDefault()} 
          className={`toolbar-btn ${isFormatting ? 'formatting' : ''}`} 
          onClick={handleAutoFormat}
          disabled={isFormatting}
          title={isFormatting ? "AI is working..." : "AI Auto-format (Pro)"}
        >
          {isFormatting ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinning">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: isPro ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          )}
          </button>
        </div>
      </div>
    </>
  );
}
