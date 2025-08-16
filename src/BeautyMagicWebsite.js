import React, { useState, useEffect } from 'react';
import { ChevronDown, Star, Sparkles, Heart, Flame, Gift, Users, TrendingUp } from 'lucide-react';

const BeautyMagicWebsite = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const industries = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI人工智慧",
      subtitle: "火之「智慧」與「演算」",
      description: "結合先進科技與美學，打造智慧美容新體驗",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "美容護膚",
      subtitle: "火主美、主顏值經濟",
      description: "荷顏天然護膚品，重新定義肌膚之美",
      gradient: "from-pink-400 to-rose-400"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "身心靈療癒",
      subtitle: "冥想、塔羅、芳療",
      description: "在快節奏生活中找到內心的平衡與美麗",
      gradient: "from-purple-400 to-indigo-400"
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "養生健康",
      subtitle: "高壓生活下的調和之道",
      description: "美酒美食，滋養身心，品味生活美學",
      gradient: "from-amber-400 to-orange-400"
    }
  ];

  const products = [
    {
      phase: "第一波",
      title: "荷顏臉部保養品",
      description: "百年野山蔘幹細胞護膚品，台灣天然護膚專家",
      status: "現正推廣",
      image: "🌸",
      link: "https://lotusbeauty.life/"
    },
    {
      phase: "第二波",
      title: "精選美酒",
      description: "品味生活，享受每一刻美好時光",
      status: "即將推出",
      image: "🍷"
    },
    {
      phase: "第三波",
      title: "養生美食",
      description: "結合養生理念的美味料理",
      status: "規劃中",
      image: "🍃"
    },
    {
      phase: "第四波",
      title: "善知識",
      description: "分享美學、養生、身心靈成長智慧",
      status: "規劃中",
      image: "📚"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/60 to-blue-100/40"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8 inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200/50 shadow-lg">
            <Flame className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-slate-700 text-sm font-medium">2025 九紫離火運 • 美的時代來臨</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 tracking-tight">
            美魔力
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            迎接九紫離火運新時代<br />
            <span className="text-pink-500 font-medium">發現美、創造美、分享美</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full text-white font-semibold text-lg hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
              探索美麗世界
            </button>
            <button className="px-8 py-4 border-2 border-slate-300 rounded-full text-slate-600 font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-sm">
              了解九運趨勢
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </div>
      </section>

      {/* Nine Purple Fire Era Section */}
      <section className="py-20 px-4 relative bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              九紫離火運時代
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              2025年起，三元九運進入全新的二十年週期。離火代表光明、美麗與智慧，
              這個時代將是美相關產業蓬勃發展的黃金期。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${industry.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {React.cloneElement(industry.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{industry.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 italic">{industry.subtitle}</p>
                  <p className="text-slate-600 leading-relaxed">{industry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Timeline */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              產品發展藍圖
            </h2>
            <p className="text-xl text-slate-600">
              從保養品到生活美學，打造完整的美麗生態系
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:border-pink-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{product.image}</div>
                    <div className="inline-block bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-2 shadow-sm">
                      {product.phase}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">{product.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{product.description}</p>
                  
                  <div className="text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === '現正推廣' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  
                  {product.link && (
                    <div className="mt-4 text-center">
                      <a 
                        href={product.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full text-sm font-medium hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-sm"
                      >
                        立即體驗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-200 shadow-xl">
            <Gift className="w-16 h-16 text-pink-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              加入美魔力社群
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              獲得第一手九紫離火運美學資訊<br />
              與我們一起迎接美的新時代
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="請輸入您的電子郵件"
                className="w-full px-6 py-3 bg-white/80 border border-slate-300 rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 backdrop-blur-sm shadow-sm"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full text-white font-semibold hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 whitespace-nowrap shadow-lg">
                立即訂閱
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-200 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">美魔力</h3>
              <p className="text-slate-600 leading-relaxed">
                在九紫離火運時代<br />
                發現生活中的每一份美好
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-4">產品系列</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="https://lotusbeauty.life/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">荷顏保養品</a></li>
                <li className="text-slate-400">精選美酒 (即將推出)</li>
                <li className="text-slate-400">養生美食 (規劃中)</li>
                <li className="text-slate-400">善知識 (規劃中)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-4">聯絡資訊</h4>
              <div className="text-slate-600 space-y-2">
                <p>探索美麗，從這裡開始</p>
                <div className="flex justify-center md:justify-start space-x-4 mt-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2025 美魔力 Beauty Magic. 在九紫離火運時代綻放美麗光芒.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BeautyMagicWebsite;