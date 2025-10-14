'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gift, Star, Flower, Bird, Rainbow, Sun, Moon, Cherry } from 'lucide-react';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import Fireworks from '@/components/Fireworks';

export default function Home() {
  const [name, setName] = useState('');
  const [showWish, setShowWish] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Hiệu ứng pháo hoa
      setShowFireworks(true);
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
  const cuteIcons = [
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
  ];

  // Chọn icon ngẫu nhiên
  const randomIcon = cuteIcons[Math.floor(Math.random() * cuteIcons.length)];
  const IconComponent = randomIcon.icon;

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
              <div>
                <label className="block text-pink-500 font-medium mb-2">
                  Nhập tên của bạn ở đây nè !!!
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên của cục vàng là gì dọoooo ??"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-pink-100 focus:border-pink-300 focus:outline-none text-center text-base sm:text-lg placeholder-pink-200"
                  required
                />
              </div>

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
                <Gift className="w-5 h-5" />
                Nhận lời chúc
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
                  <Star className="w-4 h-4 text-pink-400" />
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
                <IconComponent className={`w-16 h-16 sm:w-20 sm:h-20 ${randomIcon.color} mx-auto animate-pulse`} />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-2">
                Chào {name}! 💕
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-pink-25 to-rose-25 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
            >
              <p className="text-pink-600 text-sm sm:text-base leading-relaxed text-justify">
                {randomWish}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center space-x-4"
            >
              <motion.button
                onClick={() => {
                  setShowWish(false);
                  setName('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-pink-500 transition-colors text-sm sm:text-base"
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
        ) : null}
      </ResponsiveContainer>
    </div>
  );
}