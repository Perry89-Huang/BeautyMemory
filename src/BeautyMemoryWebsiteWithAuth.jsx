// src/BeautyMemoryWebsiteWithAuth.jsx
// 美魔力 - 整合會員系統的完整範例

import React, { useState, useEffect } from 'react';
import { BiUser, BiLogOut, BiCamera, BiHistory, BiTrophy } from 'react-icons/bi';
import MemberAuth from './components/MemberAuth';
import SkinAnalysis from './components/SkinAnalysis';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

function BeautyMemoryWebsiteWithAuth() {
  // 狀態管理
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [quota, setQuota] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 檢查登入狀態
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 檢查登入狀態
  const checkLoginStatus = async () => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData && userData !== 'undefined') {
      try {
        // 驗證 token 是否有效
        const response = await fetch(`${API_BASE_URL}/api/members/quota`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Token 有效，設置用戶資料
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          // 取得配額資訊
          const data = await response.json();
          setQuota(data.data);
        } else {
          // Token 無效，清除本地資料
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
          setQuota(null);
        }
      } catch (e) {
        // 發生錯誤，清除本地資料
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setQuota(null);
      }
    }
  };

  // 取得配額資訊
  const fetchQuota = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/members/quota`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuota(data.data);
      }
    } catch (error) {
      console.error('取得配額失敗:', error);
    }
  };

  // 登入成功處理
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    fetchQuota(localStorage.getItem('accessToken'));
  };

  // 登出
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setQuota(null);
  };

  // 開始分析
  const handleAnalysisClick = async () => {
    // 檢查是否登入
    if (!user) {
      alert('🔒 肌膚檢測功能僅限會員使用\n\n立即註冊即可獲得 3 次免費檢測!');
      setShowAuth(true);
      return;
    }

    setIsLoading(true);

    try {
      // 檢查權限
      const token = localStorage.getItem('accessToken');
      
      const permissionResponse = await fetch(`${API_BASE_URL}/api/analysis/check-permission`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const permissionData = await permissionResponse.json();

      if (!permissionData.canAnalyze) {
        // 無法分析,顯示原因
        if (permissionData.reason === 'QUOTA_EXCEEDED') {
          const upgradeMessage = permissionData.action.message;
          alert(`❌ ${permissionData.message}\n\n💡 ${upgradeMessage}`);
        } else {
          alert(`❌ ${permissionData.message}`);
        }
        setIsLoading(false);
        return;
      }

      // 可以進行分析 - 顯示相機掃臉畫面
      setShowSkinAnalysis(true);
      setIsLoading(false);

    } catch (error) {
      alert('❌ 發生錯誤,請稍後再試');
      setIsLoading(false);
    }
  };

  // 執行分析
  const performAnalysis = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/analysis/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // 分析成功
        const { analysis, fengShui, quota: updatedQuota } = data.data;
        
        // 更新配額
        if (updatedQuota) {
          setQuota(prev => ({
            ...prev,
            remaining: updatedQuota.unlimited ? -1 : updatedQuota.remaining
          }));
        }

        // 顯示結果
        showAnalysisResult(analysis, fengShui);
      } else {
        alert(`❌ 分析失敗: ${data.error.message}`);
      }

    } catch (error) {
      console.error('分析錯誤:', error);
      alert('❌ 分析過程發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  // 顯示分析結果
  const showAnalysisResult = (analysis, fengShui) => {
    const resultMessage = `
🎉 AI 肌膚分析完成!

📊 整體評分: ${analysis.overallScore}/100

🔍 各項指標:
• 水潤度: ${analysis.scores.hydration}
• 光澤度: ${analysis.scores.radiance}
• 緊緻度: ${analysis.scores.firmness}
• 膚質: ${analysis.scores.texture}

⚠️ 主要關注:
${analysis.keyConcerns.map(c => `• ${c}`).join('\n')}

💡 護膚建議:
${analysis.recommendations.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n')}

🔮 風水時辰:
${fengShui.blessing}
    `.trim();

    alert(resultMessage);
  };

  // 查看歷史記錄
  const viewHistory = async () => {
    if (!user) {
      alert('請先登入');
      setShowAuth(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analysis/history?limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const records = data.data.records;
        
        if (records.length === 0) {
          alert('📭 您還沒有分析記錄\n\n立即開始第一次肌膚檢測吧!');
          setIsLoading(false);
          return;
        }

        setHistoryRecords(records);
        setShowHistory(true);
      }

    } catch (error) {
      alert('❌ 查詢失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  // 如果顯示肌膚分析畫面
  if (showSkinAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
        {/* 返回按鈕 */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 px-4 py-3">
          <button
            onClick={() => {
              setShowSkinAnalysis(false);
              // 重新獲取配額
              fetchQuota(localStorage.getItem('accessToken'));
            }}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <span>←</span>
            <span>返回首頁</span>
          </button>
        </div>
        
        {/* 肌膚分析組件 */}
        <SkinAnalysis />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      
      {/* 導航列 */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">美</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  美魔力
                </h1>
                <p className="text-xs text-gray-500">Memory = 美魔力</p>
              </div>
            </div>

            {/* 用戶資訊 */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {/* 配額顯示 */}
                  {quota && (
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                      <BiCamera className="text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">
                        {quota.unlimited 
                          ? '無限次分析'
                          : `剩餘 ${quota.remaining} 次`
                        }
                      </span>
                    </div>
                  )}

                  {/* 用戶選單 */}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.memberLevel === 'beginner' && '體驗會員'}
                        {user.memberLevel === 'intermediate' && '專業會員'}
                        {user.memberLevel === 'expert' && '高級會員'}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="登出"
                    >
                      <BiLogOut className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  登入 / 註冊
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
            AI 智能肌膚分析
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            結合 Perfect Corp 專業技術與九紫離火運能量
            <br />
            為您打造專屬的美麗記憶庫
          </p>

          {/* 功能按鈕 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleAnalysisClick}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  處理中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <BiCamera className="w-6 h-6" />
                  {user ? '開始 AI 肌膚檢測' : '立即體驗 (需登入)'}
                </span>
              )}
            </button>

            {user && (
              <button
                onClick={viewHistory}
                className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-500 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all"
              >
                <span className="flex items-center gap-2">
                  <BiHistory className="w-6 h-6" />
                  查看歷史記錄
                </span>
              </button>
            )}
          </div>

          {/* 訪客提示 */}
          {!user && (
            <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-xl max-w-md mx-auto">
              <p className="text-purple-700 font-medium mb-2">
                🎁 新會員專屬優惠
              </p>
              <p className="text-purple-600 text-sm">
                立即註冊即可獲得 3 次免費 AI 肌膚檢測!
              </p>
            </div>
          )}
        </div>

        {/* 特色功能 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <BiCamera className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              AI 智能分析
            </h3>
            <p className="text-gray-600">
              採用 Perfect Corp 專業技術,95% 醫師級準確率,14 項專業檢測
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <BiHistory className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              美麗記憶庫
            </h3>
            <p className="text-gray-600">
              完整記錄您的美麗歷程,追蹤肌膚改善趨勢,見證蛻變時刻
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <BiTrophy className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              九紫離火運
            </h3>
            <p className="text-gray-600">
              結合風水時辰建議,選擇最佳護膚時機,事半功倍
            </p>
          </div>
        </div>

        {/* 會員等級說明 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-8">
            選擇適合您的方案
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* 體驗版 */}
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-2">體驗版</h4>
              <p className="text-3xl font-bold text-purple-600 mb-4">免費</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ 3 次 AI 肌膚檢測</li>
                <li>✓ 基本分析報告</li>
                <li>✓ 簡單護膚建議</li>
              </ul>
              <button 
                onClick={() => !user && setShowAuth(true)}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {user ? '目前方案' : '立即註冊'}
              </button>
            </div>

            {/* 專業版 */}
            <div className="border-2 border-purple-500 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                推薦
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">專業版</h4>
              <p className="text-3xl font-bold text-purple-600 mb-4">
                NT$ 99<span className="text-sm text-gray-500">/月</span>
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ 50 次肌膚檢測/月</li>
                <li>✓ 完整分析報告</li>
                <li>✓ 趨勢追蹤</li>
                <li>✓ 風水時辰建議</li>
                <li>✓ 美麗記憶庫</li>
              </ul>
              <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                立即升級
              </button>
            </div>

            {/* 企業版 */}
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-2">企業版</h4>
              <p className="text-3xl font-bold text-purple-600 mb-4">
                NT$ 999<span className="text-sm text-gray-500">/月</span>
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ 無限次分析</li>
                <li>✓ 所有功能</li>
                <li>✓ API 接入</li>
                <li>✓ 定制化服務</li>
                <li>✓ 優先客服</li>
              </ul>
              <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                聯繫我們
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* 登入/註冊彈窗 */}
      <MemberAuth
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 歷史記錄 Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BiHistory className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">分析歷史記錄</h2>
                    <p className="text-purple-100 text-sm">您的肌膚檢測歷程</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                {historyRecords.map((record, index) => (
                  <div
                    key={record.id}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-lg font-semibold text-gray-800">
                              {new Date(record.created_at).toLocaleString('zh-TW', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-sm text-gray-500">
                              {record.feng_shui_element} 元素 · {record.feng_shui_blessing}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-purple-600">{record.overall_score}</p>
                            <p className="text-xs text-gray-600">整體評分</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-pink-600">{record.hydration_score || '-'}</p>
                            <p className="text-xs text-gray-600">水潤度</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-orange-600">{record.radiance_score || '-'}</p>
                            <p className="text-xs text-gray-600">光澤度</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-indigo-600">{record.firmness_score || '-'}</p>
                            <p className="text-xs text-gray-600">緊緻度</p>
                          </div>
                        </div>

                        {record.image_url && (
                          <div className="mt-3">
                            <img
                              src={record.image_url}
                              alt="檢測照片"
                              className="rounded-lg max-h-32 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {historyRecords.length === 0 && (
                <div className="text-center py-12">
                  <BiHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">還沒有分析記錄</p>
                  <p className="text-gray-400 text-sm mt-2">立即開始您的第一次肌膚檢測吧！</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 flex justify-between items-center border-t">
              <p className="text-sm text-gray-600">
                共 {historyRecords.length} 筆記錄
              </p>
              <button
                onClick={() => setShowHistory(false)}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BeautyMemoryWebsiteWithAuth;
