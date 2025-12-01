// src/BeautyMemoryWebsiteWithAuth.jsx
// 美魔力 - 整合會員系統的完整範例

import React, { useState, useEffect } from 'react';
import { BiUser, BiLogOut, BiCamera, BiHistory, BiTrophy } from 'react-icons/bi';
import MemberAuth from './components/MemberAuth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

function BeautyMemoryWebsiteWithAuth() {
  // 狀態管理
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
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
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // 取得配額資訊
        await fetchQuota(token);
      } catch (e) {
        console.error('解析用戶資料失敗:', e);
        localStorage.removeItem('user');
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
      const permissionResponse = await fetch(`${API_BASE_URL}/api/analysis/check-permission`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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

      // 可以進行分析 - 開啟檔案選擇
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
          setIsLoading(false);
          return;
        }

        await performAnalysis(file);
      };

      input.click();

    } catch (error) {
      console.error('檢查權限錯誤:', error);
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/analysis/history?limit=5`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const records = data.data.records;
        
        if (records.length === 0) {
          alert('📭 您還沒有分析記錄\n\n立即開始第一次肌膚檢測吧!');
          return;
        }

        const historyMessage = `
📚 您的分析記錄 (最近 ${records.length} 筆)

${records.map((record, index) => `
${index + 1}. ${new Date(record.created_at).toLocaleDateString('zh-TW')}
   評分: ${record.overall_score}/100
   ${record.feng_shui_element} 元素
`).join('\n')}

總共 ${data.data.pagination.total} 筆記錄
        `.trim();

        alert(historyMessage);
      }

    } catch (error) {
      console.error('查詢歷史錯誤:', error);
      alert('❌ 查詢失敗');
    }
  };

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
    </div>
  );
}

export default BeautyMemoryWebsiteWithAuth;
