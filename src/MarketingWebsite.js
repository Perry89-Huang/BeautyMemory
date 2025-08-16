// MarketingWebsite.js
import React, { useState } from 'react';
import { 
  Menu, 
  X,
  Star, 
  Check, 
  Award, 
  Users, 
  Building, 
  ChevronRight, 
  ArrowRight, 
  Zap, 
  Shield, 
  Heart 
} from 'lucide-react';
import SciencePage from './SciencePage';

const MarketingWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSciencePage, setShowSciencePage] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links
  const navLinks = [
    { href: "#home", text: "首頁" },
    { href: "#about", text: "關於我們" },
    { href: "#products", text: "產品系列" },
    { href: "#technology", text: "核心技術" },
    { href: "#science", text: "科學原理", action: () => setShowSciencePage(true) },
    { href: "#contact", text: "聯繫我們" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {showSciencePage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <SciencePage onClose={() => setShowSciencePage(false)} />
        </div>
      )}

      {/* Responsive Navigation */}
      <nav className="bg-[#7AB80E] text-white fixed w-full z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-bold">麗芙戀</h1>
              <span className="hidden md:inline text-sm">美業調膚養膚領域領跑者</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="hover:text-green-200 transition-colors cursor-pointer"
                  onClick={(e) => {
                    if (link.action) {
                      e.preventDefault();
                      link.action();
                    }
                  }}
                >
                  {link.text}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="hover:text-green-200 transition-colors"
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      if (link.action) {
                        e.preventDefault();
                        link.action();
                      }
                    }}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 md:pt-20">
        <div className="relative h-screen max-h-96 md:max-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="/api/placeholder/1920/1080"
            alt="Beauty skincare banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  打造中國輕膚美經濟聯合體
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  專注於不斷創新迭代產品功能，簡單解決消費者不簡單的皮膚問題
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-[#69A00D] transition">
                    了解更多
                  </button>
                  <button className="border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-green-800 transition">
                    聯繫我們
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#7AB80E]/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-[#7AB80E] mb-2">95%+</div>
              <div className="text-gray-600">產品複購率</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">20年</div>
              <div className="text-gray-600">專利保護</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">安全認證</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">15年</div>
              <div className="text-gray-600">研發經驗</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            產品系列
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "靚膚液",
                description: "降解重金屬、荷爾蒙、無機物，淨白提亮",
                features: ["淨白提亮", "改善老化角質", "淡斑嫩膚"]
              },
              {
                title: "養顏液",
                description: "滋養肌膚，調節水油平衡",
                features: ["滋養肌膚", "調節平衡", "緊緻肌膚"]
              },
              {
                title: "精華液",
                description: "保濕提亮，深層滋養",
                features: ["深層保濕", "淡化細紋", "收縮毛孔"]
              },
              {
                title: "精華霜",
                description: "細嫩/緊緻/水潤/燈炮肌膚",
                features: ["抗皺緊緻", "抗氧煥亮", "淡化皺紋"]
              }
            ].map((product, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold mb-4">{product.title}</h3>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            核心技術優勢
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">SOD超氧化物歧化酶</h3>
              <p className="text-gray-600">
                獨家專利技術，有效分解代謝毒素，進行細胞修復
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Zap className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">七種植物發酵萃取</h3>
              <p className="text-gray-600">
                純天然植物萃取，安全無添加，溫和不刺激
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Heart className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">細胞還原技術</h3>
              <p className="text-gray-600">
                專業細胞還原，快速修復受損肌膚，重現健康光采
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#7AB80E] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            開始您的美麗事業
          </h2>
          <p className="text-lg md:text-xl mb-8">
            加入麗芙戀，遇見更美的自己
          </p>
          <button className="bg-white text-green-800 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition inline-flex items-center">
            立即諮詢 <ArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">麗芙戀</h3>
              <p className="text-gray-400">為世界智造健康美</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">快速連結</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      onClick={(e) => {
                        if (link.action) {
                          e.preventDefault();
                          link.action();
                        }
                      }}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">聯繫我們</h4>
              <ul className="space-y-2 text-gray-400">
                <li>地址：廣東廣州</li>
                <li>電話：以官方為準</li>
                <li>郵箱：以官方為準</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">關注我們</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  微信
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  微博
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  抖音
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              博仁生物科技有限公司 © {new Date().getFullYear()} 版權所有
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingWebsite;