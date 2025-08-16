import React from 'react';

const Footer = ({ onContactClick }) => (
  <footer id="contact" className="bg-brand-subtle py-16 border-t-4 border-heyan-gold">
    <div className="container mx-auto px-6 text-center">
      {/* 品牌標誌區 */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-green-200 flex items-center justify-center shadow-2xl">
          <img 
            src="/images/logo2.png" 
            alt="荷顏 Lotus Beauty" 
            className="w-full h-full object-contain" 
          />
        </div>
      </div>
      
      {/* 品牌名稱 */}
      <h3 className="text-3xl font-bold text-heyan-gold mb-2 tracking-wide">荷顏</h3>
      <p className="text-lg text-heyan-green font-medium mb-4">Lotus Beauty</p>
      
      {/* 品牌描述 */}
      <p className="text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
        台灣天然調膚專家<br/>
        讓美麗不再被條件局限，用最好的品質、最平民的價格<br/>
        讓每個人都能享受頂級護膚體驗
      </p>
      
      {/* 行動按鈕 */}
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={onContactClick}
          className="btn-primary"
        >
          聯絡我們
        </button>
      </div>
      
      {/* 版權資訊 */}
      <div className="divider-brand mb-6"></div>
      <p className="text-text-muted text-sm">© 2025 荷顏 Lotus Beauty. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;