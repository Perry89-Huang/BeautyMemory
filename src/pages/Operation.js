import React, { useState, useEffect, useRef } from 'react';
import { Users, TrendingUp, Shield, Heart, Star, CheckCircle, ArrowRight, Award, Building, Target } from 'lucide-react';

const Operation = ({ onContactClick }) => {
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

  const businessModels = [
    {
      icon: <Building className="w-8 h-8" />,
      title: "批發零售通路",
      description: "傳統批發零售結合現代化通路管理",
      features: [
        "大中小盤批發體系",
        "多元零售通路佈局", 
        "線上線下整合"
      ],
      color: "from-blue-400 to-blue-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "合作夥伴制度",
      description: "建立長期穩健的合作夥伴關係",
      features: [
        "專業培訓支持",
        "行銷資源共享",
        "業績獎勵制度"
      ],
      color: "from-green-400 to-green-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "專業諮詢服務", 
      description: "提供專業的肌膚護理諮詢服務",
      features: [
        "一對一肌膚分析",
        "客製化護膚方案",
        "專業護膚師指導"
      ],
      color: "from-pink-400 to-pink-500"
    }
  ];

  const advantages = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "法規合規",
      description: "嚴格遵循化妝品衛生安全管理法，合法經營"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "品質保證",
      description: "SGS檢測認證，確保產品安全性與有效性"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "永續經營",
      description: "注重長期發展，建立穩健的商業模式"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "創新驅動",
      description: "結合科技創新與傳統智慧，持續產品研發"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "產品研發",
      description: "結合韓國幹細胞技術與台灣植萃"
    },
    {
      step: "2", 
      title: "品質檢測",
      description: "SGS安全檢測，確保產品品質"
    },
    {
      step: "3",
      title: "通路合作",
      description: "建立多元化銷售通路"
    },
    {
      step: "4",
      title: "專業服務",
      description: "提供完整的護膚諮詢服務"
    },
    {
      step: "5",
      title: "客戶滿意",
      description: "持續追蹤，確保客戶滿意度"
    }
  ];

  return (
    <section id="operation" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* 標題區塊 */}
        <div className="text-center mb-16">
          {/* 區段標題 - 使用 H1 樣式 */}
          <h2 className="text-h1 text-text-primary mb-4">
            運營模式
          </h2>
          <div className="divider-brand mb-8"></div>
          
          {/* 運營說明 - 使用大段落樣式 */}
          <div className="text-left text-body-lg max-w-4xl mx-auto space-y-6 leading-relaxed">
            <p>
              荷顏非目前台灣所見的所有直銷，我們是傳統的 
              <strong className="highlight-text">批發零售</strong> 
              加上優化的互聯網行銷！
            </p>
            <p>            
              荷顏走的是大中小盤批發，與零售加上互聯網的產銷制度與頂級安全有效產品支撐，
              用長期發展的事業來佈局，讓大家美的安心，富得踏實。
              <span className="highlight-text">展望未來5年10年20年將領導並改變全球美業模式!</span>
            </p>
            <p>
              <em>荷顏堅持合法合規經營，以頂級產品品質為核心，建立永續發展的創新商業模式!</em>
            </p>
          </div>
        </div>

        {/* 核心商業模式 */}
        <div 
          ref={sectionRef}
          className={`grid md:grid-cols-3 gap-8 mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {businessModels.map((model, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className={`h-4 bg-gradient-to-r ${model.color}`}></div>
              <div className="p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${model.color} rounded-full mb-4 text-white`}>
                  {model.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{model.title}</h3>
                <p className="text-gray-600 mb-4">{model.description}</p>
                <div className="space-y-2">
                  {model.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 運營優勢 */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-12">運營優勢</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-100 to-green-100 rounded-full mb-4 text-pink-500">
                  {advantage.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{advantage.title}</h4>
                <p className="text-sm text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 運營流程 */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-12">運營流程</h3>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-pink-200 via-green-200 to-yellow-200 transform -translate-y-1/2 z-0"></div>
            <div className="grid md:grid-cols-5 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 渠道政策 */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-12">渠道政策</h3>
          
          {/* 政策概述 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h4 className="text-xl font-bold text-gray-800 mb-4">荷顏產品制度</h4>
              <p className="text-gray-600 max-w-3xl mx-auto">
                建立完善的多層級代理體系，從會員到合夥人，依據累計銷售量，
                提供升等機制，取得更優惠的進貨價，創造更大的利潤空間。<br /> <b>累計銷售量永不歸零</b>，確保各級合作夥伴的合理收益
              </p>
              
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                  <span className="font-bold text-sm">會員</span>
                </div>
                <h5 className="font-semibold text-gray-800 mb-1">會員制度</h5>
                <p className="text-xs text-gray-600">入會門檻低</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                  <span className="font-bold text-sm">代理</span>
                </div>
                <h5 className="font-semibold text-gray-800 mb-1">多級代理</h5>
                <p className="text-xs text-gray-600">依據累計銷售量自動升級</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                  <span className="font-bold text-sm">合夥</span>
                </div>
                <h5 className="font-semibold text-gray-800 mb-1">合夥人</h5>
                <p className="text-xs text-gray-600">最高級別</p>
              </div>
            </div>
          </div>

          {/* 詳細制度表格 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4">
              <h4 className="text-lg font-bold text-center">荷顏會員制度</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="px-6 py-4 text-center font-semibold text-gray-800 border-r border-gray-200">級別</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-800">說明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-yellow-50">
                    <td className="px-6 py-4 font-medium text-blue-600 border-r border-gray-200 align-top">會員</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div>1. 用首購價 4,980元 購買一套產品（靚膚液x2 + 精華液x1）</div>
                        <div>2. 完成線上會員註冊</div>
                        <div className="font-medium text-green-600 mt-2">即可成為會員</div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-green-50">
                    <td className="px-6 py-4 font-medium text-green-600 border-r border-gray-200 align-top">復購</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div>會員復購，每套產品（靚膚液x2 + 精華液x1），售價：<span className="font-semibold text-green-600">3,800元</span></div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="px-6 py-4 font-medium text-purple-600 border-r border-gray-200 align-top">代理</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div>1~5等級代理店，可取得更優惠的產品售價，獲取更大的銷售利潤</div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-red-50">
                    <td className="px-6 py-4 font-medium text-red-600 border-r border-gray-200 align-top">合夥人</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div>最高級別</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* 聯絡合作 */}
        <div className="text-center">
          {/* 小標題 - 使用 H3 樣式 */}
          <h3 className="text-h3 text-text-primary mb-4">加入荷顏合作夥伴</h3>
          
          {/* 邀請文字 - 使用大段落樣式 */}
          <p className="text-body-lg text-text-secondary mb-6 max-w-2xl mx-auto">
            我們誠摯邀請志同道合的夥伴加入荷顏大家庭，
            一起為台灣美業發展貢獻力量，共創美好未來。
          </p>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={onContactClick}
              className="btn-primary"
            >
              <span>合作洽談</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Operation;