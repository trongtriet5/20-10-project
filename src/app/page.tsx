'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Download, Volume2, VolumeX, Link as LinkIcon, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import Fireworks from '@/components/Fireworks';
import RichTextEditor from '@/components/RichTextEditor';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { encodeForUrl } from '@/utils/base64';

function HomeContent() {
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [showWish, setShowWish] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editorHtml, setEditorHtml] = useState('');
  const [selectedWish, setSelectedWish] = useState<string | null>(null);
  const [mode, setMode] = useState<'self' | 'send'>('self');
  const [selectedFont, setSelectedFont] = useState<string>("Inter, Arial, sans-serif");
  const [isLoadingSharedData, setIsLoadingSharedData] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load shared data if URL contains it
  useEffect(() => {
    const d = searchParams.get('d');
    if (d) {
      setIsLoadingSharedData(true);
      try {
        // Decode shared data
        const json = decodeURIComponent(escape(atob(d)));
        const sharedData = JSON.parse(json) as { name: string; message: string; font?: string };
        
        // Set the shared data but don't show wish yet
        setName(sharedData.name);
        setSelectedFont(sharedData.font || "Inter, Arial, sans-serif");
        setMode('send');
        
        // Auto-trigger the letter opening animation first
        setTimeout(() => {
          setShowWish(true);
          setShowLetter(true);
          // Set the wish content after animation starts
          setTimeout(() => {
            setSelectedWish(sharedData.message);
            setIsLoadingSharedData(false);
          }, 1500); // Delay to ensure animation is visible
        }, 1000); // Delay to show the opening animation
        
      } catch (error) {
        console.error('Error decoding shared data:', error);
        setIsLoadingSharedData(false);
      }
    }
  }, [searchParams]);

  // Khởi tạo nhạc nền với nhiều cách tiếp cận
  useEffect(() => {
    const initAudio = async () => {
      if (audioRef.current && !isInitialized) {
        audioRef.current.loop = true;
        audioRef.current.volume = 0.2;
        
        // Thử phát nhạc ngay lập tức
        try {
          await audioRef.current.play();
          setIsMuted(false);
          setShowMusicPrompt(false);
        } catch {
          // Autoplay bị chặn, thử lại sau
          setShowMusicPrompt(true);
        }
        
        setIsInitialized(true);
      }
    };

    // Thử phát nhạc ngay lập tức
    initAudio();
  }, [isInitialized]);

  // Thử phát nhạc khi có tương tác đầu tiên
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && showMusicPrompt && !isMuted) {
        audioRef.current.play().then(() => {
          setShowMusicPrompt(false);
          setIsMuted(false);
        }).catch(() => {
          // Vẫn không thể phát nhạc
        });
      }
    };

    // Lắng nghe mọi tương tác của người dùng
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [showMusicPrompt, isMuted]);
  // Auto-load Google Fonts when selected
  useEffect(() => {
    const fontToHref: Record<string, string> = {
      "'Dancing Script', cursive": 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap',
      "'Pacifico', cursive": 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
      "'Great Vibes', cursive": 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
      "'Lobster', cursive": 'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
      "'Playfair Display', serif": 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
    };
    const href = fontToHref[selectedFont];
    if (!href) return;
    const id = `gf-${btoa(selectedFont).replace(/=/g, '')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return () => {
      // keep font loaded for navigation; do not remove
    };
  }, [selectedFont]);



  // Xử lý tắt/bật nhạc
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Hiệu ứng pháo hoa
      setShowFireworks(true);
      // Cố định icon và lời chúc để không thay đổi khi re-render
      // Sử dụng icon Heart cố định (không cần set state)
      const fixedWish = (mode === 'send') ? (sanitizeHtml(editorHtml).trim() ? sanitizeHtml(editorHtml) : textToHtml(randomWish)) : randomWish;
      setSelectedWish(fixedWish);
      setTimeout(() => {
        setShowFireworks(false);
        setShowLetter(true); // Hiển thị bức thư thay vì lời chúc
      }, 2000); // Hiệu ứng kéo dài 2 giây
    }
  };

  const handleOpenLetter = () => {
    setShowLetter(false);
    setShowWish(true);
  };

  const handleExportLetter = async () => {
    try {
      // Tạo một bức thư đã mở để xuất hình ảnh (chỉ nội dung, không có button)
      const letterElement = document.createElement('div');
      letterElement.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 500px;
        height: 700px;  
        background: linear-gradient(135deg, #fce7f3, #fdf2f8);
        border-radius: 20px;
        box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
        padding: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;
      
      // Tạo nội dung bức thư đã mở
      const letterContent = document.createElement('div');
      letterContent.style.cssText = `
        width: 100%;
        max-width: 420px;
        background: white;
        border-radius: 20px;
        padding: 50px 40px;
        box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.15);
        position: relative;
        text-align: center;
      `;
      
      // Icon chính - sử dụng icon ngẫu nhiên như trong giao diện
      const iconContainer = document.createElement('div');
      iconContainer.style.cssText = `
        margin: 0 auto 35px;
        display: flex;
        justify-content: center;
        align-items: center;
      `;
      
      // Tạo SVG cho icon ngẫu nhiên
      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('width', '100');
      iconSvg.setAttribute('height', '100');
      iconSvg.setAttribute('viewBox', '0 0 24 24');
      iconSvg.setAttribute('fill', 'none');
      // Chuyển đổi màu từ Tailwind class sang hex
      const colorMap = {
        'text-pink-500': '#ec4899',
        'text-pink-400': '#f472b6', 
        'text-pink-300': '#f9a8d4',
        'text-purple-400': '#c084fc',
        'text-purple-500': '#a855f7',
        'text-yellow-400': '#facc15',
        'text-yellow-300': '#fde047',
        'text-blue-400': '#60a5fa',
        'text-red-400': '#f87171',
        'text-rose-400': '#fb7185'
      };
      const strokeColor = colorMap[heartIcon.color as keyof typeof colorMap] || '#ec4899';
      iconSvg.setAttribute('stroke', strokeColor);
      iconSvg.setAttribute('stroke-width', '2');
      iconSvg.setAttribute('stroke-linecap', 'round');
      iconSvg.setAttribute('stroke-linejoin', 'round');
      
      // Tạo path cho icon dựa trên icon được chọn
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Định nghĩa path cho từng icon
      const iconPath = 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z';
      
      // Sử dụng icon Heart cố định
      
      path.setAttribute('d', iconPath);
      iconSvg.appendChild(path);
      iconContainer.appendChild(iconSvg);
      
      // Tiêu đề
      const title = document.createElement('h2');
      title.textContent = `Thư gửi tới ${name} 💕`;
      title.style.cssText = `
        font-size: 36px;
        font-weight: bold;
        color: #be185d;
        margin: 0 0 40px 0;
        text-align: center;
        font-family: ${selectedFont};
        line-height: 1.2;
      `;
      
      // Nội dung lời chúc
      const wishContent = document.createElement('div');
      wishContent.style.cssText = `
        background: linear-gradient(135deg, #fdf2f8, #fce7f3);
        border-radius: 20px;
        padding: 35px;
        margin: 30px 0;
        border-left: 6px solid #ec4899;
        box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.1);
      `;
      
      const wishText = document.createElement('div');
      const finalWishForImage = selectedWish || ((mode === 'send') ? (sanitizeHtml(editorHtml).trim() ? sanitizeHtml(editorHtml) : textToHtml(randomWish)) : textToHtml(randomWish));
      wishText.innerHTML = finalWishForImage;
      wishText.style.cssText = `
        font-size: 20px;
        color: #be185d;
        line-height: 1.8;
        margin: 0;
        text-align: left;
        font-family: ${selectedFont};
      `;
      
      // Chữ ký
      const signature = document.createElement('div');
      signature.style.cssText = `
        text-align: right;
        margin-top: 50px;
        margin-bottom: 20px;
        font-style: italic;
        color: #ec4899;
        font-size: 18px;
        font-family: 'Arial', sans-serif;
      `;
      signature.textContent = 'Với tất cả tình yêu thương ❤️';
      
      
      // Thêm một số trang trí nhỏ
      const decorations = document.createElement('div');
      decorations.style.cssText = `
        position: absolute;
        bottom: 35px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 12px;
      `;
      
      for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.innerHTML = '✦';
        star.style.cssText = `
          color: #f472b6;
          font-size: 20px;
          opacity: 0.8;
        `;
        decorations.appendChild(star);
      }
      
      // Lắp ráp các phần tử
      wishContent.appendChild(wishText);
      letterContent.appendChild(iconContainer);
      letterContent.appendChild(title);
      letterContent.appendChild(wishContent);
      letterContent.appendChild(signature);
      letterContent.appendChild(decorations);
      letterElement.appendChild(letterContent);
      
      document.body.appendChild(letterElement);

      const canvas = await html2canvas(letterElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 500,
        height: 700,
      });

      const fileName = `thu-chuc-mung-20-10-${name || 'ban'}.png`;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      await new Promise<void>((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            // Fallback: mở tab mới với dataURL
            const dataUrl = canvas.toDataURL('image/png');
            const win = window.open();
            if (win) {
              win.document.write(`<html><head><title>${fileName}</title></head><body style=\"margin:0;background:#fff;display:flex;align-items:center;justify-content:center;\"><img src='${dataUrl}' style='max-width:100%;height:auto' /></body></html>`);
            }
            resolve();
            return;
          }

          if (isMobile) {
            // Điện thoại: sử dụng Web Share API để lưu vào album ảnh
            try {
              const file = new File([blob], fileName, { type: 'image/png' });
              if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
                await navigator.share({ 
                  files: [file], 
                  title: fileName, 
                  text: 'Lưu hình ảnh lời chúc 20/10 vào album ảnh' 
                });
                resolve();
                return;
              }
            } catch (error) {
              console.log('Web Share API failed:', error);
            }
            
            // Fallback cho điện thoại: mở tab mới để long-press lưu
            const dataUrl = canvas.toDataURL('image/png');
            const win = window.open();
            if (win) {
              win.document.write(`<html><head><meta name='viewport' content='width=device-width, initial-scale=1' /><title>${fileName}</title></head><body style=\"margin:0;background:#fff;display:flex;align-items:center;justify-content:center;\"><img src='${dataUrl}' style='max-width:100%;height:auto' /></body></html>`);
            }
            resolve();
          } else {
            // Máy tính: download file như bình thường
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            resolve();
          }
        }, 'image/png');
      });

      // Dọn dẹp phần tử tạm
      document.body.removeChild(letterElement);
    } catch {
      console.error('Lỗi khi xuất hình ảnh');
      alert('Có lỗi xảy ra khi xuất hình ảnh. Vui lòng thử lại!');
    }
  };

  const handleCreateShareLink = async () => {
    try {
      const payload = {
        name,
        message: (selectedWish || ((mode === 'send') ? (sanitizeHtml(editorHtml).trim() ? sanitizeHtml(editorHtml) : textToHtml(randomWish)) : textToHtml(randomWish))),
        iconIndex: 0, // Sử dụng icon Heart cố định (index 0)
        font: selectedFont,
      };
      
      // Tạo link gốc với base64
      const baseUrl = `${window.location.origin}/read`;
      const base64 = encodeForUrl(payload);
      const originalUrl = `${baseUrl}?d=${encodeURIComponent(base64)}`;
      
      setShareUrl(originalUrl);
      setShowQRCode(true);

      await navigator.clipboard.writeText(originalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
      alert('Không thể copy link. Bạn hãy thử lại nhé!');
    }
  };




  const wishes = [
    "Chúc nàng một ngày 20/10 tràn ngập yêu thương và tiếng cười! Mong rằng những ước mơ nhỏ bé của nàng đều sẽ trở thành hiện thực, và mỗi ngày đều mang đến cho nàng niềm vui, hạnh phúc cùng những điều bất ngờ đáng yêu nhất! 💐",
  
    "Nhân ngày Phụ nữ Việt Nam 20/10, chúc nàng mãi xinh đẹp, rạng rỡ và tỏa sáng như ánh mặt trời! Hãy luôn giữ nụ cười trên môi và trái tim tràn đầy yêu thương nhé! 🌞",
  
    "Chúc nàng – người phụ nữ tuyệt vời – có một ngày 20/10 thật đáng nhớ! Mong nàng luôn được yêu thương, trân trọng và hạnh phúc trên hành trình của riêng mình. Mỗi bước đi của nàng đều là niềm tự hào của những người xung quanh! 💖",
  
    "20/10 – ngày của yêu thương! Chúc nàng luôn giữ được sự dịu dàng, tinh tế và niềm tin mạnh mẽ trong tim. Dù cuộc sống có bận rộn đến đâu, hãy luôn dành cho mình những phút giây bình yên và hạnh phúc nhé! 🌷",
  
    "Chúc nàng 20/10 thật ý nghĩa, được nhận nhiều lời chúc tốt đẹp, nhiều món quà dễ thương và thật nhiều niềm vui. Mong mọi điều nàng mong ước đều sớm trở thành hiện thực! 🎁",
  
    "Chúc nàng luôn xinh đẹp, hạnh phúc và thành công không chỉ trong ngày 20/10 mà trong suốt 365 ngày còn lại! Cảm ơn nàng vì đã lan tỏa năng lượng tích cực và yêu thương đến mọi người xung quanh. 🌼",
  
    "20/10 là dịp đặc biệt để nói rằng: Nàng là người phụ nữ tuyệt vời! Mong nàng luôn giữ được ngọn lửa đam mê trong công việc, sự dịu dàng trong tâm hồn và tình yêu thương trong cuộc sống. 🌸",
  
    "Chúc nàng có một ngày 20/10 ngọt ngào như những bông hoa sớm mai, rực rỡ như ánh nắng mùa thu và hạnh phúc như chính nụ cười của nàng. Hãy tận hưởng ngày hôm nay thật trọn vẹn nhé! 🌹",
  
    "Mỗi người phụ nữ đều là một bông hoa đẹp theo cách riêng của mình – và nàng chính là đóa hoa khiến thế giới này trở nên dịu dàng hơn. Chúc nàng 20/10 thật rực rỡ và tràn đầy năng lượng! 🌺",
  
    "Nhân ngày 20/10, chúc nàng luôn có niềm tin vững vàng, sức khỏe dồi dào và tâm hồn thật bình an. Hãy luôn yêu thương bản thân và sống hết mình với những điều nàng đam mê nhé! ✨"
  ];
    

  const randomWish = wishes[Math.floor(Math.random() * wishes.length)];

  // Mảng các icon cute
  // Chỉ sử dụng icon Heart cố định
  const heartIcon = { icon: Heart, color: "text-pink-500", name: 'Heart' };

  // Sử dụng icon Heart cố định
  const IconComponent = heartIcon.icon;
  const displayIconColor = heartIcon.color;

  // Simple sanitizer to allow basic formatting and emoji
  function sanitizeHtml(input: string): string {
    const template = document.createElement('template');
    template.innerHTML = input;
    const allowedTags = new Set(['B', 'I', 'U', 'BR', 'DIV', 'P', 'SPAN']);
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT, null);
    const toRemove: Element[] = [];
    while (walker.nextNode()) {
      const el = walker.currentNode as Element;
      if (!allowedTags.has(el.tagName)) {
        toRemove.push(el);
        continue;
      }
      // Strip all attributes except style-safe ones (we remove all for safety)
      while (el.attributes.length > 0) {
        el.removeAttribute(el.attributes[0].name);
      }
    }
    toRemove.forEach((el) => {
      const parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    });
    return template.innerHTML;
  }

  function textToHtml(text: string): string {
    // Convert plain text with newlines to <div> with <br>
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped.replace(/\n/g, '<br>');
  }


  return (
    <div 
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative animate-background-shift"
      style={{
        backgroundImage: 'url(/tulip.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Audio element cho nhạc nền */}
      <audio ref={audioRef} src="/cute songs.mp3" preload="auto" />
      
      {/* Nút điều khiển nhạc */}
      <motion.button
        onClick={toggleMusic}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white/90 transition-all duration-300"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        {(isMuted || showMusicPrompt) ? (
          <VolumeX className="w-6 h-6 text-pink-500" />
        ) : (
          <Volume2 className="w-6 h-6 text-pink-500" />
        )}
      </motion.button>

      {/* Thông báo khi autoplay bị chặn */}
      {showMusicPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-4 z-50 bg-pink-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-xs"
        >
          <div className="flex items-center gap-2">
            <VolumeX className="w-5 h-5" />
            <div>
              <p className="font-medium text-sm">Nhạc nền chưa bật</p>
              <p className="text-xs opacity-90">Tương tác bất kỳ để bật nhạc</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Overlay để làm mờ background và tăng độ tương phản */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/60 via-pink-25/50 to-rose-50/60 backdrop-blur-sm"></div>
      
      {/* Hiệu ứng pháo hoa */}
      {showFireworks && <Fireworks />}
      
      {/* Bức thư */}
      {showLetter && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenLetter}
          >
            {/* Bức thư */}
            <motion.div
              className="relative w-72 h-80 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl shadow-2xl"
              animate={{
                y: [-8, 8, -8],
                rotate: [-1, 1, -1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Phong bì thư */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-rose-200 rounded-xl shadow-lg">
                {/* Nắp phong bì */}
                <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-br from-pink-300 to-rose-300 rounded-t-xl transform origin-top transition-transform duration-500 hover:rotate-x-180">
                  <div className="absolute top-4 left-4 right-4 h-28 bg-gradient-to-br from-pink-400 to-rose-400 rounded-t-xl"></div>
                </div>
                
                {/* Nội dung bức thư */}
                <div className="absolute top-36 left-4 right-4 bottom-4 bg-white rounded-b-xl p-6">
                  <div className="text-center">
                    <Heart className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-pink-600 mb-3">
                      Thư gửi {name}
                    </h3>
                    <p className="text-base text-pink-500 mb-4">
                      Nhấn để mở thư
                    </p>
                    <div className="flex justify-center space-x-3">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [0.8, 1.3, 0.8],
                            opacity: [0.3, 1, 0.3],
                            rotate: [0, 180, 360]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut"
                          }}
                        >
                          <Sparkles className="w-5 h-5 text-pink-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Tem thư */}
                <div className="absolute top-3 right-3 w-14 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg border-2 border-pink-600">
                  <div className="text-center text-white text-sm font-bold leading-10">20/10</div>
                </div>
              </div>
            </motion.div>
            
            {/* Hiệu ứng lấp lánh xung quanh */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${15 + (i * 6)}%`,
                  top: `${20 + (i % 3) * 25}%`
                }}
                animate={{
                  scale: [0, 1.2, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 360, 720]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-4 h-4 text-pink-300" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
      
      <ResponsiveContainer>
        {!showWish && !showLetter && !showFireworks ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400 mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-2">
                Chúc mừng ngày 20/10
              </h1>
              <p className="text-pink-400 text-base sm:text-lg">
                Ngày Phụ Nữ Việt Nam
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-2 rounded-xl p-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('self');
                    setEditorHtml('');
                    setSelectedWish(null);
                    setShareUrl('');
                    setShowQRCode(false);
                    setCopied(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${mode === 'self' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                >
                  Nhận cho bản thân
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('send');
                    setEditorHtml('');
                    setSelectedWish(null);
                    setShareUrl('');
                    setShowQRCode(false);
                    setCopied(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${mode === 'send' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                >
                  Gửi cho người khác
                </button>
              </div>

              <div>
                <label className="block text-pink-500 font-medium mb-2">
                  {mode === 'self' ? 'Nhập tên của bạn ở đây nè !!!' : 'Tên người nhận'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    // Reset các state liên quan khi thay đổi tên
                    setSelectedWish(null);
                    setShareUrl('');
                    setShowQRCode(false);
                    setCopied(false);
                  }}
                  placeholder={mode === 'self' ? 'Tên của nàng là gì ... ??' : 'Tên người nhận là gì ... ??'}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-pink-100 focus:border-pink-300 focus:outline-none text-center text-base sm:text-lg placeholder-pink-200"
                  required
                />
              </div>

              {mode === 'send' && (
              <div>
                <label className="block text-pink-500 font-medium mb-2">
                  Nội dung lời chúc
                </label>
                <div className="mb-2">
                    <label className="text-pink-500 text-sm mr-2">Font:</label>
                    <select
                      value={selectedFont}
                      onChange={(e) => {
                        setSelectedFont(e.target.value);
                        // Reset các state liên quan khi thay đổi font
                        setSelectedWish(null);
                        setShareUrl('');
                        setShowQRCode(false);
                        setCopied(false);
                      }}
                      className="border-2 border-pink-100 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Inter, Arial, sans-serif">Inter (mặc định)</option>
                      <option value="'Times New Roman', Times, serif">Times New Roman</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="'Comic Sans MS', 'Comic Sans', cursive">Comic Sans</option>
                      <option value="'Courier New', Courier, monospace">Courier New</option>
                      <option value="'Dancing Script', cursive">Dancing Script (Google)</option>
                      <option value="'Pacifico', cursive">Pacifico (Google)</option>
                      <option value="'Great Vibes', cursive">Great Vibes (Google)</option>
                      <option value="'Lobster', cursive">Lobster (Google)</option>
                      <option value="'Playfair Display', serif">Playfair Display (Google)</option>
                    </select>
                  </div>
                
                <RichTextEditor
                  content={editorHtml}
                  onChange={(content) => {
                    setEditorHtml(content);
                    // Reset các state liên quan khi thay đổi nội dung
                    setSelectedWish(null);
                    setShareUrl('');
                    setShowQRCode(false);
                    setCopied(false);
                  }}
                  fontFamily={selectedFont}
                  className="relative"
                />
                
              </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(236, 72, 153, 0.3), 0 10px 10px -5px rgba(236, 72, 153, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={showFireworks ? { 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 10px 15px -3px rgba(236, 72, 153, 0.1)",
                    "0 25px 50px -12px rgba(236, 72, 153, 0.5)",
                    "0 10px 15px -3px rgba(236, 72, 153, 0.1)"
                  ]
                } : {}}
                transition={{ duration: 0.3 }}
                className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Heart className="w-5 h-5" />
                {mode === 'self' ? 'Nhận lời chúc' : 'Tạo lời chúc'}
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex justify-center space-x-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                >
                  <Heart className="w-4 h-4 text-pink-400" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : showWish ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white/75 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 text-center relative z-10"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-4"
              >
                <IconComponent className={`w-16 h-16 sm:w-20 sm:h-20 ${displayIconColor} mx-auto animate-pulse`} />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-2">
                Thư gửi tới {name} 💕
              </h2>
            </motion.div>

              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-pink-25 to-rose-25 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
            >
              <div className="text-pink-600 text-sm sm:text-base leading-relaxed text-justify" style={{ fontFamily: selectedFont }}>
                <div dangerouslySetInnerHTML={{ __html: (isLoadingSharedData ? '' : (selectedWish || ((mode === 'send') ? (sanitizeHtml(editorHtml).trim() ? sanitizeHtml(editorHtml) : textToHtml(randomWish)) : textToHtml(randomWish)))) }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                onClick={() => {
                  setShowWish(false);
                  setName('');
                  setEditorHtml('');
                  setSelectedWish(null);
                  setShareUrl('');
                  setShowQRCode(false);
                  setCopied(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-pink-500 transition-colors text-sm sm:text-base"
              >
                Xác nhận lời chúc
              </motion.button>
              
              {mode === 'self' && (
              <motion.button
                onClick={handleExportLetter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                Lưu thư dưới dạng hình ảnh
              </motion.button>
              )}

              {mode === 'send' && (
              <motion.button
                onClick={handleCreateShareLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-pink-600 border border-pink-200 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-pink-50 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                {copied ? 'Đã copy link' : 'Tạo link chia sẻ'}
              </motion.button>
              )}
            </motion.div>

            {/* QR Code Generator - Đơn giản như Me-QR */}
            {showQRCode && shareUrl && (
              <div className="mt-6 flex flex-col items-center">
                <QRCodeGenerator url={shareUrl} />
                <button
                  onClick={() => {
                    setShowQRCode(false);
                    setShareUrl('');
                    setCopied(false);
                  }}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Đóng QR code
                </button>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex justify-center space-x-1"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                >
                  <Sparkles className="w-3 h-3 text-pink-400" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </ResponsiveContainer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: 'url(/tulip.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <ResponsiveContainer>
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-pink-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-pink-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-pink-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}