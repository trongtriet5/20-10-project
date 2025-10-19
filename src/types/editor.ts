// Types for Rich Text Editor
export interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  fontFamily?: string;
  className?: string;
}

export interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  buttonClassName?: string;
  popupClassName?: string;
}

export interface ToolbarButton {
  command: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

export interface EditorConfig {
  minHeight: string;
  maxHeight: string;
  fontSize: string;
  textAlign: string;
}

export interface PopupConfig {
  width: string;
  height: string;
  gridCols: string;
  emojiSize: string;
  textSize: string;
}

export interface ScrollbarHiddenStyles {
  scrollbarWidth: string;
  msOverflowStyle: string;
  WebkitScrollbar: { display: string };
}

// Custom hook return types
export interface UseEditorContentReturn {
  editorRef: React.RefObject<HTMLDivElement | null>;
  handleContentChange: () => void;
}

export interface UseEditorCommandsReturn {
  executeCommand: (command: string, value?: string) => void;
  insertEmoji: (emoji: string) => void;
}
