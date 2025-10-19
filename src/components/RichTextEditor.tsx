'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

const useEditorCommands = (editorRef: React.RefObject<HTMLDivElement | null>, handleContentChange: () => void, savedRange: Range | null, setSavedRange: (range: Range | null) => void): UseEditorCommandsReturn => {
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
      let range: Range;
      
      // Sử dụng vị trí đã lưu nếu có
      if (savedRange && editorRef.current.contains(savedRange.commonAncestorContainer)) {
        range = savedRange.cloneRange();
      } else if (selection && selection.rangeCount > 0) {
        const currentRange = selection.getRangeAt(0);
        
        // Kiểm tra xem selection có nằm trong editor không
        if (editorRef.current.contains(currentRange.commonAncestorContainer) || 
            editorRef.current.contains(currentRange.startContainer) || 
            editorRef.current.contains(currentRange.endContainer)) {
          range = currentRange.cloneRange();
        } else {
          // Nếu selection không trong editor, chèn vào cuối
          range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
        }
      } else {
        // Nếu không có selection, chèn vào cuối editor
        range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
      }
      
      // Chèn emoji
      range.deleteContents();
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
      range.collapse(false);
      
      // Cập nhật selection
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // Lưu vị trí mới sau khi chèn
      setSavedRange(range.cloneRange());
      
      // Trigger input event để cập nhật content
      const inputEvent = new Event('input', { bubbles: true });
      editorRef.current.dispatchEvent(inputEvent);
      
      handleContentChange();
    }
  }, [editorRef, handleContentChange, savedRange, setSavedRange]);

  return { executeCommand, insertEmoji };
};

export default function RichTextEditor({ 
  content, 
  onChange, 
  fontFamily = "Inter, Arial, sans-serif",
  className = ""
}: RichTextEditorProps) {
  // State để lưu vị trí con trỏ
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Use custom hooks
  const { editorRef, handleContentChange } = useEditorContent(content, onChange);
  const { executeCommand, insertEmoji } = useEditorCommands(editorRef, handleContentChange, savedRange, setSavedRange);

  // Cập nhật font family khi prop thay đổi
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.fontFamily = fontFamily;
    }
  }, [fontFamily, editorRef]);

  // Lưu vị trí con trỏ hiện tại
  const saveCursorPosition = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer) || 
            editorRef.current.contains(range.startContainer) || 
            editorRef.current.contains(range.endContainer)) {
          setSavedRange(range.cloneRange());
        }
      }
    }
  }, [editorRef]);


  // Lưu vị trí con trỏ khi click vào editor
  const handleEditorClick = useCallback(() => {
    saveCursorPosition();
  }, [saveCursorPosition]);

  // Lưu vị trí con trỏ khi di chuyển
  const handleSelectionChange = useCallback(() => {
    saveCursorPosition();
  }, [saveCursorPosition]);

  // Xử lý paste để áp dụng font family
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData;
    const pastedText = clipboardData.getData('text/plain');
    
    if (pastedText && editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Xóa nội dung được chọn
        range.deleteContents();
        
        // Tạo text node với font family
        const textNode = document.createTextNode(pastedText);
        range.insertNode(textNode);
        range.collapse(false);
        
        // Áp dụng font family cho toàn bộ editor
        if (editorRef.current) {
          editorRef.current.style.fontFamily = fontFamily;
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
        handleContentChange();
      }
    }
  }, [fontFamily, handleContentChange, editorRef]);

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
          onMouseUp={handleSelectionChange}
          onKeyDown={saveCursorPosition}
          onMouseDown={saveCursorPosition}
          onPaste={handlePaste}
          className={`${EDITOR_CONFIG.minHeight} ${EDITOR_CONFIG.maxHeight} overflow-auto focus:outline-none ${EDITOR_CONFIG.fontSize} ${EDITOR_CONFIG.textAlign}`}
          style={{ fontFamily }}
          role="textbox"
          aria-label="Rich text editor"
        />
      </div>

    </div>
  );
}