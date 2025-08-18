import perfectCorpAPI, { PerfectCorpAPIError, analyseSkin } from '../services/perfectCorpAPI';
import { generateMockAnalysisResult, createMemoryFromAnalysis } from './mockData';

/**
 * API 工具函數
 * 提供統一的 API 介面，支援 Mock 和真實 API 切換
 */

// 從環境變數讀取配置
const ENABLE_MOCK_API = process.env.REACT_APP_ENABLE_MOCK_API === 'true';
const DEBUG_MODE = process.env.REACT_APP_DEBUG_MODE === 'true';

/**
 * 統一的肌膚分析介面
 */
export const performSkinAnalysis = async (imageFile, onProgress = null) => {
  if (DEBUG_MODE) {
    console.log('Starting skin analysis...', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      useMockAPI: ENABLE_MOCK_API
    });
  }

  try {
    if (ENABLE_MOCK_API) {
      return await performMockSkinAnalysis(imageFile, onProgress);
    } else {
      return await performRealSkinAnalysis(imageFile, onProgress);
    }
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('Skin analysis failed:', error);
    }
    
    // 如果真實 API 失敗，回退到 Mock API
    if (!ENABLE_MOCK_API) {
      console.warn('Real API failed, falling back to mock API');
      return await performMockSkinAnalysis(imageFile, onProgress);
    }
    
    throw error;
  }
};

/**
 * 真實 API 肌膚分析
 */
const performRealSkinAnalysis = async (imageFile, onProgress) => {
  try {
    const result = await analyseSkin(imageFile, (progress) => {
      // 轉換 API 進度格式為應用程式格式
      const stepMapping = {
        uploading: { step: 1, message: '正在上傳照片...' },
        starting: { step: 2, message: 'AI 引擎啟動中...' },
        analyzing: { step: 2, message: '進行 14 項專業檢測...' },
        polling: { step: 2, message: '分析進行中...' },
        completed: { step: 3, message: '生成分析報告...' },
        error: { step: -1, message: '分析失敗' }
      };

      const mappedProgress = stepMapping[progress.step] || { step: 2, message: '處理中...' };
      
      if (onProgress) {
        onProgress({
          ...mappedProgress,
          progress: progress.progress || 0,
          details: progress.message
        });
      }
    });

    return result;
  } catch (error) {
    if (error instanceof PerfectCorpAPIError) {
      throw new APIError(error.message, error.code, error.details);
    }
    throw new APIError('Skin analysis failed', 'ANALYSIS_ERROR', error);
  }
};

/**
 * Mock API 肌膚分析（用於開發和測試）
 */
const performMockSkinAnalysis = async (imageFile, onProgress) => {
  const steps = [
    { step: 1, message: '正在上傳照片...', delay: 1000 },
    { step: 2, message: 'AI 引擎啟動中...', delay: 1500 },
    { step: 2, message: '進行 14 項專業檢測...', delay: 3000 },
    { step: 3, message: '生成分析報告...', delay: 1000 }
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    
    if (onProgress) {
      onProgress({
        ...step,
        progress: ((i + 1) / steps.length) * 100
      });
    }

    await new Promise(resolve => setTimeout(resolve, step.delay));
  }

  // 生成 Mock 結果
  const mockResult = generateMockAnalysisResult();
  
  // 添加真實 API 格式的 metadata
  mockResult.metadata = {
    ...mockResult.metadata,
    apiType: 'mock',
    processingTime: steps.reduce((sum, step) => sum + step.delay, 0)
  };

  return mockResult;
};

/**
 * 圖片預處理和驗證
 */
export const preprocessImage = async (file) => {
  try {
    // 基本驗證
    validateImageFile(file);
    
    // 圖片壓縮和優化（如果需要）
    const processedFile = await optimizeImage(file);
    
    return processedFile;
  } catch (error) {
    throw new APIError('Image preprocessing failed', 'PREPROCESSING_ERROR', error);
  }
};

/**
 * 驗證圖片檔案
 */
const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const minDimensions = { width: 480, height: 480 };
  
  const errors = [];
  
  if (!validTypes.includes(file.type)) {
    errors.push('請上傳 JPG、JPEG 或 PNG 格式的圖片');
  }
  
  if (file.size > maxSize) {
    errors.push('圖片大小不能超過 10MB');
  }
  
  if (file.size < 1024) {
    errors.push('圖片檔案過小，請選擇有效的圖片');
  }
  
  if (errors.length > 0) {
    throw new APIError('Image validation failed', 'INVALID_IMAGE', errors);
  }
  
  return true;
};

/**
 * 圖片優化處理
 */
const optimizeImage = async (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      try {
        // 獲取圖片尺寸
        const { width, height } = img;
        
        // 計算最佳尺寸（保持比例，限制最大尺寸）
        const maxDimension = 2048;
        let newWidth = width;
        let newHeight = height;
        
        if (width > maxDimension || height > maxDimension) {
          const scale = Math.min(maxDimension / width, maxDimension / height);
          newWidth = Math.floor(width * scale);
          newHeight = Math.floor(height * scale);
        }
        
        // 設置畫布尺寸
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // 繪製優化後的圖片
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // 轉換為 Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // 創建新的 File 對象
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          file.type,
          0.9 // 90% 品質
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 錯誤處理和用戶友好的錯誤消息
 */
export const getErrorMessage = (error) => {
  if (error instanceof APIError || error instanceof PerfectCorpAPIError) {
    switch (error.code) {
      case 'INVALID_FILE_FORMAT':
        return '圖片格式不支援，請使用 JPG、JPEG 或 PNG 格式';
      case 'FILE_TOO_LARGE':
        return '圖片檔案過大，請選擇小於 10MB 的圖片';
      case 'INVALID_IMAGE':
        return Array.isArray(error.details) ? error.details.join('、') : '圖片格式有誤';
      case 'AUTH_ERROR':
        return 'API 認證失敗，請檢查配置';
      case 'NETWORK_ERROR':
        return '網絡連接異常，請檢查網絡狀態';
      case 'ANALYSIS_TIMEOUT':
        return '分析超時，請重試';
      case 'API_ERROR':
        return 'API 服務暫時不可用，請稍後重試';
      default:
        return error.message || '未知錯誤，請重試';
    }
  }
  
  return '系統錯誤，請重試';
};

/**
 * 自定義 API 錯誤類
 */
export class APIError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}

/**
 * 檢查 API 可用性
 */
export const checkAPIAvailability = async () => {
  try {
    if (ENABLE_MOCK_API) {
      return { available: true, type: 'mock' };
    }
    
    // 嘗試獲取 access token 來檢查 API 可用性
    await perfectCorpAPI.getAccessToken();
    return { available: true, type: 'real' };
  } catch (error) {
    if (DEBUG_MODE) {
      console.warn('API availability check failed:', error);
    }
    return { available: false, error: error.message };
  }
};

/**
 * 獲取用戶使用配額
 */
export const getUserQuota = async () => {
  try {
    if (ENABLE_MOCK_API) {
      return {
        available: true,
        remaining: 100,
        total: 100,
        type: 'mock'
      };
    }
    
    const quotaInfo = await perfectCorpAPI.makeAPIRequest('/client/credit');
    
    const totalCredits = quotaInfo.results.reduce((sum, credit) => sum + credit.amount, 0);
    
    return {
      available: totalCredits > 0,
      remaining: totalCredits,
      total: totalCredits,
      type: 'real',
      details: quotaInfo.results
    };
  } catch (error) {
    if (DEBUG_MODE) {
      console.warn('Failed to get user quota:', error);
    }
    return {
      available: false,
      remaining: 0,
      total: 0,
      error: error.message
    };
  }
};

/**
 * 獲取使用歷史
 */
export const getUsageHistory = async (pageSize = 20, startingToken = null) => {
  try {
    if (ENABLE_MOCK_API) {
      return {
        history: [],
        nextToken: null,
        type: 'mock'
      };
    }
    
    let endpoint = `/client/credit/history?page_size=${pageSize}`;
    if (startingToken) {
      endpoint += `&starting_token=${startingToken}`;
    }
    
    const historyInfo = await perfectCorpAPI.makeAPIRequest(endpoint);
    
    return {
      history: historyInfo.result.history || [],
      nextToken: historyInfo.result.next_token,
      type: 'real'
    };
  } catch (error) {
    if (DEBUG_MODE) {
      console.warn('Failed to get usage history:', error);
    }
    return {
      history: [],
      nextToken: null,
      error: error.message
    };
  }
};

/**
 * 記憶體管理工具
 */
export const createMemoryFromAnalysisResult = (analysisResult, existingMemories = []) => {
  return createMemoryFromAnalysis(analysisResult, existingMemories);
};

/**
 * 分析結果比較工具
 */
export const compareAnalysisResults = (currentResult, previousResult) => {
  if (!previousResult) {
    return {
      hasComparison: false,
      message: '這是您的第一次分析結果'
    };
  }
  
  const improvements = [];
  const deteriorations = [];
  
  currentResult.concerns.forEach(currentConcern => {
    const previousConcern = previousResult.concerns.find(
      p => p.name === currentConcern.name
    );
    
    if (previousConcern) {
      const difference = currentConcern.score - previousConcern.score;
      
      if (difference > 0) {
        improvements.push({
          name: currentConcern.name,
          improvement: difference
        });
      } else if (difference < 0) {
        deteriorations.push({
          name: currentConcern.name,
          decline: Math.abs(difference)
        });
      }
    }
  });
  
  return {
    hasComparison: true,
    improvements,
    deteriorations,
    overallChange: currentResult.overall_score - previousResult.overall_score,
    skinAgeChange: currentResult.skin_age - previousResult.skin_age,
    daysBetween: Math.floor((new Date(currentResult.timestamp) - new Date(previousResult.timestamp)) / (1000 * 60 * 60 * 24))
  };
};

/**
 * 導出配置信息（用於調試）
 */
export const getAPIConfig = () => {
  if (!DEBUG_MODE) {
    return { debug: false };
  }
  
  return {
    debug: true,
    useMockAPI: ENABLE_MOCK_API,
    hasClientId: !!process.env.REACT_APP_PERFECT_CORP_CLIENT_ID,
    hasClientSecret: !!process.env.REACT_APP_PERFECT_CORP_CLIENT_SECRET,
    timeout: process.env.REACT_APP_API_TIMEOUT || 30000,
    retryAttempts: process.env.REACT_APP_API_RETRY_ATTEMPTS || 3
  };
};

// 默認導出
export default {
  performSkinAnalysis,
  preprocessImage,
  getErrorMessage,
  checkAPIAvailability,
  getUserQuota,
  getUsageHistory,
  createMemoryFromAnalysisResult,
  compareAnalysisResults,
  getAPIConfig
};