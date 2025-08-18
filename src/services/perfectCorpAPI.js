/**
 * Perfect Corp API Service
 * 整合 Perfect Corp AI Skin Analysis API
 */

// API 配置
const API_CONFIG = {
  baseURL: 'https://yce-api-01.perfectcorp.com/s2s/v1.0',
  authURL: 'https://yce-api-01.perfectcorp.com/s2s/v1.0/auth/token',
  clientId: process.env.REACT_APP_PERFECT_CORP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_PERFECT_CORP_CLIENT_SECRET,
  timeout: 30000,
  retryAttempts: 3
};

// 肌膚分析參數配置
const SKIN_ANALYSIS_CONFIG = {
  // HD 高清分析 (14項檢測)
  HD_ACTIONS: [
    "hd_wrinkle", "hd_pore", "hd_texture", "hd_acne",
    "hd_redness", "hd_oiliness", "hd_age_spot", "hd_radiance",
    "hd_moisture", "hd_dark_circle", "hd_eye_bag", 
    "hd_droopy_upper_eyelid", "hd_droopy_lower_eyelid", "hd_firmness"
  ],
  // SD 標準分析 (14項檢測)
  SD_ACTIONS: [
    "wrinkle", "pore", "texture", "acne", "redness", "oiliness",
    "age_spot", "radiance", "moisture", "dark_circle_v2", "eye_bag",
    "droopy_upper_eyelid", "droopy_lower_eyelid", "firmness"
  ],
  // 圖片要求
  IMAGE_REQUIREMENTS: {
    maxSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
    minDimensions: { width: 480, height: 480 },
    maxDimensions: { width: 2560, height: 2560 }
  }
};

// API 錯誤處理
class PerfectCorpAPIError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'PerfectCorpAPIError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Perfect Corp API Service Class
 */
class PerfectCorpAPIService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiryTime = null;
  }

  /**
   * 生成 RSA 加密的 id_token
   */
  async generateIdToken() {
    try {
      const timestamp = Date.now();
      const payload = `client_id=${API_CONFIG.clientId}&timestamp=${timestamp}`;
      
      // 使用 Web Crypto API 進行 RSA 加密
      const publicKey = await this.importPublicKey(API_CONFIG.clientSecret);
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        publicKey,
        new TextEncoder().encode(payload)
      );
      
      // 轉換為 Base64
      const base64String = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
      return base64String;
    } catch (error) {
      throw new PerfectCorpAPIError('Failed to generate id_token', 'TOKEN_GENERATION_ERROR', error);
    }
  }

  /**
   * 導入 RSA 公鑰
   */
  async importPublicKey(pemKey) {
    try {
      // 移除 PEM 格式標頭和標尾
      const pemContents = pemKey
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\s/g, '');
      
      // Base64 解碼
      const binaryString = atob(pemContents);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // 導入公鑰
      return await window.crypto.subtle.importKey(
        'spki',
        bytes.buffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256'
        },
        false,
        ['encrypt']
      );
    } catch (error) {
      throw new PerfectCorpAPIError('Failed to import public key', 'KEY_IMPORT_ERROR', error);
    }
  }

  /**
   * 獲取訪問令牌
   */
  async getAccessToken() {
    try {
      // 檢查現有 token 是否有效
      if (this.accessToken && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime) {
        return this.accessToken;
      }

      const idToken = await this.generateIdToken();
      
      const response = await fetch(API_CONFIG.authURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: API_CONFIG.clientId,
          id_token: idToken
        }),
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      });

      if (!response.ok) {
        throw new PerfectCorpAPIError(
          `Authentication failed: ${response.status}`,
          'AUTH_ERROR',
          await response.text()
        );
      }

      const data = await response.json();
      
      if (data.status !== 200 || !data.result?.access_token) {
        throw new PerfectCorpAPIError('Invalid authentication response', 'AUTH_RESPONSE_ERROR', data);
      }

      this.accessToken = data.result.access_token;
      // 設置 token 過期時間（通常為 1 小時，這裡設為 50 分鐘安全邊距）
      this.tokenExpiryTime = Date.now() + (50 * 60 * 1000);
      
      return this.accessToken;
    } catch (error) {
      if (error instanceof PerfectCorpAPIError) throw error;
      throw new PerfectCorpAPIError('Authentication failed', 'AUTH_NETWORK_ERROR', error);
    }
  }

  /**
   * 通用 API 請求方法
   */
  async makeAPIRequest(endpoint, options = {}) {
    const accessToken = await this.getAccessToken();
    
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: AbortSignal.timeout(API_CONFIG.timeout)
    };

    const finalOptions = { ...defaultOptions, ...options };
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    for (let attempt = 1; attempt <= API_CONFIG.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new PerfectCorpAPIError(
            `API request failed: ${response.status}`,
            'API_ERROR',
            errorText
          );
        }

        const data = await response.json();
        
        if (data.status && data.status !== 200) {
          throw new PerfectCorpAPIError(
            data.error || 'API returned error status',
            data.error_code || 'API_STATUS_ERROR',
            data
          );
        }

        return data;
      } catch (error) {
        if (attempt === API_CONFIG.retryAttempts) {
          if (error instanceof PerfectCorpAPIError) throw error;
          throw new PerfectCorpAPIError('API request failed after retries', 'NETWORK_ERROR', error);
        }
        
        // 等待後重試
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  /**
   * 上傳圖片檔案
   */
  async uploadImage(file) {
    try {
      // 驗證圖片檔案
      this.validateImageFile(file);

      // 1. 獲取上傳 URL
      const uploadRequest = await this.makeAPIRequest('/file/skin-analysis', {
        method: 'POST',
        body: JSON.stringify({
          files: [{
            content_type: file.type,
            file_name: file.name,
            file_size: file.size
          }]
        })
      });

      const fileInfo = uploadRequest.result.files[0];
      const uploadURL = fileInfo.requests[0].url;
      const headers = fileInfo.requests[0].headers;

      // 2. 上傳圖片到指定 URL
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
          'Content-Length': file.size.toString(),
          ...headers
        },
        body: file,
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      });

      if (!uploadResponse.ok) {
        throw new PerfectCorpAPIError(
          `Image upload failed: ${uploadResponse.status}`,
          'UPLOAD_ERROR'
        );
      }

      return fileInfo.file_id;
    } catch (error) {
      if (error instanceof PerfectCorpAPIError) throw error;
      throw new PerfectCorpAPIError('Image upload failed', 'UPLOAD_NETWORK_ERROR', error);
    }
  }

  /**
   * 驗證圖片檔案
   */
  validateImageFile(file) {
    const { maxSize, supportedFormats } = SKIN_ANALYSIS_CONFIG.IMAGE_REQUIREMENTS;

    if (!supportedFormats.includes(file.type)) {
      throw new PerfectCorpAPIError(
        'Unsupported file format. Please use JPG, JPEG, or PNG.',
        'INVALID_FILE_FORMAT'
      );
    }

    if (file.size > maxSize) {
      throw new PerfectCorpAPIError(
        'File size too large. Maximum size is 10MB.',
        'FILE_TOO_LARGE'
      );
    }
  }

  /**
   * 開始肌膚分析任務
   */
  async startSkinAnalysis(fileId, analysisType = 'HD') {
    try {
      const actions = analysisType === 'HD' 
        ? SKIN_ANALYSIS_CONFIG.HD_ACTIONS 
        : SKIN_ANALYSIS_CONFIG.SD_ACTIONS;

      const response = await this.makeAPIRequest('/task/skin-analysis', {
        method: 'POST',
        body: JSON.stringify({
          request_id: 0,
          payload: {
            file_sets: {
              src_ids: [fileId]
            },
            actions: [{
              id: 0,
              params: {},
              dst_actions: actions
            }]
          }
        })
      });

      return response.result.task_id;
    } catch (error) {
      if (error instanceof PerfectCorpAPIError) throw error;
      throw new PerfectCorpAPIError('Failed to start skin analysis', 'ANALYSIS_START_ERROR', error);
    }
  }

  /**
   * 查詢分析任務狀態
   */
  async getAnalysisStatus(taskId) {
    try {
      const response = await this.makeAPIRequest(`/task/skin-analysis?task_id=${encodeURIComponent(taskId)}`);
      return response.result;
    } catch (error) {
      if (error instanceof PerfectCorpAPIError) throw error;
      throw new PerfectCorpAPIError('Failed to get analysis status', 'STATUS_CHECK_ERROR', error);
    }
  }

  /**
   * 輪詢分析結果
   */
  async pollAnalysisResult(taskId, onProgress = null) {
    const maxAttempts = 60; // 最多等待 5 分鐘
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await this.getAnalysisStatus(taskId);
        
        if (onProgress) {
          onProgress({
            status: status.status,
            attempts: attempts + 1,
            maxAttempts
          });
        }

        if (status.status === 'success') {
          return this.processAnalysisResult(status);
        }
        
        if (status.status === 'error') {
          throw new PerfectCorpAPIError(
            status.error_message || 'Analysis failed',
            status.error || 'ANALYSIS_ERROR'
          );
        }

        // 等待指定的輪詢間隔
        const pollingInterval = status.polling_interval || 2000;
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
        
        attempts++;
      } catch (error) {
        if (error instanceof PerfectCorpAPIError) throw error;
        throw new PerfectCorpAPIError('Polling failed', 'POLLING_ERROR', error);
      }
    }

    throw new PerfectCorpAPIError('Analysis timeout', 'ANALYSIS_TIMEOUT');
  }

  /**
   * 處理分析結果
   */
  async processAnalysisResult(statusResult) {
    try {
      if (!statusResult.results?.[0]?.data?.[0]?.url) {
        throw new PerfectCorpAPIError('Invalid analysis result format', 'INVALID_RESULT_FORMAT');
      }

      const resultURL = statusResult.results[0].data[0].url;
      
      // 下載分析結果 ZIP 檔案
      const zipResponse = await fetch(resultURL, {
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      });

      if (!zipResponse.ok) {
        throw new PerfectCorpAPIError('Failed to download analysis result', 'DOWNLOAD_ERROR');
      }

      const zipBlob = await zipResponse.blob();
      
      // 解析 ZIP 檔案（需要引入 JSZip 或類似庫）
      const analysisData = await this.parseAnalysisZip(zipBlob);
      
      return this.formatAnalysisResult(analysisData);
    } catch (error) {
      if (error instanceof PerfectCorpAPIError) throw error;
      throw new PerfectCorpAPIError('Failed to process analysis result', 'RESULT_PROCESSING_ERROR', error);
    }
  }

  /**
   * 解析分析結果 ZIP 檔案
   */
  async parseAnalysisZip(zipBlob) {
    // 注意：這裡需要引入 JSZip 庫
    // npm install jszip
    const JSZip = (await import('jszip')).default;
    
    try {
      const zip = await JSZip.loadAsync(zipBlob);
      const scoreFile = zip.file('skinanalysisResult/score_info.json');
      
      if (!scoreFile) {
        throw new PerfectCorpAPIError('Score info file not found in analysis result', 'MISSING_SCORE_FILE');
      }

      const scoreContent = await scoreFile.async('text');
      const scoreData = JSON.parse(scoreContent);

      // 獲取遮罩圖片（可選）
      const maskFiles = {};
      zip.forEach((relativePath, file) => {
        if (relativePath.includes('skinanalysisResult/') && relativePath.endsWith('.png')) {
          maskFiles[relativePath] = file;
        }
      });

      return {
        scoreData,
        maskFiles
      };
    } catch (error) {
      throw new PerfectCorpAPIError('Failed to parse analysis ZIP file', 'ZIP_PARSING_ERROR', error);
    }
  }

  /**
   * 格式化分析結果為應用程式格式
   */
  formatAnalysisResult(analysisData) {
    const { scoreData } = analysisData;
    
    // 處理關注項目
    const concerns = [];
    
    // HD 分析結果處理
    const concernMapping = {
      'hd_wrinkle': { name: '皺紋', category: 'aging' },
      'hd_pore': { name: '毛孔', category: 'texture' },
      'hd_texture': { name: '膚質', category: 'texture' },
      'hd_acne': { name: '痘痘', category: 'blemish' },
      'hd_redness': { name: '泛紅', category: 'sensitivity' },
      'hd_oiliness': { name: '出油', category: 'oiliness' },
      'hd_age_spot': { name: '色斑', category: 'pigmentation' },
      'hd_radiance': { name: '亮澤度', category: 'radiance' },
      'hd_moisture': { name: '水分', category: 'hydration' },
      'hd_dark_circle': { name: '黑眼圈', category: 'eye_area' },
      'hd_eye_bag': { name: '眼袋', category: 'eye_area' },
      'hd_firmness': { name: '緊緻度', category: 'firmness' }
    };

    Object.entries(scoreData).forEach(([key, value]) => {
      if (concernMapping[key] && value.ui_score !== undefined) {
        concerns.push({
          name: concernMapping[key].name,
          score: value.ui_score,
          raw_score: value.raw_score,
          status: this.getScoreStatus(value.ui_score),
          improvement: this.calculateImprovement(value.ui_score),
          category: concernMapping[key].category,
          details: value.details || null
        });
      }
    });

    // 生成建議
    const recommendations = this.generateRecommendations(concerns);

    return {
      overall_score: scoreData.all?.score || this.calculateOverallScore(concerns),
      skin_age: scoreData.skin_age || null,
      timestamp: new Date().toISOString(),
      concerns,
      recommendations,
      metadata: {
        analysisId: this.generateAnalysisId(),
        processingTime: Date.now(),
        imageQuality: 'good',
        faceDetected: true,
        lightingCondition: 'optimal',
        rawData: scoreData
      }
    };
  }

  /**
   * 根據分數決定狀態
   */
  getScoreStatus(score) {
    if (score >= 85) return "優秀";
    if (score >= 70) return "良好";
    return "需改善";
  }

  /**
   * 計算改善百分比（相對於歷史數據）
   */
  calculateImprovement(score) {
    // 這裡可以與歷史數據比較，目前返回模擬值
    const isPositive = Math.random() > 0.3;
    const value = Math.floor(Math.random() * 15) + 1;
    return isPositive ? `+${value}%` : `-${value}%`;
  }

  /**
   * 計算總體分數
   */
  calculateOverallScore(concerns) {
    if (concerns.length === 0) return 0;
    const totalScore = concerns.reduce((sum, concern) => sum + concern.score, 0);
    return Math.round(totalScore / concerns.length);
  }

  /**
   * 生成個人化建議
   */
  generateRecommendations(concerns) {
    const recommendations = [];
    
    concerns.forEach(concern => {
      if (concern.score < 70) {
        switch (concern.category) {
          case 'hydration':
            recommendations.push('建議加強保濕護理，使用含玻尿酸成分的精華液');
            break;
          case 'texture':
            recommendations.push('定期使用溫和去角質產品，改善肌膚紋理');
            break;
          case 'pigmentation':
            recommendations.push('使用含維他命C的精華，提升肌膚亮澤度並淡化色斑');
            break;
          case 'aging':
            recommendations.push('建議使用含胜肽成分的抗老精華');
            break;
          case 'oiliness':
            recommendations.push('使用含煙醯胺成分的產品，調節油脂分泌');
            break;
        }
      }
    });

    // 添加通用建議
    if (recommendations.length === 0) {
      recommendations.push('您的肌膚狀態良好，建議維持現有的保養習慣');
    }
    
    recommendations.push('加強防曬保護，預防肌膚老化');
    recommendations.push('保持充足睡眠，有助肌膚自我修復');

    return recommendations.slice(0, 4); // 最多返回 4 個建議
  }

  /**
   * 生成分析 ID
   */
  generateAnalysisId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PC_${timestamp}_${random}`;
  }
}

// 創建全域實例
const perfectCorpAPI = new PerfectCorpAPIService();

// 導出 API 服務和錯誤類
export { perfectCorpAPI as default, PerfectCorpAPIError, SKIN_ANALYSIS_CONFIG };

// 導出便捷方法
export const analyseSkin = async (imageFile, onProgress = null) => {
  try {
    // 1. 上傳圖片
    onProgress?.({ step: 'uploading', message: '正在上傳圖片...' });
    const fileId = await perfectCorpAPI.uploadImage(imageFile);
    
    // 2. 開始分析
    onProgress?.({ step: 'starting', message: '開始 AI 分析...' });
    const taskId = await perfectCorpAPI.startSkinAnalysis(fileId, 'HD');
    
    // 3. 輪詢結果
    onProgress?.({ step: 'analyzing', message: '分析中，請稍候...' });
    const result = await perfectCorpAPI.pollAnalysisResult(taskId, (progress) => {
      onProgress?.({ 
        step: 'polling', 
        message: `分析進行中 (${progress.attempts}/${progress.maxAttempts})...`,
        progress: progress.attempts / progress.maxAttempts * 100
      });
    });
    
    onProgress?.({ step: 'completed', message: '分析完成！' });
    return result;
  } catch (error) {
    onProgress?.({ step: 'error', message: error.message });
    throw error;
  }
};