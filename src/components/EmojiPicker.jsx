import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Smile, Search, X } from 'lucide-react';

// Constants
const EMOJI_CATEGORIES = {
  FACES: [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'
  ],
  HEARTS: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌'
  ],
  NATURE: [
    '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌿', '🍀', '🌱', '🌵',
    '🌳', '🌲', '🌴', '🌾', '🍃', '🍂', '🍁', '🌰', '🌙', '⭐',
    '🌟', '💫', '✨', '☀️', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕',
    '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌝', '🌞', '🪐'
  ],
  ANIMALS: [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔',
    '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺',
    '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟',
    '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙'
  ],
  FOOD: [
    '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒',
    '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬',
    '🥒', '🌶️', '🫒', '🌽', '🥕', '🫑', '🥔', '🍠', '🥐', '🥖',
    '🍞', '🥨', '🥯', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓',
    '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥙',
    '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲'
  ],
  ACTIVITIES: [
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🪀',
    '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁',
    '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌',
    '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾',
    '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴',
    '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️'
  ],
  SPECIAL: [
    '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🏅', '🎖️', '🏵️', '🎗️',
    '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧',
    '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲',
    '♠️', '♥️', '♦️', '♣️', '♟️', '🃏', '🀄', '🎴', '🎯', '🎳',
    '🎮', '🎰', '🧩', '🚀', '🛸', '🛰️', '💫', '⭐', '🌟', '✨',
    '☄️', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑',
    '🌒', '🌓', '🌔', '🌝', '🌞', '🪐', '🌍', '🌎', '🌏', '🗺️'
  ]
};

// Flatten all emojis into a single array
const EMOJI_DATA = Object.values(EMOJI_CATEGORIES).flat();

// Constants for styling
const POPUP_CONFIG: PopupConfig = {
  width: 'w-80',
  height: 'h-96',
  gridCols: 'grid-cols-8',
  emojiSize: 'w-8 h-8',
  textSize: 'text-lg'
};

const SCROLLBAR_HIDDEN_STYLES: ScrollbarHiddenStyles = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitScrollbar: { display: 'none' }
};

// Custom hook for click outside detection
const useClickOutside = (refs, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = refs.every(ref => 
        ref.current && !ref.current.contains(event.target)
      );
      if (isOutside) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refs, callback]);
};

// Custom hook for emoji filtering
const useEmojiFilter = (searchTerm) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return EMOJI_DATA;
    
    return EMOJI_DATA.filter(emoji => 
      emoji.includes(searchTerm) || 
      searchTerm.toLowerCase().includes(emoji)
    );
  }, [searchTerm]);
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ 
  onSelect, 
  buttonClassName = '', 
  popupClassName = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Use custom hooks
  const filteredEmojis = useEmojiFilter(searchTerm);
  
  // Memoized callbacks
  const handleEmojiSelect = useCallback((emoji) => {
    onSelect(emoji);
    setIsOpen(false);
    setSearchTerm('');
  }, [onSelect]);

  const togglePopup = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setSearchTerm('');
      return !prev;
    });
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  // Use click outside hook
  useClickOutside([popupRef, buttonRef], closePopup);

  return (
    <div className="relative">
      {/* Nút emoji */}
      <button
        ref={buttonRef}
        onClick={togglePopup}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg 
          hover:bg-gray-100 transition-colors duration-200
          ${isOpen ? 'bg-gray-100' : ''}
          ${buttonClassName}
        `}
        title="Chọn emoji"
        aria-label="Mở emoji picker"
      >
        <Smile className="w-5 h-5 text-gray-600" />
      </button>

      {/* Popup emoji picker */}
      {isOpen && (
        <div
          ref={popupRef}
          className={`
            absolute bottom-full right-0 mb-2 ${POPUP_CONFIG.width} ${POPUP_CONFIG.height} 
            bg-white rounded-xl shadow-2xl border border-gray-200 z-50
            flex flex-col overflow-hidden
            ${popupClassName}
          `}
          role="dialog"
          aria-label="Emoji picker"
        >
          {/* Header với thanh tìm kiếm */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Chọn emoji</h3>
              <button
                onClick={closePopup}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Đóng emoji picker"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            {/* Thanh tìm kiếm */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm emoji..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Grid emoji */}
          <div 
            className="flex-1 overflow-y-auto p-2" 
            style={SCROLLBAR_HIDDEN_STYLES}
          >
            <div className={`grid ${POPUP_CONFIG.gridCols} gap-1`}>
              {filteredEmojis.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`
                    ${POPUP_CONFIG.emojiSize} flex items-center justify-center ${POPUP_CONFIG.textSize} 
                    rounded-lg hover:bg-gray-100 hover:scale-110 transition-all duration-200
                    active:scale-95
                  `}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            {/* Thông báo khi không tìm thấy */}
            {filteredEmojis.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <p className="text-sm">Không tìm thấy emoji nào</p>
              </div>
            )}
          </div>

          {/* Footer với thông tin */}
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {filteredEmojis.length} emoji
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
