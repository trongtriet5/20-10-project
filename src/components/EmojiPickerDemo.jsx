import React, { useState } from 'react';
import EmojiPicker from './EmojiPicker';

// Demo component để minh họa cách sử dụng EmojiPicker
const EmojiPickerDemo = () => {
  const [text, setText] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState([]);

  const handleSelect = (emoji) => {
    setText(text + emoji);
  };

  const handleAddToList = (emoji) => {
    setSelectedEmojis([...selectedEmojis, emoji]);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">EmojiPicker Demo</h1>
      
      {/* Demo 1: Chat Input */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">1. Chat Input</h2>
        <div className="relative flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tin nhắn..."
          />
          <EmojiPicker onSelect={handleSelect} />
        </div>
        <p className="text-sm text-gray-500">Text hiện tại: {text}</p>
      </div>

      {/* Demo 2: Emoji List */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">2. Emoji Collection</h2>
        <div className="flex items-center gap-2">
          <EmojiPicker 
            onSelect={handleAddToList}
            buttonClassName="bg-pink-100 hover:bg-pink-200"
          />
          <span className="text-sm text-gray-600">Click để thêm emoji vào danh sách</span>
        </div>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-16">
          {selectedEmojis.length > 0 ? (
            selectedEmojis.map((emoji, index) => (
              <span key={index} className="text-2xl">{emoji}</span>
            ))
          ) : (
            <p className="text-gray-400 text-sm">Chưa có emoji nào được chọn</p>
          )}
        </div>
      </div>

      {/* Demo 3: Custom Styling */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">3. Custom Styling</h2>
        <div className="flex items-center gap-4">
          <EmojiPicker 
            onSelect={(emoji) => console.log('Custom emoji selected:', emoji)}
            buttonClassName="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            popupClassName="border-blue-200"
          />
          <EmojiPicker 
            onSelect={(emoji) => console.log('Green emoji selected:', emoji)}
            buttonClassName="bg-green-500 hover:bg-green-600 text-white rounded-lg"
            popupClassName="border-green-200"
          />
          <EmojiPicker 
            onSelect={(emoji) => console.log('Purple emoji selected:', emoji)}
            buttonClassName="bg-purple-500 hover:bg-purple-600 text-white rounded-md"
            popupClassName="border-purple-200"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Cách sử dụng:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click vào nút emoji để mở popup</li>
          <li>• Sử dụng thanh tìm kiếm để lọc emoji</li>
          <li>• Click vào emoji để chọn</li>
          <li>• Click ra ngoài để đóng popup</li>
          <li>• Tùy chỉnh giao diện với props buttonClassName và popupClassName</li>
        </ul>
      </div>
    </div>
  );
};

export default EmojiPickerDemo;
