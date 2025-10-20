'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { decodeFromUrl } from '@/utils/base64';

function ReadPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);


  const decoded = useMemo(() => {
    const d = params.get('d');
    if (!d) return null;
    return decodeFromUrl(d) as { name: string; message: string; font?: string } | null;
  }, [params]);

  const fontFamily = decoded?.font || 'Inter, Arial, sans-serif';


  useEffect(() => {
    if (!decoded) {
      setError('Link không hợp lệ hoặc đã bị hỏng.');
    } else if (decoded && !isInitialized) {
      // Tự động hiển thị hiệu ứng mở thư khi có dữ liệu
      setTimeout(() => {
        setShowLetter(true);
        setIsInitialized(true);
      }, 1000);
    }
  }, [decoded, isInitialized, params]);


  // Auto-inject Google font if necessary
  useEffect(() => {
    const fontToHref: Record<string, string> = {
      "'Dancing Script', cursive": 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap',
      "'Pacifico', cursive": 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
      "'Great Vibes', cursive": 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
      "'Lobster', cursive": 'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
      "'Playfair Display', serif": 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
    };
    const href = fontToHref[fontFamily];
    if (!href || typeof document === 'undefined') return;
    const id = `gf-${btoa(fontFamily).replace(/=/g, '')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => {};
    document.head.appendChild(link);
  }, [fontFamily]);

  const handleOpenLetter = () => {
    setShowLetter(false);
    setShowWish(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        backgroundImage: 'url(/tulip.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <ResponsiveContainer>
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center">
            <p className="text-pink-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-pink-500 text-white px-5 py-3 rounded-xl hover:bg-pink-600 transition"
            >
              Về trang chính
            </button>
          </div>
        </ResponsiveContainer>
      </div>
    );
  }

  if (!decoded) return null;

  // Sử dụng icon Heart cố định
  const IconComponent = Heart;
  const colorClass = "text-pink-500";

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative"
      style={{
        backgroundImage: 'url(/tulip.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/60 via-pink-25/50 to-rose-50/60 backdrop-blur-sm"></div>
      
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
                    <IconComponent className={`w-10 h-10 ${colorClass} mx-auto mb-3`} />
                    <h3 className="text-xl font-bold text-pink-600 mb-3" style={{ fontFamily }}>
                      Thư gửi {decoded.name}
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

      {/* Nội dung lời chúc sau khi mở thư */}
      {showWish && (
        <ResponsiveContainer>
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
                <IconComponent className={`w-16 h-16 sm:w-20 sm:h-20 ${colorClass} mx-auto animate-pulse`} />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-2" style={{ fontFamily }}>
                Thư gửi tới {decoded.name} 💕
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-pink-25 to-rose-25 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
            >
              <div className="text-pink-600 text-sm sm:text-base leading-relaxed text-justify" style={{ fontFamily }}>
                <div dangerouslySetInnerHTML={{ __html: decoded.message }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-pink-600 transition-colors text-sm sm:text-base"
              >
                Xác nhận lời chúc
              </motion.button>
            </motion.div>

            

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
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default function ReadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4" style={{
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
      <ReadPageContent />
    </Suspense>
  );
}


