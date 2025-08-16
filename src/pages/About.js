import React, { useState, useEffect, useRef } from 'react';
import { Shield, Heart, Leaf, Sparkles, Flower2 } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "專業研發",
      description: "結合韓國幹細胞技術與台灣在地植萃，打造適合亞洲肌膚的專業配方"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "用心品質",
      description: "嚴選天然成分，每一滴都經過層層把關，確保最高品質標準"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "天然環保",
      description: "堅持使用天然植萃成分，友善環境，關愛地球"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* 區段標題 - 使用 H1 樣式 */}
          <h2 className="text-h1 text-text-primary mb-4">
            關於荷顏
          </h2>
          <div className="divider-brand mb-8"></div>
          
          {/* 品牌介紹 - 使用大段落樣式 */}
          <p className="text-body-xl max-w-4xl mx-auto leading-relaxed">
            <span className="highlight-text">荷顏 Lotus Beauty</span> 致力於提供最優質的天然調膚解決方案<br/>
            我們相信，<em>美麗不應該被任何條件所局限</em>
          </p>
        </div>

        <div 
          ref={sectionRef}
          className={`grid md:grid-cols-3 gap-8 mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-green-100 rounded-full mb-4 text-pink-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* 商業模式與法規遵循說明 */}
        <div className="mb-16 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">⚖️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">法規遵循承諾</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <p>✓ 嚴格遵循《化妝品衛生安全管理法》及相關子法規</p>
                <p>✓ 公司與產品皆合法合規，通過SGS安全檢測</p>
                <p>✓ 產品安全性經第三方權威機構驗證無虞</p>
                <p>✓ 建立完善的品質管理與追溯體系</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">🏢</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">創新商業模式</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <p>✓ 傳統批發零售結合優化互聯網行銷</p>
                <p>✓ 大中小盤批發與零售多元通路佈局</p>
                <p>✓ 非傳統直銷模式，注重長期穩健發展</p>
                <p>✓ 頂級安全有效產品為核心競爭力</p>
              </div>
            </div>
          </div>

          {/* 願景展望 */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">品牌願景</h3>
            <p className="text-lg text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
              荷顏致力於用長期發展的事業佈局，讓大家美得安心、富得踏實。
              展望未來5年、10年、20年，我們將持續領導並改變全球美業模式，
              以創新的產銷制度與頂級產品品質，為台灣美妝產業樹立新標竿。
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="px-4 py-2 bg-white/60 rounded-full">美得安心</span>
              <span className="px-4 py-2 bg-white/60 rounded-full">富得踏實</span>
              <span className="px-4 py-2 bg-white/60 rounded-full">永續經營</span>
              <span className="px-4 py-2 bg-white/60 rounded-full">全球佈局</span>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative">
              <div className="w-full h-96 lg:h-full overflow-hidden">
                <img 
                  src="/images/office1.jpg"
                  alt="荷顏營運總部外觀" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">營運總部外觀</h3>
                  <p className="text-orange-200">現代簡約的設計風格，融合東方美學元素</p>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">營運總部</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-500 font-bold">📍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">總部位於</h4>
                    <p className="text-gray-600">新竹縣 竹北市 成功商圈</p>
                    <p className="text-sm text-gray-500">位於新竹科學園區核心地帶</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-500 font-bold">🏢</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">設施特色</h4>
                    <p className="text-gray-600">現代化辦公空間與研發實驗室</p>
                    <p className="text-sm text-gray-500">專業的產品展示與體驗中心</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-500 font-bold">⭐</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">營運理念</h4>
                    <p className="text-gray-600">以科技創新結合傳統智慧</p>
                    <p className="text-sm text-gray-500">致力於提供最優質的護膚體驗</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm leading-relaxed">
                  我們的總部不僅是營運中心，更是創新的搖籃。在這裡，我們不斷研發新產品，
                  致力於將最頂尖的美容科技帶給每一位愛美的朋友。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img 
                src="/images/office2.jpg"
                alt="荷顏專業展示空間"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-bold text-lg">專業展示空間</h4>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                現代化的產品展示空間，採用開放式設計理念，讓顧客能夠全方位體驗荷顏產品的精緻與品質。
                專業的燈光設計與簡約的展示架，營造出舒適優雅的購物環境。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <div className="grid grid-cols-2 h-full gap-1">
                <div className="relative overflow-hidden">
                  <img 
                    src="/images/office3.jpg"
                    alt="品茶體驗區 - 會議室"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    會議交流區
                  </div>
                </div>
                <div className="relative overflow-hidden">
                  <img 
                    src="/images/office4.jpg"
                    alt="品茶體驗區 - 吧台區"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    茶藝體驗區
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🍃</span>
                  <h4 className="font-bold text-xl">品茶體驗區</h4>
                </div>
                <p className="text-orange-200 text-sm">傳統茶藝 × 現代美學</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-600 text-sm">🫖</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">茶文化體驗</h5>
                    <p className="text-gray-600 text-sm">
                      融合台灣傳統茶藝與現代空間美學，提供沉浸式的文化體驗。
                      專業茶師現場示範，讓您在品茗中感受東方雅韻。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">💬</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">品牌交流空間</h5>
                    <p className="text-gray-600 text-sm">
                      舒適的會議交流環境，讓顧客在輕鬆愉悅的氛圍中深入了解荷顏的品牌理念，
                      體驗美容護膚與傳統文化的完美融合。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 聯絡邀請 */}
        <div className="text-center mt-16 bg-brand-subtle rounded-2xl p-8">
          {/* 邀請標題 - 使用 H3 樣式 */}
          <h3 className="text-h3 text-text-primary mb-4">歡迎蒞臨參觀</h3>
          <p className="text-body-lg text-text-secondary mb-6 max-w-2xl mx-auto">
            想要更深入了解荷顏的產品與理念嗎？歡迎預約參觀我們的營運總部，
            體驗最專業的肌膚護理諮詢服務。
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;