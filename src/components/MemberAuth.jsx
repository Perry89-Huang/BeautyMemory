// src/components/MemberAuth.jsx
// 美魔力會員登入/註冊元件

import React, { useState, useEffect } from 'react';
import { BiUser, BiLock, BiEnvelope, BiPhone, BiX, BiCheck, BiError } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const MemberAuth = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 重置表單
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        phone: ''
      });
      setErrors({});
      setMessage({ type: '', text: '' });
      setRegistrationSuccess(false);
    }
  }, [isOpen]);

  // 表單驗證
  const validateForm = () => {
    const newErrors = {};

    // Email 驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = '請輸入 Email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email 格式不正確';
    }

    // 密碼驗證
    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 8) {
      newErrors.password = '密碼至少需要 8 個字元';
    }

    // 註冊模式額外驗證
    if (mode === 'register') {
      if (!formData.displayName) {
        newErrors.displayName = '請輸入暱稱';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '密碼不一致';
      }

      // 手機號碼驗證 (選填)
      if (formData.phone && !/^09\d{8}$/.test(formData.phone)) {
        newErrors.phone = '手機號碼格式不正確 (範例: 0912345678)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 處理輸入變化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除該欄位的錯誤訊息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 處理登入
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/members/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // 儲存 Token
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        setMessage({ 
          type: 'success', 
          text: '登入成功！正在為您跳轉...' 
        });

        // 通知父元件登入成功
        setTimeout(() => {
          onLoginSuccess(data.data.user);
          onClose();
        }, 1000);

      } else {
        // 翻譯常見的英文錯誤訊息
        let errorMsg = data.error?.message || '登入失敗，請重試';
        if (errorMsg.includes('Invalid email or password')) {
          errorMsg = '帳號或密碼錯誤，請重新輸入';
        } else if (errorMsg.includes('User is not verified')) {
          errorMsg = '帳號尚未驗證，請檢查您的 Email 信箱完成驗證';
        } else if (errorMsg.includes('User not found')) {
          errorMsg = '此帳號不存在，請先註冊';
        } else if (errorMsg.includes('Too many requests')) {
          errorMsg = '登入次數過多，請稍後再試';
        }
        setMessage({ 
          type: 'error', 
          text: errorMsg
        });
      }

    } catch (error) {
      console.error('登入錯誤:', error);
      setMessage({ 
        type: 'error', 
        text: '網路連線錯誤，請檢查您的網路後再試' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 處理註冊
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/members/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.requiresVerification) {
          setRegistrationSuccess(true);
          setMessage({ 
            type: 'success', 
            text: '註冊成功！請檢查您的 Email 信箱並完成驗證後登入' 
          });
          // 不自動登入，讓用戶去收信
        } else {
          // 儲存 Token
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.data.user));

          setMessage({ 
            type: 'success', 
            text: `🎉 註冊成功！恭喜獲得 ${data.data.welcomeBonus?.freeAnalyses || 3} 次免費肌膚檢測` 
          });

          // 通知父元件註冊成功
          setTimeout(() => {
            onLoginSuccess(data.data.user);
            onClose();
          }, 2000);
        }

      } else {
        // 翻譯常見的英文錯誤訊息
        let errorMsg = data.error?.message || '註冊失敗，請重試';
        if (errorMsg.includes('Email already in use') || errorMsg.includes('already exists')) {
          errorMsg = '此 Email 已被註冊，請使用其他 Email 或直接登入';
        } else if (errorMsg.includes('Password is too short')) {
          errorMsg = '密碼太短，請使用至少 8 個字元';
        } else if (errorMsg.includes('Password too weak') || errorMsg.includes('password')) {
          errorMsg = '密碼強度不足，請使用至少 8 個字元（建議包含大小寫字母、數字）';
        } else if (errorMsg.includes('Invalid email')) {
          errorMsg = 'Email 格式不正確，請檢查後重新輸入';
        }
        setMessage({ 
          type: 'error', 
          text: errorMsg
        });
      }

    } catch (error) {
      console.error('註冊錯誤:', error);
      setMessage({ 
        type: 'error', 
        text: '網路連線錯誤，請檢查您的網路後再試' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 處理 Google 登入
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setMessage({ type: '', text: '' });

      // 呼叫後端 API 取得 Google OAuth URL
      const response = await fetch(`${API_BASE_URL}/api/members/auth/google`, {
        method: 'GET'
      });

      const data = await response.json();

      if (data.success && data.data.authUrl) {
        // 儲存當前狀態，以便登入後返回
        sessionStorage.setItem('auth_redirect', window.location.pathname);
        
        // 重導向到 Google 登入頁面
        window.location.href = data.data.authUrl;
      } else {
        setMessage({
          type: 'error',
          text: 'Google 登入初始化失敗，請稍後再試'
        });
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error('Google 登入錯誤:', error);
      setMessage({
        type: 'error',
        text: '無法連接 Google 登入服務'
      });
      setIsGoogleLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
        
        {/* 標題區 */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <BiX className="w-6 h-6" />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? '會員登入' : '會員註冊'}
          </h2>
          <p className="text-white/90 text-sm">
            {mode === 'login' 
              ? '歡迎回到美魔力,開始您的美麗旅程' 
              : '註冊即可獲得 3 次免費 AI 肌膚檢測'}
          </p>
        </div>

        {/* 表單區 */}
        <div className="p-6">
          
          {/* 訊息顯示 */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <BiCheck className="w-5 h-5 flex-shrink-0" />
              ) : (
                <BiError className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            
            {/* Google 登入按鈕 */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-gray-700"
              >
                {isGoogleLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    連接中...
                  </>
                ) : (
                  <>
                    <FcGoogle className="w-6 h-6" />
                    使用 Google 帳號{mode === 'login' ? '登入' : '註冊'}
                  </>
                )}
              </button>
            </div>

            {/* 分隔線 */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">或使用 Email {mode === 'login' ? '登入' : '註冊'}</span>
              </div>
            </div>

            {/* 註冊模式 - 暱稱 */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  暱稱 *
                </label>
                <div className="relative">
                  <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.displayName 
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    placeholder="請輸入您的暱稱"
                  />
                </div>
                {errors.displayName && (
                  <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <BiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 註冊模式 - 手機 */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手機號碼 (選填)
                </label>
                <div className="relative">
                  <BiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone 
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    placeholder="0912345678"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            )}

            {/* 密碼 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密碼 *
              </label>
              <div className="relative">
                <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="至少 8 個字元"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 註冊模式 - 確認密碼 */}
            {mode === 'register' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  確認密碼 *
                </label>
                <div className="relative">
                  <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    placeholder="再次輸入密碼"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* 提交按鈕 */}
            <button
              type="submit"
              disabled={isLoading || (mode === 'register' && registrationSuccess)}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === 'login' ? '登入中...' : '註冊中...'}
                </span>
              ) : registrationSuccess && mode === 'register' ? (
                <span className="flex items-center justify-center gap-2">
                  <BiCheck className="w-5 h-5" />
                  已發送驗證信
                </span>
              ) : (
                mode === 'login' ? '登入' : '註冊'
              )}
            </button>
          </form>

          {/* 切換模式 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrors({});
                setMessage({ type: '', text: '' });
                setRegistrationSuccess(false);
              }}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              {mode === 'login' 
                ? '還沒有帳號?立即註冊' 
                : '已有帳號?返回登入'}
            </button>
          </div>

          {/* 服務條款 */}
          {mode === 'register' && (
            <p className="mt-4 text-xs text-gray-500 text-center">
              註冊即表示您同意我們的
              <a href="/terms" className="text-purple-600 hover:underline mx-1">服務條款</a>
              和
              <a href="/privacy" className="text-purple-600 hover:underline mx-1">隱私政策</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberAuth;
