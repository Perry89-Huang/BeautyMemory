/**
 * 美魔力主應用 - 整合 AI 肌膚檢測
 * 
 * 修改說明:
 * 1. 添加了 SkinAnalysis 組件的導入
 * 2. 添加了視圖切換功能
 * 3. 保留了原有的所有功能
 */

import React, { useState } from 'react';
import {
  BiCamera,
  BiHeart,
  BiTrendingUp,
  BiStar
} from 'react-icons/bi';
import { FiStar } from 'react-icons/fi';


// 導入新的肌膚檢測組件
import SkinAnalysis from './components/SkinAnalysis';
import LotusBeautyAICustomerService from './components/LotusBeautyAICustomerService';



function BeautyMemoryWebsite() {
  // 視圖狀態管理
  const [currentView, setCurrentView] = useState('home'); // 'home' 或 'skin-analysis'

  const handleAnalysisClick = () => {
    // 切換到肌膚檢測頁面
    setCurrentView('skin-analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white">
      {/* === 導航欄 === */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                美魔力
              </h1>
            </div>

            {/* 導航按鈕 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  currentView === 'home'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                首頁
              </button>
              <button
                onClick={() => setCurrentView('skin-analysis')}
                className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  currentView === 'skin-analysis'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BiCamera className="w-5 h-5" />
                AI 肌膚檢測
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* === 主要內容區域 === */}
      {currentView === 'home' ? (
        /* 原有的首頁內容 */
        <div>
          {/* Hero 區域 */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
                美魔力
              </h1>
              
              <p className="text-2xl md:text-3xl text-slate-700 font-medium mb-4">
                AI 智能肌膚分析 × 美麗記憶系統
              </p>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                結合 AILabTools AI 技術與九紫離火運能量,
                為您打造專屬的美麗記憶庫,讓每一次護膚都成為科學化的美麗投資
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleAnalysisClick}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <BiCamera className="w-6 h-6" />
                    立即體驗 AI 肌膚分析
                  </span>
                </button>
              </div>

              {/* 特色指標 */}
              <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-slate-600">分析準確率</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100 shadow-lg">
                  <div className="text-3xl font-bold text-pink-600">30+</div>
                  <div className="text-sm text-slate-600">專業檢測</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-100 shadow-lg">
                  <div className="text-3xl font-bold text-red-600">30秒</div>
                  <div className="text-sm text-slate-600">快速分析</div>
                </div>
              </div>
            </div>
          </section>

          {/* 九紫離火運區域 */}
          <section className="py-20 px-4 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-4">
                  <FiStar className="w-6 h-6 text-red-500" />
                  <span className="text-xl font-bold text-red-800">2024-2043 九紫離火運</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4">
                  順應時代能量，煥發美麗光彩
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  在九紫離火運的能量加持下，透過 AI 科技了解肌膚，
                  是順應時代能量、以智慧之光照亮美麗之路的最佳體現
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                  <div className="text-4xl mb-3">🔥</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">光明</h3>
                  <p className="text-slate-600">
                    科技之光照亮美麗之路，AI 分析讓肌膚問題無所遁形
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                  <div className="text-4xl mb-3">🧠</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">智慧</h3>
                  <p className="text-slate-600">
                    人工智慧理解肌膚需求，提供專業的個人化建議
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">美學</h3>
                  <p className="text-slate-600">
                    內外兼修的全面提升，科學與美學完美結合
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 功能特色 */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
                為什麼選擇美魔力?
              </h2>
              <p className="text-xl text-center text-slate-600 mb-12">
                科技與美麗的完美結合
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <BiCamera className="w-12 h-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">專業分析</h3>
                  <p className="text-slate-600">
                    30+ 項專業檢測指標，全方位了解肌膚狀態
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <BiHeart className="w-12 h-12 text-pink-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">個人化建議</h3>
                  <p className="text-slate-600">
                    根據分析結果，提供量身訂做的保養建議
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <BiTrendingUp className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">追蹤改善</h3>
                  <p className="text-slate-600">
                    記錄美麗歷程，見證肌膚的持續改善
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <BiStar className="w-12 h-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">能量加持</h3>
                  <p className="text-slate-600">
                    結合九運能量，在最佳時機進行保養
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA 區域 */}
          <section className="py-20 px-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                準備好開始您的美麗之旅了嗎?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                立即體驗 AI 肌膚分析，發現專屬於您的美麗秘密
              </p>
              <button
                onClick={handleAnalysisClick}
                className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-xl transform hover:scale-105"
              >
                立即開始分析
              </button>
            </div>
          </section>

          {/* 頁尾 */}
          <footer className="bg-slate-900 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">美魔力 Beauty Memory</h3>
              <p className="text-slate-400 mb-6">
                AI 智能肌膚分析系統 · Memory = 美魔力
              </p>
              <p className="text-slate-500">
                讓科技記住每個美麗瞬間
              </p>
              <div className="mt-8 pt-8 border-t border-slate-800">
                <p className="text-slate-500 text-sm">
                  © 2025 美魔力 Beauty Memory. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* 肌膚檢測頁面 */
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
          <SkinAnalysis />
        </div>
      )}

      {/* AI 智能客服 */}
      <LotusBeautyAICustomerService />
    </div>
  );
}

export default BeautyMemoryWebsite;
