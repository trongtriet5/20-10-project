'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import EmojiPicker from './EmojiPicker';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight
} from 'lucide-react';
import type { 
  RichTextEditorProps, 
  ToolbarButton, 
  EditorConfig, 
  UseEditorContentReturn, 
  UseEditorCommandsReturn 
} from '../types/editor';

// Constants
const EDITOR_CONFIG: EditorConfig = {
  minHeight: 'min-h-28',
  maxHeight: 'max-h-80',
  fontSize: 'text-base sm:text-lg',
  textAlign: 'text-justify'
};

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { command: 'bold', icon: Bold, title: 'In đậm' },
  { command: 'italic', icon: Italic, title: 'In nghiêng' },
  { command: 'underline', icon: UnderlineIcon, title: 'Gạch chân' }
];

const ALIGNMENT_BUTTONS: ToolbarButton[] = [
  { command: 'justifyLeft', icon: AlignLeft, title: 'Căn trái' },
  { command: 'justifyCenter', icon: AlignCenter, title: 'Căn giữa' },
  { command: 'justifyRight', icon: AlignRight, title: 'Căn phải' }
];

// Custom hooks
const useEditorContent = (content: string, onChange: (content: string) => void): UseEditorContentReturn => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  return { editorRef, handleContentChange };
};

const useEditorCommands = (editorRef: React.RefObject<HTMLDivElement | null>, handleContentChange: () => void): UseEditorCommandsReturn => {
  const executeCommand = useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleContentChange();
    }
  }, [editorRef, handleContentChange]);

  const insertEmoji = useCallback((emoji: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      
      // Nếu có selection và nằm trong editor
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          // Chèn emoji tại vị trí con trỏ hiện tại
          range.deleteContents();
          range.insertNode(document.createTextNode(emoji));
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // Nếu selection không trong editor, chèn vào cuối
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          range.insertNode(document.createTextNode(emoji));
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        // Nếu không có selection, tạo range tại cuối editor
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        range.insertNode(document.createTextNode(emoji));
        range.collapse(false);
        
        const newSelection = window.getSelection();
        if (newSelection) {
          newSelection.removeAllRanges();
          newSelection.addRange(range);
        }
      }
      handleContentChange();
    }
  }, [editorRef, handleContentChange]);

  return { executeCommand, insertEmoji };
};

export default function RichTextEditor({ 
  content, 
  onChange, 
  fontFamily = "Inter, Arial, sans-serif",
  className = ""
}: RichTextEditorProps) {
  // Use custom hooks
  const { editorRef, handleContentChange } = useEditorContent(content, onChange);
  const { executeCommand, insertEmoji } = useEditorCommands(editorRef, handleContentChange);

  // Memoized toolbar buttons
  const toolbarButtons = useMemo(() => TOOLBAR_BUTTONS, []);
  const alignmentButtons = useMemo(() => ALIGNMENT_BUTTONS, []);

  // Lưu vị trí con trỏ khi click vào editor
  const handleEditorClick = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [editorRef]);

  // Memoized components
  const ToolbarButton = useCallback(({ command, icon: Icon, title }: { command: string; icon: any; title: string }) => (
    <button
      onClick={() => executeCommand(command)}
      className="p-2 rounded hover:bg-pink-100 text-pink-600 transition-colors"
      title={title}
      aria-label={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  ), [executeCommand]);

  const AlignmentButton = useCallback(({ command, icon: Icon, title }: { command: string; icon: any; title: string }) => (
    <button
      onClick={() => executeCommand(command)}
      className="p-2 rounded hover:bg-pink-100 text-pink-600 transition-colors"
      title={title}
      aria-label={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  ), [executeCommand]);

  // Kiểm tra trạng thái format
  const isActive = (command: string) => {
    return document.queryCommandState(command);
  };

  return (
    <div className={`bg-white/80 rounded-xl border-2 border-pink-100 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-pink-100 flex-wrap">
        {/* Text formatting */}
        <button
          onClick={() => executeCommand('bold')}
          className={`px-2 py-1 rounded hover:bg-pink-100 text-pink-600 transition-colors ${
            isActive('bold') ? 'bg-pink-100' : ''
          }`}
          title="In đậm"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => executeCommand('italic')}
          className={`px-2 py-1 rounded hover:bg-pink-100 text-pink-600 transition-colors ${
            isActive('italic') ? 'bg-pink-100' : ''
          }`}
          title="In nghiêng"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => executeCommand('underline')}
          className={`px-2 py-1 rounded hover:bg-pink-100 text-pink-600 transition-colors ${
            isActive('underline') ? 'bg-pink-100' : ''
          }`}
          title="Gạch chân"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-pink-200 mx-1" />

        {/* Text alignment */}
        <button
          onClick={() => executeCommand('justifyLeft')}
          className={`px-2 py-1 rounded hover:bg-pink-100 text-pink-600 transition-colors`}
          title="Căn trái"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => executeCommand('justifyCenter')}
          className={`px-2 py-1 rounded hover:bg-pink-100 text-pink-600 transition-colors`}
          title="Căn giữa"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => executeCommand('justifyRight')}
          className={`px-2 py-1 rounded hover:bg-pink-100 text-pink-600 transition-colors`}
          title="Căn phải"
        >
          <AlignRight className="w-4 h-4" />
        </button>


        {/* Emoji picker */}
        <div className="ml-auto">
          <EmojiPicker 
            onSelect={insertEmoji}
            buttonClassName="px-2 py-1 rounded hover:bg-pink-100 text-pink-600 transition-colors flex items-center gap-1"
            popupClassName="border-pink-200"
          />
        </div>
      </div>

      {/* Editor content */}
      <div className="p-3 sm:p-4">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          onClick={handleEditorClick}
          onKeyUp={handleEditorClick}
          className={`${EDITOR_CONFIG.minHeight} ${EDITOR_CONFIG.maxHeight} overflow-auto focus:outline-none ${EDITOR_CONFIG.fontSize} ${EDITOR_CONFIG.textAlign}`}
          style={{ fontFamily }}
          role="textbox"
          aria-label="Rich text editor"
        />
      </div>

    </div>
  );
}