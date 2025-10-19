// Types for the main application

export interface WishData {
  name: string;
  message: string;
  iconIndex: number;
  font: string;
}

export interface ShareData {
  url: string;
  shortUrl?: string;
  data: WishData;
}

export interface AppState {
  name: string;
  showWish: boolean;
  showFireworks: boolean;
  showLetter: boolean;
  isMuted: boolean;
  showMusicPrompt: boolean;
  isInitialized: boolean;
  copied: boolean;
  editorHtml: string;
  selectedIconIndex: number | null;
  selectedWish: string | null;
  mode: 'self' | 'send';
  selectedFont: string;
  isLoadingSharedData: boolean;
  showQRCode: boolean;
  shareUrl: string;
}

export interface IconData {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  name: string;
}

export interface FontOption {
  value: string;
  label: string;
  isGoogleFont?: boolean;
}
