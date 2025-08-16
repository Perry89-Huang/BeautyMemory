// ========================================
// Header.js - 修復回到頂部按鈕顯示問題
// ========================================

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUp } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
      // 只有在滾動超過 500px 時才顯示回到頂部按鈕
      setShowScrollTop(scrollPosition > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const LotusLogo = ({ className = "w-10 h-10" }) => (
    <div className={`${className} relative mobile-gpu-accelerated`}>
      <img 
        src="/images/logo2.png" 
        alt="荷顏 Lotus Beauty 台灣天然護膚品品牌標誌" 
        title="荷顏｜台灣護膚品品牌｜天然護品領導品牌" 
        className="w-full h-full object-contain" 
        loading="lazy"
      />
    </div>
  );

  const navigationItems = [
    { name: '首頁', href: '#home' },
    { name: '產品系列', href: '#products' },
    { name: '產品功效', href: '#ingredients' },
    { name: '運營模式', href: '#operation' },
    { name: '關於荷顏', href: '#about' },
    { name: '聯絡我們', href: '#contact' }
  ];

  return (
    <>
      {/* 主導航 */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-neutral-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* 品牌標識區 */}
            <div className="flex items-center gap-3">
              <LotusLogo className="w-12 h-12" />
              <div>
                <span className="text-3xl font-bold text-heyan-gold tracking-wide">
                  荷顏
                </span>
              </div>
            </div>
            
            {/* 桌面導航選單 */}
            <div className="hidden md:flex gap-8">
              {navigationItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className={`font-medium transition-all duration-300 hover:text-heyan-gold relative touch-target ${
                    scrolled ? 'text-text-primary' : 'text-text-primary'
                  } after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-heyan-gold after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            
            {/* 手機選單按鈕 */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-neutral-light transition-colors duration-300 mobile-touch-optimized" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '關閉選單' : '開啟選單'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? 
                <X className="w-6 h-6 text-text-primary" /> : 
                <Menu className="w-6 h-6 text-text-primary" />
              }
            </button>
          </div>
          
          {/* 手機版下拉選單 */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-neutral-light bg-neutral-white/95 backdrop-blur-md rounded-lg">
              {navigationItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="block py-3 px-4 text-text-primary hover:text-heyan-gold hover:bg-neutral-light rounded-lg transition-all duration-300 font-medium mobile-touch-optimized" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
      
      {/* 回到頂部按鈕 - 只在滾動足夠距離時顯示 */}
      {showScrollTop && (
        <button 
          className="fixed bottom-6 right-6 w-12 h-12 bg-heyan-gold text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-heyan-gold-dark z-40"
          onClick={scrollToTop}
          aria-label="回到頂部"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Header;