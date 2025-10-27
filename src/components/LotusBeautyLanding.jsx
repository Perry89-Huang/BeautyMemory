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
            <div className="w-12 h-12 bg-gradient-to-br  rounded-xl flex items-center justify-center shadow-lg">

              <img 
                src="/images/logo1.png" 
                alt="美魔力 Logo" 
                  className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">美魔力</h1>
              <p className="text-xs text-red-600 font-medium">九紫離火運 • 美麗黃金期</p>
            </div>
          </div>
          
          <a 
            href="https://lin.ee/Ubulr5Z"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-semibold text-sm hover:shadow-xl transition-all transform hover:scale-105"
          >
            立即諮詢
          </a>
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
              第四代細胞級護膚革命
            </span>
            <br />
            <span className="text-slate-800">
              荷顏 Lotus Beauty
            </span>
          </h1>

          {/* 認證標籤 */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-semibold text-purple-900 border border-purple-200">
              🏆 2013年諾貝爾醫學獎認證技術
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full text-sm font-semibold text-blue-900 border border-blue-200">
              📚 超過5,000篇國際論文支持
            </span>
          </div>

          {/* 副標題 */}
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            外泌體 + SOD 雙核心技術，直達<span className="text-red-600 font-bold">細胞核層級</span>，
            不只是表面保養。遇上<span className="text-orange-600 font-bold">20年一遇的九運黃金期</span>，
            這是屬於你的美麗與事業黃金時刻
          </p>

          {/* 核心賣點 */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-100 shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">⏱️</div>
              <div className="text-3xl font-bold text-red-600 mb-2">7-14天</div>
              <div className="text-slate-600 text-sm">明顯改善<br/>不是3-6個月</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-100 shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-3xl font-bold text-orange-600 mb-2">四效合一</div>
              <div className="text-slate-600 text-sm">一瓶搞定<br/>不用複雜10步驟</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-rose-100 shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">💰</div>
              <div className="text-3xl font-bold text-rose-600 mb-2">$3,800起</div>
              <div className="text-slate-600 text-sm">平民價格<br/>國際級技術</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">✨</div>
              <div className="text-3xl font-bold text-purple-600 mb-2">細胞核心</div>
              <div className="text-slate-600 text-sm">直達本質<br/>不只表面</div>
            </div>
          </div>

          {/* 價格對比標籤 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 max-w-3xl mx-auto mb-12 border-2 border-green-200">
            <p className="text-center text-lg">
              <span className="text-gray-500 line-through">國際品牌 $8,000+</span>
              <span className="mx-4 text-2xl">→</span>
              <span className="text-green-700 font-bold text-xl">荷顏 $3,800-4,980</span>
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              ✅ 平民價格 ・ 頂級享受 ・ 相同技術等級
            </p>
          </div>

          {/* CTA 按鈕組 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://lin.ee/Ubulr5Z"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Lightning className="w-6 h-6" />
              <span>立即 LINE 諮詢</span>
            </a>
            <a 
              href="#business-opportunity"
              className="px-8 py-4 bg-white text-slate-800 rounded-full font-semibold text-lg border-2 border-slate-200 hover:border-red-300 hover:shadow-lg transition-all"
            >
              了解創業機會
            </a>
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
                <h3 className="text-2xl font-bold text-slate-800">野山蔘幹細胞外泌體</h3>
              </div>
              
              <div className="space-y-4 text-slate-600">
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-2">🔬 什麼是外泌體?</p>
                  <p className="text-sm leading-relaxed">
                    外泌體是細胞分泌的<strong>30-150奈米</strong>微小囊泡,
                    可以穿透細胞膜,將訊息和物質直接送入細胞內部。
                    <strong className="text-purple-700">2013年諾貝爾生理醫學獎</strong>正是頒給了發現外泌體的三位科學家。
                  </p>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-3">🌿 野山蔘幹細胞外泌體的獨特優勢</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <p><strong className="text-red-800">抗氧化力是維生素E的20倍</strong> - 對抗自由基的超強能力</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <p><strong className="text-red-800">含40多種珍稀人參皂苷</strong> - 野山蔘的珍貴活性成分</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <p><strong className="text-red-800">提升肌膚吸收效率10倍</strong> - 讓護膚成分真正進入細胞</p>
                    </div>
                  </div>
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
                    💡 科學實證: 超過5,000篇國際論文支持外泌體在抗老化與細胞再生的卓越功效
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
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 via-purple-50 to-rose-50">
        <div className="max-w-6xl mx-auto">
          {/* 產品標題 */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-semibold border border-green-200">
                🇹🇼 台灣天然護膚品專家
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-slate-800">荷顏 </span>
              <span className="text-red-600">LotusBeauty</span>
            </h2>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              全面改寫肌膚年齡
            </p>
            <p className="text-2xl text-slate-700 mb-3 font-medium">
              將第四代科技與九紫離火運能量完美結合
            </p>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-4">
              在美魔力生態系統中，荷顏代表著<span className="text-purple-600 font-bold">「內在純淨，外在綻放」</span>的美學哲學
            </p>
            <div className="mt-6">
              <a 
                href="https://lotusbeauty.life/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors"
              >
                <span>🌐</span>
                <span>詳細產品資訊請參考荷顏官方網站</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* 產品核心特色 - 雙欄設計 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 左側：科學配方 */}
            <div className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-blue-100 hover:shadow-3xl transition-all">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Beaker className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">科學配方</h3>
              </div>
              
              <div className="space-y-6">
                {/* 野山蔘幹細胞外泌體 */}
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🧬</span>
                    野山蔘幹細胞外泌體
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    抗氧化力是維生素E的20倍，含40多種珍稀人參皂苷
                  </p>
                </div>

                {/* 高活性SOD */}
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    高活性SOD
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    超強抗氧化能力，對抗自由基
                  </p>
                </div>

                {/* 零添加配方 */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    零添加配方
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    無防腐劑、無酒精、無香精，敏感肌適用
                  </p>
                </div>
              </div>

              {/* 科學認證標籤 */}
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  諾貝爾獎認證
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  第四代技術
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                  敏感肌適用
                </span>
              </div>
            </div>

            {/* 右側：離火能量加持 */}
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-3xl p-10 shadow-2xl border-2 border-red-200 hover:shadow-3xl transition-all">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Fire className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">離火能量加持</h3>
              </div>
              
              <div className="space-y-6">
                {/* 九紫離火運能量 */}
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    九紫離火運加持
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    順應2025-2033離火能量，美麗事業的黃金20年
                  </p>
                </div>

                {/* 荷花能量注入 */}
                <div className="border-l-4 border-pink-500 pl-4 py-2">
                  <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    荷花能量注入
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    蘊含荷花的「出淤泥而不染」純淨能量
                  </p>
                </div>
              </div>

              {/* 能量標籤 */}
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                  九紫離火運
                </span>
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold">
                  荷花能量
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                  2025-2033黃金期
                </span>
              </div>
            </div>
          </div>

          {/* 產品優勢總結 */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-1 shadow-2xl mb-12">
            <div className="bg-white rounded-[22px] p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                🌟 荷顏的獨特優勢
              </h3>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="p-4">
                  <div className="text-4xl mb-3">🔬</div>
                  <h4 className="font-bold text-slate-800 mb-2">科技領先</h4>
                  <p className="text-sm text-slate-600">
                    第四代細胞級技術，野山蔘幹細胞外泌體與高活性SOD
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-4xl mb-3">🌿</div>
                  <h4 className="font-bold text-slate-800 mb-2">天然安全</h4>
                  <p className="text-sm text-slate-600">
                    零添加配方，無防腐劑、無酒精、無香精
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-4xl mb-3">🔥</div>
                  <h4 className="font-bold text-slate-800 mb-2">能量共振</h4>
                  <p className="text-sm text-slate-600">
                    融合九紫離火運能量，順應美麗產業黃金20年
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="font-bold text-slate-800 mb-2">快速見效</h4>
                  <p className="text-sm text-slate-600">
                    7-14天明顯改善，不是傳統的3-6個月
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 使用者見證 */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <h3 className="text-3xl font-bold text-slate-800 mb-3 text-center">
              ✨ 真實見證：7-14天的改變
            </h3>
            <p className="text-center text-slate-600 mb-8">
              野山蔘幹細胞外泌體 + 高活性SOD，讓肌膚快速感受到細胞級的改變
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  day: "第3天", 
                  effect: "肌膚明顯更水潤，暗沉感減少",
                  detail: "外泌體開始作用，細胞吸收力提升"
                },
                { 
                  day: "第7天", 
                  effect: "細紋淡化，膚色提亮一個色號",
                  detail: "SOD 抗氧化效果顯現，細胞活力增強"
                },
                { 
                  day: "第14天", 
                  effect: "肌膚彈性恢復，毛孔明顯縮小",
                  detail: "細胞再生啟動，膠原蛋白增生"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:shadow-xl transition-all"
                >
                  <div className="text-4xl font-bold text-purple-600 mb-3">{testimonial.day}</div>
                  <p className="text-slate-800 font-semibold mb-2">{testimonial.effect}</p>
                  <p className="text-sm text-slate-600">{testimonial.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 mb-4">
                *效果因個人體質而異，建議持續使用30天以上達到最佳效果
              </p>
              
              {/* CTA 按鈕組 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <a 
                  href="https://lin.ee/Ubulr5Z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <span>💬</span>
                  <span>立即諮詢專屬方案</span>
                </a>
                
                <a 
                  href="https://lotusbeauty.life/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 rounded-full font-bold border-2 border-purple-300 hover:bg-purple-50 transition-all transform hover:scale-105"
                >
                  <span>🌐</span>
                  <span>查看官方網站</span>
                </a>
              </div>
              
              <p className="text-sm text-slate-600">
                📖 詳細產品資訊請參考 
                <a 
                  href="https://lotusbeauty.life/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold hover:text-purple-800 underline ml-1"
                >
                  荷顏官方網站
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* 創業機會區塊 - 新增 */}
      <section id="business-opportunity" className="py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto">
          {/* 標題區 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6 animate-bounce">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              黃金創業期 ・ <span className="text-orange-600">現在就是最佳時機</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              還記得安麗、美樂家的黃金期嗎？早期加入者，至今仍享頂級收入
            </p>
          </div>

          {/* 時機對比 */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-12 border-2 border-orange-200">
            <div className="text-center mb-8">
              <p className="text-2xl font-bold text-slate-800 mb-2">
                荷顏 2025年8月才上市
              </p>
              <p className="text-xl text-orange-600 font-bold">
                現在加入 = <span className="text-3xl">🥩 吃到肉</span>，不只 <span className="text-lg">🍜 喝湯</span>！
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 傳統直銷 */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">😓</span>
                  傳統直銷體系
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>需要持續達成月業績</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>業績歸零壓力大</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>複雜的階級限制</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>入不敷出的囤貨風險</span>
                  </li>
                </ul>
              </div>

              {/* 荷顏批發體系 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-300 shadow-lg">
                <h4 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  荷顏批發體系
                </h4>
                <ul className="space-y-2 text-sm text-orange-900">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>無當月業績限制</strong> - 領取業績獎金</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>業績累積永不歸零</strong> - 長期保障</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>大中小盤批發體系</strong> - 彈性經營</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>真正自由經營</strong> - 無複雜限制</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 九運黃金期 */}
          <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-3xl p-1 shadow-2xl mb-12">
            <div className="bg-white rounded-[22px] p-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                  <span className="text-4xl">🔥</span>
                  2025-2033 九運黃金期
                </h3>
                <p className="text-lg text-slate-600">
                  順應九運時代趨勢，把握美容產業黃金20年
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-4xl mb-3">📈</div>
                  <h4 className="font-bold text-slate-800 mb-2">美業大爆發</h4>
                  <p className="text-sm text-slate-600">
                    離火主「美麗」，外在形象成為核心競爭力
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl mb-3">💎</div>
                  <h4 className="font-bold text-slate-800 mb-2">技術革命</h4>
                  <p className="text-sm text-slate-600">
                    第四代細胞科技問世，搶佔市場先機
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl mb-3">👑</div>
                  <h4 className="font-bold text-slate-800 mb-2">早鳥優勢</h4>
                  <p className="text-sm text-slate-600">
                    2025年8月上市，現在就是最佳切入點
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 特別優惠 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">💎 特別優惠</h3>
            <p className="text-2xl mb-6">
              美業經驗者 享<span className="text-4xl font-bold mx-2">額外優惠</span>
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="font-semibold mb-2">✓ 美容師、美甲師</p>
                <p className="text-sm">已有客戶群，快速啟動</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="font-semibold mb-2">✓ 美業店長、老闆</p>
                <p className="text-sm">擴展產品線，增加營收</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="font-semibold mb-2">✓ 醫美從業者</p>
                <p className="text-sm">專業背書，客戶信賴</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="font-semibold mb-2">✓ 直銷/微商經驗者</p>
                <p className="text-sm">團隊經營，倍速成長</p>
              </div>
            </div>
          </div>

          {/* 核心理念 */}
          <div className="text-center mt-12">
            <p className="text-2xl font-bold text-slate-800 mb-2">
              從你的臉開始，打造美的事業
            </p>
            <p className="text-lg text-slate-600">
              搶佔新事業的黃金期，成為美麗產業的領航者
            </p>
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
         

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a 
              href="https://lin.ee/Ubulr5Z"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 bg-white text-red-600 rounded-full font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
            >
              <Lightning className="w-6 h-6" />
              <span>立即 LINE 諮詢</span>
            </a>
            <a 
              href="https://lin.ee/Ubulr5Z"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-xl border-2 border-white hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <span className="text-2xl">💬</span>
              <span>了解創業機會</span>
            </a>
          </div>

          <p className="text-sm text-white/80 mb-4">
            ✨ 名額有限,每日限量30位 • 諮詢免費,無任何強制消費
          </p>
          
          <div className="flex items-center justify-center gap-2 text-white/90">
            <span className="text-lg">📱</span>
            <span className="text-sm">或直接加 LINE: </span>
            <a 
              href="https://lin.ee/Ubulr5Z" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors"
            >
              @Ubulr5Z
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br  rounded-xl flex items-center justify-center">

                  <img 
                    src="/images/logo1.png" 
                    alt="美魔力 Logo" 
                    className="w-10 h-10 object-contain"
                  />

                </div>
                <div>
                  <h3 className="font-bold text-lg">美魔力</h3>
                  <p className="text-xs text-gray-400">Beauty Memory</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                發現台灣美好的風景,提升內外美的魔力
              </p>
            </div>


            <div>
              <h4 className="font-semibold mb-4">關注我們</h4>
              <div className="flex gap-3 mb-4">
                <a 
                  href="https://lin.ee/Ubulr5Z" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                  title="LINE 官方帳號"
                >
                  <span className="text-sm text-white font-bold">LINE</span>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61582398490077" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="美魔力 Facebook 粉絲專頁"
                >
                  <span className="text-sm">FB</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p> 九紫離火運 • 美麗產業黃金期</p>
            <p className="mt-2">© 2025 美魔力 Beauty Memory.</p>
          </div>
        </div>
      </footer>

      {/* 浮動 LINE 按鈕 */}
      <a 
        href="https://lin.ee/Ubulr5Z"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all animate-bounce hover:animate-none group"
        title="加入 LINE 官方帳號"
      >
        {/* LINE 文字 Logo */}
        <span className="text-white text-lg font-bold tracking-wider group-hover:scale-110 transition-transform">
          LINE
        </span>
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
          !
        </span>
      </a>
    </div>
  );
};

export default LotusBeautyLanding;