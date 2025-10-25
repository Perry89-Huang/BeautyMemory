import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSparkles as Sparkles,
  HiOutlineFire as Fire,
  HiOutlineBeaker as Beaker,
  HiOutlineLightningBolt as Lightning,
  HiOutlineShieldCheck as Shield,
  HiOutlineClock as Clock
} from 'react-icons/hi';
import { BiDna } from 'react-icons/bi';
import { RiMagicFill } from 'react-icons/ri';

/**
 * 荷顏 LotusBeauty Landing Page
 * 專為 Facebook 廣告導流設計
 * 主打第四代細胞級護膚科技 + 九紫離火運黃金期
 */
const LotusBeautyLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 產品進化史數據
  const generations = [
    {
      gen: "第一代",
      tech: "植物萃取",
      level: "表面保養",
      effect: "30-60天",
      color: "from-green-400 to-green-600",
      icon: "🌿"
    },
    {
      gen: "第二代",
      tech: "玻尿酸",
      level: "表皮層",
      effect: "14-30天",
      color: "from-blue-400 to-blue-600",
      icon: "💧"
    },
    {
      gen: "第三代",
      tech: "A醇胜肽",
      level: "真皮層",
      effect: "7-14天",
      color: "from-purple-400 to-purple-600",
      icon: "🧪"
    },
    {
      gen: "第四代",
      tech: "外泌體+SOD",
      level: "細胞核心",
      effect: "7-14天",
      color: "from-red-500 to-orange-500",
      icon: "🔬",
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-red-50">
      {/* 導航欄 */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <RiMagicFill className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">美魔力</h1>
              <p className="text-xs text-red-600 font-medium">九紫離火運 • 美麗黃金期</p>
            </div>
          </div>
          
          <button className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-semibold text-sm hover:shadow-xl transition-all transform hover:scale-105">
            立即諮詢
          </button>
        </div>
      </nav>

      {/* Hero Section - 主打區 */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* 背景動態元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* 時機標籤 */}
          <div className="inline-flex items-center bg-gradient-to-r from-red-50 to-orange-50 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-red-200 shadow-lg mb-8">
            <Fire className="w-5 h-5 text-red-600 mr-2 animate-pulse" />
            <span className="text-red-800 text-sm font-bold">
              2025-2033 九紫離火運 • 美麗產業黃金9年
            </span>
          </div>

          {/* 主標題 */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
              第四代細胞級護膚
            </span>
            <br />
            <span className="text-slate-800">
              美麗產業的革命時刻
            </span>
          </h1>

          {/* 副標題 */}
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            當護膚科技進入<span className="text-red-600 font-bold">細胞核心層級</span>，
            遇上<span className="text-orange-600 font-bold">20年一遇的離火能量</span>，
            這是屬於你的美麗黃金期
          </p>

          {/* 核心賣點 */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-100 shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">⏱️</div>
              <div className="text-3xl font-bold text-red-600 mb-2">7-14天</div>
              <div className="text-slate-600">見效時間</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-100 shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-3xl font-bold text-orange-600 mb-2">細胞核心</div>
              <div className="text-slate-600">作用深度</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-rose-100 shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">✨</div>
              <div className="text-3xl font-bold text-rose-600 mb-2">零刺激</div>
              <div className="text-slate-600">安全有效</div>
            </div>
          </div>

          {/* CTA 按鈕組 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2">
              <Lightning className="w-6 h-6" />
              <span>限時體驗優惠</span>
            </button>
            <button className="px-8 py-4 bg-white text-slate-800 rounded-full font-semibold text-lg border-2 border-slate-200 hover:border-red-300 hover:shadow-lg transition-all">
              了解科學原理
            </button>
          </div>

          {/* 信任標記 */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>醫學級認證</span>
            </div>
            <div className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-blue-600" />
              <span>臨床實證</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>零添加防腐劑</span>
            </div>
          </div>
        </div>
      </section>

      {/* 為什麼是現在 - 九紫離火運 */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
              <Fire className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              為什麼是<span className="text-red-600">現在</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              2025年,當護膚科技突破與宇宙能量週期完美交會
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 科技突破 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">科技革命</h3>
              </div>
              <div className="space-y-4 text-slate-600">
                <p className="leading-relaxed">
                  <strong className="text-slate-800">2024年</strong> 標誌著護膚產業進入
                  <strong className="text-blue-600">第四代細胞科技時代</strong>。
                </p>
                <p className="leading-relaxed">
                  過去20年,我們見證了從植物萃取到玻尿酸、從A醇到胜肽的進化。
                  但直到<strong className="text-blue-600">外泌體技術</strong>的成熟,
                  人類才真正具備了<strong className="text-slate-800">直達細胞核心</strong>的能力。
                </p>
                <div className="bg-blue-50 rounded-xl p-4 mt-4">
                  <p className="text-sm font-semibold text-blue-900">
                    ✨ 這不是漸進式改良,而是質的飛躍
                  </p>
                </div>
              </div>
            </div>

            {/* 能量週期 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-xl border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Fire className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">能量週期</h3>
              </div>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong className="text-red-600">2024-2043年</strong> 進入
                  <strong className="text-orange-600">九紫離火運</strong>,
                  這是每180年才輪轉一次的特殊能量週期。
                </p>
                <p className="leading-relaxed">
                  離火主<strong className="text-red-600">美麗、光明、綻放</strong>。
                  在這20年間,所有與「美」相關的產業將迎來前所未有的黃金期,
                  而<strong className="text-slate-800">2025-2033這9年更是巔峰</strong>。
                </p>
                <div className="bg-white/80 rounded-xl p-4 mt-4 border border-red-200">
                  <p className="text-sm font-semibold text-red-900">
                    🔥 外在形象成為核心競爭力的時代已經來臨
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 雙重機遇 */}
          <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-[22px] p-8 text-center">
              <h4 className="text-2xl font-bold text-slate-800 mb-4">
                當科技突破遇上能量巔峰
              </h4>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                這不是巧合,而是<strong className="text-red-600">歷史性的交會點</strong>。
                第四代護膚科技的問世,恰好趕上美麗產業的黃金20年。
                抓住這個機遇,就是把握<strong className="text-orange-600">屬於你的美麗黃金期</strong>。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 護膚科技進化史 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
              <BiDna className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              護膚科技的<span className="text-red-600">四代進化</span>
            </h2>
            <p className="text-xl text-slate-600">
              從表面到核心,人類護膚技術的百年躍進
            </p>
          </div>

          {/* 進化時間軸 */}
          <div className="space-y-6">
            {generations.map((gen, index) => (
              <div 
                key={index}
                className={`relative flex items-center gap-6 p-6 rounded-2xl transition-all duration-500 ${
                  gen.highlight 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 shadow-xl scale-105' 
                    : 'bg-gray-50 border border-gray-200 hover:shadow-lg'
                }`}
              >
                {/* 世代標記 */}
                <div className={`flex-shrink-0 w-24 h-24 bg-gradient-to-br ${gen.color} rounded-2xl flex items-center justify-center shadow-lg ${gen.highlight ? 'animate-pulse' : ''}`}>
                  <span className="text-4xl">{gen.icon}</span>
                </div>

                {/* 內容 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-2xl font-bold ${gen.highlight ? 'text-red-600' : 'text-slate-800'}`}>
                      {gen.gen}
                    </h3>
                    {gen.highlight && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        最新科技
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">核心技術:</span>
                      <p className="font-semibold text-slate-800">{gen.tech}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">作用層級:</span>
                      <p className="font-semibold text-slate-800">{gen.level}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">見效時間:</span>
                      <p className="font-semibold text-slate-800">{gen.effect}</p>
                    </div>
                  </div>
                </div>

                {/* 箭頭 */}
                {index < generations.length - 1 && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-3xl text-gray-300">↓</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 第四代科技深度解析 */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              第四代科技:<span className="text-blue-600">為什麼能直達細胞核心</span>?
            </h2>
            <p className="text-xl text-slate-600">
              從醫學與生物學角度,理解外泌體+SOD的革命性突破
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 外泌體技術 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BiDna className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">外泌體 Exosomes</h3>
              </div>
              
              <div className="space-y-4 text-slate-600">
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-2">🔬 什麼是外泌體?</p>
                  <p className="text-sm leading-relaxed">
                    外泌體是細胞分泌的<strong>30-150奈米</strong>微小囊泡,
                    可以穿透細胞膜,將訊息和物質直接送入細胞內部。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-purple-600">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">細胞間通訊使者</p>
                      <p className="text-sm">攜帶蛋白質、RNA等生物活性物質</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-purple-600">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">天然運輸系統</p>
                      <p className="text-sm">不會被免疫系統排斥,安全無刺激</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-purple-600">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">啟動細胞再生</p>
                      <p className="text-sm">喚醒沉睡的幹細胞,促進膠原蛋白生成</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white mt-6">
                  <p className="text-sm font-bold">
                    💡 醫學突破: 2023年外泌體技術榮獲諾貝爾生理醫學獎提名
                  </p>
                </div>
              </div>
            </div>

            {/* SOD 技術 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">SOD 超氧化物歧化酶</h3>
              </div>
              
              <div className="space-y-4 text-slate-600">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">🛡️ 什麼是SOD?</p>
                  <p className="text-sm leading-relaxed">
                    SOD是人體內最重要的<strong>抗氧化酶</strong>,
                    負責清除會傷害細胞的自由基,但隨年齡下降。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-green-600">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">對抗老化根源</p>
                      <p className="text-sm">中和自由基,保護細胞DNA不受損傷</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-green-600">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">修復受損細胞</p>
                      <p className="text-sm">促進細胞自我修復機制,延緩老化</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-green-600">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">提升肌膚防禦</p>
                      <p className="text-sm">增強對環境污染、紫外線的抵抗力</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4 text-white mt-6">
                  <p className="text-sm font-bold">
                    🧬 科學實證: SOD活性在25歲後每年下降10%,外補充是關鍵
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 協同作用 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-[22px] p-8">
              <h4 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                🔬 外泌體 + SOD = 1+1>2 的協同效應
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightning className="w-8 h-8 text-blue-600" />
                  </div>
                  <h5 className="font-bold text-slate-800 mb-2">深度遞送</h5>
                  <p className="text-sm text-slate-600">
                    外泌體將SOD直接運送到細胞核心,突破傳統護膚品無法穿透的障礙
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h5 className="font-bold text-slate-800 mb-2">持續防護</h5>
                  <p className="text-sm text-slate-600">
                    SOD在細胞內持續作用24小時,外泌體確保穩定活性不流失
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h5 className="font-bold text-slate-800 mb-2">雙向修復</h5>
                  <p className="text-sm text-slate-600">
                    外泌體促進細胞再生,SOD保護新生細胞,形成完整修復循環
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 荷顏產品介紹 */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-rose-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              荷顏 <span className="text-red-600">LotusBeauty</span>
            </h2>
            <p className="text-2xl text-slate-600 mb-2">
              將第四代科技與九紫離火運能量完美結合
            </p>
            <p className="text-lg text-slate-500">
              在美魔力生態系統中,荷顏代表著「內在純淨,外在綻放」的美學哲學
            </p>
          </div>

          {/* 產品核心特色 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Beaker className="w-8 h-8 text-blue-600" />
                科學配方
              </h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <strong className="text-slate-800">雙重外泌體複合物</strong>
                    <p className="text-sm">幹細胞來源外泌體 + 植物來源外泌體</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <strong className="text-slate-800">高活性SOD (15,000 units/g)</strong>
                    <p className="text-sm">採用專利穩定技術,活性保持率>90%</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <strong className="text-slate-800">零添加配方</strong>
                    <p className="text-sm">無防腐劑、無酒精、無香精,敏感肌適用</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-xl border-2 border-red-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Fire className="w-8 h-8 text-red-600" />
                離火能量加持
              </h3>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">🔥</span>
                  <div>
                    <strong className="text-slate-800">紅色光子能量瓶</strong>
                    <p className="text-sm">瓶身採用特殊紅光波長設計,與離火能量共振</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">⏰</span>
                  <div>
                    <strong className="text-slate-800">最佳使用時辰建議</strong>
                    <p className="text-sm">午時(11-13點)使用效果最佳,火元素能量最旺</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">💎</span>
                  <div>
                    <strong className="text-slate-800">荷花能量注入</strong>
                    <p className="text-sm">蘊含荷花的「出淤泥而不染」純淨能量</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 使用者見證 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              ✨ 真實見證:7-14天的改變
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { day: "第3天", effect: "肌膚明顯更水潤,暗沉感減少" },
                { day: "第7天", effect: "細紋淡化,膚色提亮一個色號" },
                { day: "第14天", effect: "肌膚彈性恢復,毛孔明顯縮小" }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-3">{testimonial.day}</div>
                  <p className="text-slate-700">{testimonial.effect}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 mt-6">
              *效果因個人體質而異,建議持續使用30天以上
            </p>
          </div>
        </div>
      </section>

      {/* 與美魔力生態系統的整合 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
              <RiMagicFill className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              美魔力<span className="text-purple-600">生態系統</span>
            </h2>
            <p className="text-xl text-slate-600">
              荷顏 × AI分析 × 美麗記憶,打造你的專屬美麗方案
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI 肌膚分析 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">📸</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                AI 即時檢測
              </h4>
              <p className="text-slate-600 mb-4">
                使用美魔力AI系統,精準分析14項肌膚指標,了解你的肌膚真實狀況
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                立即檢測 →
              </button>
            </div>

            {/* 荷顏產品 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-300 shadow-lg transform scale-105">
              <div className="text-4xl mb-4">🌸</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                荷顏護理方案
              </h4>
              <p className="text-slate-600 mb-4">
                根據AI分析結果,量身定制第四代細胞級護理產品組合
              </p>
              <button className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold hover:shadow-xl transition-all">
                獲取方案
              </button>
            </div>

            {/* 美麗記憶 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                美麗記憶庫
              </h4>
              <p className="text-slate-600 mb-4">
                記錄每一次的肌膚變化,用數據見證你的美麗蛻變歷程
              </p>
              <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                查看記錄 →
              </button>
            </div>
          </div>

          {/* 完整旅程 */}
          <div className="mt-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-[22px] p-8">
              <h4 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                你的美麗蛻變旅程
              </h4>
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <p className="text-sm text-slate-600">AI檢測</p>
                </div>
                <div className="text-2xl text-gray-300">→</div>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-600 font-bold">2</span>
                  </div>
                  <p className="text-sm text-slate-600">荷顏護理</p>
                </div>
                <div className="text-2xl text-gray-300">→</div>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <p className="text-sm text-slate-600">追蹤記錄</p>
                </div>
                <div className="text-2xl text-gray-300">→</div>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <p className="text-sm text-slate-600">美麗蛻變</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 限時優惠 CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-semibold">限時優惠 • 把握黃金期</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            迎接九紫離火運<br />
            專屬美麗方案
          </h2>
          
          <p className="text-xl mb-8 text-white/90">
            現在加入,即享首次體驗優惠<br />
            <strong className="text-2xl">AI檢測 + 荷顏試用裝 + 專屬護理指導</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="group px-10 py-5 bg-white text-red-600 rounded-full font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3">
              <Lightning className="w-6 h-6" />
              <span>立即領取優惠</span>
            </button>
            <button className="px-10 py-5 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-xl border-2 border-white hover:bg-white/30 transition-all">
              聯繫專屬顧問
            </button>
          </div>

          <p className="text-sm text-white/80">
            ✨ 名額有限,每日限量30位 • 諮詢免費,無任何強制消費
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <RiMagicFill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">美魔力</h3>
                  <p className="text-xs text-gray-400">Beauty Memory</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                發現優質美的事物,提升內外美的魔力
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">產品系列</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">荷顏 LotusBeauty</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">AI 肌膚分析</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">美麗記憶系統</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">關於我們</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">品牌故事</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">科技實力</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">聯繫我們</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">關注我們</h4>
              <div className="flex gap-3 mb-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-sm">FB</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-sm">IG</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-sm">LINE</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 美魔力 Beauty Memory. 九紫離火運 • 美麗產業黃金期</p>
            <p className="mt-2">Powered by Perfect Corp Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LotusBeautyLanding;
