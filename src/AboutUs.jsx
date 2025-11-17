// src/AboutUs.jsx
import React from 'react';
import { RiMagicFill } from 'react-icons/ri';
import { AiOutlineFire, AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment } from 'react-icons/ai';

const AboutUs = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 導航欄 */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ← 返回
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <RiMagicFill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">美魔力智能行銷有限公司</h1>
                  <p className="text-xs text-purple-600">推廣所有與「美」相關的人事物</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* 標題區 */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
            <RiMagicFill className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            美魔力智能行銷有限公司
          </h1>
          <p className="text-xl text-purple-600 font-medium mb-3">
            推廣所有與「美」相關的人事物
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 px-6 py-3 rounded-full border-2 border-red-200">
            <AiOutlineFire className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-semibold">迎接九紫離火運新時代</span>
            <AiOutlineFire className="w-5 h-5 text-red-600" />
          </div>
        </header>

        {/* 九運說明區 */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slide-up">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 pb-4 border-b-4 border-amber-300">
            關於九紫離火運
          </h2>
          <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
            <p>
              <strong className="text-purple-600">2025年</strong>是風水命理中具有關鍵轉折的一年。從這一年開始,三元九運將正式進入「<strong className="text-red-600">九運</strong>」時代,也就是被稱為「<strong className="text-red-600">九紫離火運</strong>」的全新二十年週期。
            </p>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 my-6 border-l-4 border-pink-500">
              <p className="text-purple-800 font-medium text-xl">
                在這個充滿能量與轉變的時代,美魔力相信「美」的力量將帶來無限可能。我們致力於發掘、推廣並傳遞美的價值,讓每個人都能在九運時代中綻放光彩。
              </p>
            </div>

            {/* 九運特色 */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 text-center border border-red-200">
                <div className="text-3xl mb-3">🔥</div>
                <h3 className="font-bold text-red-700 mb-2">火元素加持</h3>
                <p className="text-sm text-red-600">提升肌膚活力與光澤</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 text-center border border-amber-200">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="font-bold text-amber-700 mb-2">最佳時機</h3>
                <p className="text-sm text-amber-600">把握黃金護膚時段</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center border border-purple-200">
                <div className="text-3xl mb-3">💎</div>
                <h3 className="font-bold text-purple-700 mb-2">能量共振</h3>
                <p className="text-sm text-purple-600">與火運能量同頻共振</p>
              </div>
            </div>
          </div>
        </section>

        {/* 公司資訊區 */}
        <section className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 pb-4 border-b-4 border-amber-300">
            公司資訊
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* 營業人名稱 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border-l-4 border-amber-400 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📋</div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900 mb-2 text-lg">營業人名稱</h3>
                  <p className="text-amber-800 font-medium">美魔力智能行銷有限公司</p>
                </div>
              </div>
            </div>

            {/* 統一編號 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-400 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔢</div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 mb-2 text-lg">統一編號</h3>
                  <p className="text-blue-800 font-mono font-bold text-xl">60456507</p>
                </div>
              </div>
            </div>

            {/* 聯絡信箱 */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border-l-4 border-pink-400 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  <AiOutlineMail />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-purple-900 mb-2 text-lg">聯絡信箱</h3>
                  <a 
                    href="mailto:info@beautymemory.life" 
                    className="text-purple-600 hover:text-purple-800 font-medium hover:underline break-all"
                  >
                    info@beautymemory.life
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 聯絡方式補充區 (預留未來擴充) */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
              <span>💌</span>
              <span>聯絡我們</span>
            </h3>
            <p className="text-purple-700 leading-relaxed">
              如有任何疑問或合作洽詢,歡迎透過電子信箱與我們聯繫。我們將竭誠為您服務,一同在九紫離火運的新時代中,探索美的無限可能。
            </p>
          </div>
        </section>
      </div>

      {/* 頁尾 */}
      <footer className="bg-slate-900 text-white py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <RiMagicFill className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold">美魔力 Beauty Memory</h3>
          </div>
          
          <div className="mb-6 space-y-2">
            <p className="text-slate-300 font-medium">美魔力智能行銷有限公司</p>
            <p className="text-slate-400">統一編號: 60456507</p>
            <p className="text-slate-400">
              聯絡信箱: <a href="mailto:info@beautymemory.life" className="text-purple-400 hover:text-purple-300 hover:underline">info@beautymemory.life</a>
            </p>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <p className="text-slate-400 mb-2">
              Powered by AILabTools AI Technology
            </p>
            <p className="text-sm text-slate-500">
              © 2025 美魔力智能行銷有限公司 版權所有
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
