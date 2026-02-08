// src/components/VerifySuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BiCheckCircle, BiError } from 'react-icons/bi';

const VerifySuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 檢查 URL 參數判斷驗證狀態
    const type = searchParams.get('type');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
    } else if (type === 'emailConfirm' || type === 'email-verify') {
      setStatus('success');
    } else {
      // 預設為成功
      setStatus('success');
    }
  }, [searchParams]);

  useEffect(() => {
    // 成功後倒數計時自動跳轉
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/');
    }
  }, [status, countdown, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">驗證中...</h2>
          <p className="text-gray-600">請稍候，正在處理您的 Email 驗證</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <BiError className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">驗證失敗</h2>
          <p className="text-gray-600 mb-6">
            很抱歉，Email 驗證連結已失效或發生錯誤
          </p>
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
            >
              返回首頁重新註冊
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        {/* 成功圖示 */}
        <div className="mb-6">
          <div className="relative inline-block">
            <BiCheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
            <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
          </div>
        </div>

        {/* 標題 */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Email 驗證成功！
        </h1>

        {/* 說明文字 */}
        <p className="text-gray-600 text-lg mb-6">
          🎉 恭喜您已完成 Email 驗證
        </p>

        {/* 歡迎訊息 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-purple-700 mb-3">
            ✨ 歡迎加入美魔力！
          </h3>
          <ul className="text-left text-gray-700 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>3 次免費 AI 肌膚檢測</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>完整分析報告</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>專業保養建議</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>趨勢追蹤分析</span>
            </li>
          </ul>
        </div>

        {/* 倒數計時 */}
        <p className="text-gray-500 text-sm mb-4">
          {countdown} 秒後自動跳轉到首頁...
        </p>

        {/* 按鈕 */}
        <button
          onClick={handleGoHome}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
        >
          立即開始使用
        </button>

        {/* 底部提示 */}
        <p className="text-gray-400 text-xs mt-6">
          Memory = 美魔力 ✨
        </p>
      </div>
    </div>
  );
};

export default VerifySuccess;
