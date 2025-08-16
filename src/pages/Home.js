// ========================================
// Home.js - 移除無障礙標記
// ========================================

import React, { useState, useEffect } from 'react';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-subtle mobile-section"
    >
      {/* 品牌裝飾背景 - 手機版簡化 */}
      <div className="absolute top-10 left-10 w-32 h-32 md:w-64 md:h-64 opacity-20 mobile-gpu-accelerated">
        <div className="w-full h-full rounded-full bg-heyan-gold-light"></div>
      </div>
      <div className="absolute bottom-10 right-10 w-48 h-48 md:w-96 md:h-96 opacity-15 mobile-gpu-accelerated">
        <div className="w-full h-full rounded-full bg-heyan-green-light"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="text-center mobile-center">
          {/* 品牌標誌 - 手機優化尺寸 */}
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="animate-float mobile-gpu-accelerated">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-pink-200 to-green-200 flex items-center justify-center shadow-2xl">
              
                <img 
                  src="/images/logo1.png" 
                  alt="荷顏 Lotus Beauty" 
                  className="w-4/5 h-4/5 object-contain"
                  loading="eager"
                />
              </div>
            </div>
          </div>
          
          {/* 主標題 - 響應式字型 */}
          <h1 className="brand-title animate-fade-in mb-6">
            荷顏靚膚液
          </h1>
          
          <div className="max-w-4xl mx-auto mobile-flex mobile-center">
            {/* 副標題 - 手機版調整間距 */}
            <p className="brand-subtitle mb-4 md:mb-6">
              全方位修護 
              <span className="hidden md:inline">
                <span className="accent-dot"></span> 抗老 
                <span className="accent-dot"></span> 美白 
                <span className="accent-dot"></span> 舒緩
              </span>
              <span className="md:hidden">
                <br />抗老 × 美白 × 舒緩
              </span>
            </p>
            
            {/* 品牌分隔線 */}
            <div className="divider-brand mb-6 md:mb-8"></div>
            
            {/* 品牌標語 */}
            <p className="brand-tagline mb-6">
              — 全面改寫肌膚年齡 —
            </p>
            
            {/* 補充說明 - 手機版優化 */}
            <div className="mobile-paragraph max-w-2xl mx-auto">
              <p className="description-text leading-relaxed">
                結合韓國百年野山蔘幹細胞技術與台灣在地植萃精華，
                為您帶來前所未有的肌膚護理體驗。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;