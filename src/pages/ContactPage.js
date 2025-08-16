// ========================================
// ContactPage.js - 內容呈現優化版本
// ========================================

import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, User, MessageSquare, CheckCircle, Star, Heart, Sparkles, Shield, Award, Users, TrendingUp } from 'lucide-react';

const ContactPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    preferredContact: 'phone',
    skinType: '',
    concerns: [],
    businessInterests: [],
    inquiryType: 'skincare'
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const skinTypes = [
    '乾性肌膚', '油性肌膚', '混合性肌膚', '敏感性肌膚', '正常肌膚', '不確定'
  ];

  const skinConcerns = [
    '抗老化', '美白淡斑', '保濕修護', '控油抗痘', '敏感舒緩', '毛孔粗大', '暗沉改善', '細紋淡化'
  ];

  const businessInterests = [
    '產品代理', '通路合作', '會員加盟', '批發經銷', '區域代理', '線上推廣'
  ];

  return (
    <div className="min-h-screen bg-brand-subtle">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-text-secondary hover:text-heyan-gold transition-colors duration-300 p-2 rounded-lg hover:bg-neutral-light"
              aria-label="返回首頁"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">返回首頁</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-green-200 flex items-center justify-center">
                <img src="/images/logo2.png" alt="荷顏" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold text-heyan-gold">荷顏</span>
            </div>
            
            <div className="w-20"></div> {/* 平衡佈局 */}
          </div>
        </div>
      </div>

      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* 頁面標題 */}
          <div className="text-center mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-green-200 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h1 className="text-h2 md:text-h1">專業肌膚諮詢 × 加入批發代理</h1>
            </div>
            <div className="divider-brand mb-8"></div>
            <p className="text-body-lg md:text-body-xl max-w-5xl mx-auto leading-relaxed">
              無論您是想要最適合的護膚方案，還是尋找創業致富的機會<br className="hidden md:inline"/>
              我們的專業團隊都將為您提供最完整的服務與支援
            </p>
            
            {/* 服務特色標籤 */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: <Shield className="w-4 h-4" />, text: "SGS安全認證" },
                { icon: <Award className="w-4 h-4" />, text: "專業諮詢師" },
                { icon: <Star className="w-4 h-4" />, text: "客製化方案" },
                { icon: <Users className="w-4 h-4" />, text: "完整培訓體系" }
              ].map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-heyan-green shadow-sm">
                  {tag.icon}
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          {/* 為什麼選擇荷顏 - 重新設計 */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-h3 md:text-h2 text-center mb-12">為什麼選擇荷顏？</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
              {/* 產品優勢 */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative">
                  <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-6 md:p-8">
                    <div className="flex items-center gap-3 text-white mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold">產品優勢</h3>
                    </div>
                    <p className="text-pink-100 text-sm md:text-base">台灣天然調膚專家，用最好的品質呵護您的肌膚</p>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <div className="space-y-4">
                      {[
                        { 
                          icon: "🌿", 
                          title: "韓國百年野山蔘幹細胞技術", 
                          desc: "頂級抗老成分，激活肌底細胞再生" 
                        },
                        { 
                          icon: "🧪", 
                          title: "十大天然植萃精華配方", 
                          desc: "深層修護、美白淨斑、舒緩抗痘" 
                        },
                        { 
                          icon: "🛡️", 
                          title: "SGS安全檢測認證", 
                          desc: "重金屬、微生物檢測全數合格" 
                        },
                        { 
                          icon: "👩‍⚕️", 
                          title: "專業護膚師諮詢", 
                          desc: "客製化肌膚分析與護理方案" 
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                          <span className="text-2xl flex-shrink-0">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 事業合作優勢 */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 md:p-8">
                    <div className="flex items-center gap-3 text-white mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold">加入批發代理</h3>
                    </div>
                    <p className="text-green-100 text-sm md:text-base">創新商業模式，讓您美得安心、富得踏實</p>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <div className="space-y-4">
                      {[
                        { 
                          icon: "🏪", 
                          title: "批發零售多元通路佈局", 
                          desc: "大中小盤批發體系，線上線下整合" 
                        },
                        { 
                          icon: "📈", 
                          title: "累計銷售量永不歸零", 
                          desc: "升等機制完善，保障長期收益" 
                        },
                        { 
                          icon: "🎓", 
                          title: "完善培訓與行銷支持", 
                          desc: "專業教學體系，行銷資源共享" 
                        },
                        { 
                          icon: "⚖️", 
                          title: "合法合規長期穩健發展", 
                          desc: "嚴格遵循法規，永續經營理念" 
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors">
                          <span className="text-2xl flex-shrink-0">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* 聯絡方式 - 重新設計 */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-h3 md:text-h2 text-center mb-12">立即開始您的美麗之旅</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
              {/* Email 聯絡 */}
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center hover:shadow-2xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="feature-title text-xl md:text-2xl mb-4">電子信箱專業諮詢</h3>
                
                
                <p className="description-text mb-6">
                  將您的問題詳細寫下，我們的專業團隊會在<span className="font-semibold text-blue-600">24小時內</span>給您專業的回覆
                </p>
                
                <button 
                  onClick={() => window.open('mailto:info@lotusbeauty.life', '_blank')}
                  className="btn-primary w-full text-lg py-4 hover:shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  立即寄送專業諮詢信
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  📧 info@lotusbeauty.life
                </p>
              </div>

              {/* LINE 聊天 */}
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center hover:shadow-2xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-500 font-bold text-2xl">L</span>
                  </div>
                </div>
                
                <h3 className="feature-title text-xl md:text-2xl mb-4">LINE即時專業服務</h3>
                
                
                <p className="description-text mb-6">
                  透過LINE與我們的護膚專家進行<span className="font-semibold text-green-600">即時對話</span>，
                  快速解決您的肌膚困擾 與 了解批發代理制度。
                </p>
                
                <button 
                  onClick={() => window.open('https://page.line.me/lotus-beauty', '_blank')}
                  className="btn-secondary w-full text-lg py-4 hover:shadow-lg"
                >
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-500 font-bold text-sm">L</span>
                  </div>
                  加入LINE開始諮詢
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  🆔 @lotus-beauty
                </p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ContactPage;