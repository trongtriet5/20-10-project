'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Heart, Sparkles, Gift, Star, Flower, Bird, Rainbow, Sun, Moon, Cherry } from 'lucide-react';
import ResponsiveContainer from '@/components/ResponsiveContainer';

export default function ReadPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  const cuteIcons = useMemo(() => [
    { icon: Heart, color: "text-pink-500" },
    { icon: Flower, color: "text-pink-400" },
    { icon: Bird, color: "text-purple-400" },
    { icon: Rainbow, color: "text-purple-500" },
    { icon: Sun, color: "text-yellow-400" },
    { icon: Moon, color: "text-blue-400" },
    { icon: Cherry, color: "text-red-400" },
    { icon: Star, color: "text-yellow-300" },
    { icon: Sparkles, color: "text-pink-300" },
    { icon: Gift, color: "text-rose-400" }
  ], []);

  const decoded = useMemo(() => {
    const d = params.get('d');
    if (!d) return null;
    try {
      // Decode base64 (URL param already percent-decoded by useSearchParams)
      const json = decodeURIComponent(escape(atob(d)));
      return JSON.parse(json) as { name: string; message: string; iconIndex: number; font?: string };
    } catch (err) {
      return null;
    }
  }, [params]);

  useEffect(() => {
    if (!decoded) {
      setError('Link không hợp lệ hoặc đã bị hỏng.');
    }
  }, [decoded]);

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

  const index = decoded.iconIndex >= 0 && decoded.iconIndex < cuteIcons.length ? decoded.iconIndex : 0;
  const IconComponent = cuteIcons[index].icon;
  const colorClass = cuteIcons[index].color;
  const fontFamily = decoded.font || 'Inter, Arial, sans-serif';

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
    if (!href) { setFontLoaded(true); return; }
    const id = `gf-${btoa(fontFamily).replace(/=/g, '')}`;
    if (document.getElementById(id)) { setFontLoaded(true); return; }
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => setFontLoaded(true);
    document.head.appendChild(link);
  }, [fontFamily]);

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
      <ResponsiveContainer>
        <div className="bg-white/75 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 text-center relative z-10">
          <div className="mb-6">
            <IconComponent className={`w-16 h-16 sm:w-20 sm:h-20 ${colorClass} mx-auto animate-pulse`} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-2" style={{ fontFamily }}>Chào {decoded.name}! 💕</h2>
          <div className="bg-gradient-to-r from-pink-25 to-rose-25 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-pink-600 text-sm sm:text-base leading-relaxed text-justify" style={{ fontFamily }}>
            <div dangerouslySetInnerHTML={{ __html: decoded.message }} />
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-pink-500 text-white px-5 py-3 rounded-xl hover:bg-pink-600 transition"
          >
            Tạo lời chúc khác
          </button>
        </div>
      </ResponsiveContainer>
    </div>
  );
}


