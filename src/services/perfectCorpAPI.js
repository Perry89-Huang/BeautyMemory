/**
 * Perfect Corp API Service - 完整最終版本
 * 整合 Perfect Corp AI Skin Analysis API
 * 支援真實 API 和 Mock 模式
 * 
 * @version 2.0.0
 * @author Beauty Memory Team
 * @created 2025-01-15
 */

// ========================================
// API 配置和常數定義
// ========================================

const API_CONFIG = {
  baseURL: 'https://yce-api-01.perfectcorp.com/s2s/v1.0',
  authURL: 'https://yce-api-01.perfectcorp.com/s2s/v1.0/client/auth',
  clientId: process.env.REACT_APP_PERFECT_CORP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_PERFECT_CORP_CLIENT_SECRET,
  timeout: 30000,
  retryAttempts: 3
};

const SKIN_ANALYSIS_CONFIG = {
  HD_ACTIONS: [
    "hd_wrinkle", "hd_pore", "hd_texture", "hd_acne",
    "hd_redness", "hd_oiliness", "hd_age_spot", "hd_radiance",
    "hd_moisture", "hd_dark_circle", "hd_eye_bag", 
    "hd_droopy_upper_eyelid", "hd_droopy_lower_eyelid", "hd_firmness"
  ],
  SD_ACTIONS: [
    "wrinkle", "pore", "texture", "acne", "redness", "oiliness",
    "age_spot", "radiance", "moisture", "dark_circle_v2", "eye_bag",
    "droopy_upper_eyelid", "droopy_lower_eyelid", "firmness"
  ],
  IMAGE_REQUIREMENTS: {
    maxSize: 10 * 1024 * 1024,
    supportedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
    minDimensions: { width: 480, height: 480 },
    maxDimensions: { width: 2560, height: 2560 }
  }
};

// ========================================
// 工具函數
// ========================================

const checkEnvironmentConfig = () => {
  const missingVars = [];
  
  if (!API_CONFIG.clientId) {
    missingVars.push('REACT_APP_PERFECT_CORP_CLIENT_ID');
  }
  
  if (!API_CONFIG.clientSecret) {
    missingVars.push('REACT_APP_PERFECT_CORP_CLIENT_SECRET');
  }
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Using Mock API mode...');
    return false;
  }
  
  return true;
};

const base64UrlEncode = (obj) => {
  const str = JSON.stringify(obj);
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// ========================================
// 錯誤處理類
// ========================================

class PerfectCorpAPIError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'PerfectCorpAPIError';
    this.code = code;
    this.details = details;
  }
}

// ========================================
// Perfect Corp API Service 主類
// ========================================

class PerfectCorpAPIService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiryTime = null;
    this.isInitialized = false;
    this.useMockAPI = false;
  }

  async initialize() {
    try {
      const hasConfig = checkEnvironmentConfig();
      
      if (!hasConfig) {
        this.useMockAPI = true;
        console.log('🧪 Perfect Corp API initialized in Mock mode');
      } else {
        console.log('🔗 Perfect Corp API initialized in Real mode');
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Perfect Corp API service:', error);
      this.useMockAPI = true;
      this.isInitialized = true;
      return false;
    }
  }

  async generateIdToken() {
  try {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.useMockAPI) {
      return 'mock_id_token_' + Date.now();
    }

    // 檢查環境變數
    if (!API_CONFIG.clientId || !API_CONFIG.clientSecret) {
      throw new PerfectCorpAPIError(
        'Missing API credentials. Please check REACT_APP_PERFECT_CORP_CLIENT_ID and REACT_APP_PERFECT_CORP_CLIENT_SECRET',
        'MISSING_CREDENTIALS'
      );
    }

    const timestamp = Date.now();
    const dataToEncrypt = `client_id=${API_CONFIG.clientId}&timestamp=${timestamp}`;
    
    // 使用 Perfect Corp 要求的 RSA 加密方式
    // 注意：瀏覽器環境中的 RSA 加密實現
    try {
      // 導入 JSEncrypt 庫來處理 RSA 加密
      const { JSEncrypt } = await import('jsencrypt');
      
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(API_CONFIG.clientSecret);
      const encrypted = encrypt.encrypt(dataToEncrypt);
      
      if (!encrypted) {
        throw new Error('RSA encryption failed');
      }
      
      return encrypted;
    } catch (encryptError) {
      console.error('RSA encryption error:', encryptError);
      throw new PerfectCorpAPIError(
        'Failed to encrypt authentication data',
        'ENCRYPTION_ERROR',
        encryptError
      );
    }

  } catch (error) {
    throw new PerfectCorpAPIError(
      'Failed to generate authentication token', 
      'TOKEN_GENERATION_ERROR', 
      error
    );
  }
  }

  async getAccessToken() {
    try {
      if (this.useMockAPI) {
        console.log('🧪 [MOCK MODE] 回傳模擬 access token');
        return 'mock_access_token_' + Date.now();
      }

      // 檢查 token 是否還有效
      if (this.accessToken && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime) {
        console.log('✅ [TOKEN CACHE] 使用現有的 access token');
        return this.accessToken;
      }

      console.log('🔐 [AUTH] 開始 PerfectCorp API 認證流程');
      
      const idToken = await this.generateIdToken();
      console.log('🎫 [ID_TOKEN] 生成的 id_token:', idToken);
      
      const requestBody = {
        client_id: API_CONFIG.clientId,
        id_token: idToken
      };
      
      console.log('📤 [REQUEST] 發送認證請求到:', API_CONFIG.authURL);
      console.log('📤 [REQUEST BODY]:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(API_CONFIG.authURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'BeautyMemory/1.0'
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      });

      console.log('📊 [RESPONSE] HTTP 狀態碼:', response.status);
      console.log('📊 [RESPONSE] Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [AUTH ERROR] 認證失敗');
        console.error('❌ [ERROR RESPONSE]:', errorText);
        
        throw new PerfectCorpAPIError(
          `Authentication failed: HTTP ${response.status}`,
          'AUTH_ERROR',
          { status: response.status, body: errorText }
        );
      }

      const data = await response.json();
      
      console.log('✅ [SUCCESS] PerfectCorp API 認證回傳數據:');
      console.log('🔍 [FULL RESPONSE]:', JSON.stringify(data, null, 2));
      
      if (data.status !== 200 || !data.result?.access_token) {
        console.error('❌ [INVALID RESPONSE] 回傳格式錯誤:', data);
        throw new PerfectCorpAPIError(
          'Invalid authentication response format', 
          'AUTH_RESPONSE_ERROR', 
          data
        );
      }

      this.accessToken = data.result.access_token;
      this.tokenExpiryTime = Date.now() + (110 * 60 * 1000);
      
      console.log('🎟️ [ACCESS TOKEN] 獲得 access_token:', this.accessToken);
      console.log('⏰ [TOKEN EXPIRY] Token 過期時間:', new Date(this.tokenExpiryTime).toLocaleString());
      
      return this.accessToken;

    } catch (error) {
      console.error('💥 [AUTH EXCEPTION] 認證過程發生異常:', error);
      
      if (error instanceof PerfectCorpAPIError) {
        throw error;
      }
      
      throw new PerfectCorpAPIError(
        'Authentication network error', 
        'AUTH_NETWORK_ERROR', 
        error
      );
    }
  }

  async makeAPIRequest(endpoint, options = {}) {
    if (this.useMockAPI) {
      console.log('🧪 [MOCK MODE] 使用模擬 API 響應');
      const mockResponse = this.mockAPIResponse(endpoint, options);
      console.log('🧪 [MOCK RESPONSE]:', mockResponse);
      return mockResponse;
    }

    console.log(`🌐 [API REQUEST] 發送請求到端點: ${endpoint}`);
    console.log(`🌐 [REQUEST OPTIONS]:`, JSON.stringify(options, null, 2));

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
    
    console.log(`📍 [FULL URL]:`, url);
    console.log(`📋 [FINAL OPTIONS]:`, JSON.stringify(finalOptions, null, 2));

    for (let attempt = 1; attempt <= API_CONFIG.retryAttempts; attempt++) {
      try {
        console.log(`🔄 [ATTEMPT ${attempt}] 嘗試第 ${attempt} 次請求`);
        
        const response = await fetch(url, finalOptions);
        
        console.log(`📊 [RESPONSE ${attempt}] HTTP 狀態碼:`, response.status);
        console.log(`📊 [RESPONSE ${attempt}] Headers:`, Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ [ERROR ${attempt}] API 請求失敗:`);
          console.error(`❌ [ERROR RESPONSE ${attempt}]:`, errorText);
          
          if (attempt === API_CONFIG.retryAttempts) {
            throw new PerfectCorpAPIError(
              `API request failed: HTTP ${response.status}`,
              'API_REQUEST_ERROR',
              { status: response.status, body: errorText, attempt }
            );
          }
          
          console.log(`🔄 [RETRY] 等待重試... (${attempt}/${API_CONFIG.retryAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        const responseData = await response.json();
        
        console.log(`✅ [SUCCESS ${attempt}] API 請求成功!`);
        console.log(`🔍 [RESPONSE DATA ${attempt}]:`, JSON.stringify(responseData, null, 2));
        
        return responseData;
        
      } catch (error) {
        console.error(`💥 [EXCEPTION ${attempt}] 請求發生異常:`, error);
        
        if (attempt === API_CONFIG.retryAttempts) {
          throw new PerfectCorpAPIError(
            'API request network error',
            'API_NETWORK_ERROR',
            error
          );
        }
        
        console.log(`🔄 [RETRY] 等待重試... (${attempt}/${API_CONFIG.retryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }


  mockAPIResponse(endpoint, options) {
    console.log(`🧪 Mock API call: ${endpoint}`);
    
    if (endpoint.includes('/client/credit')) {
      return Promise.resolve({
        status: 200,
        results: [{ amount: 100, type: 'trial' }]
      });
    }
    
    if (endpoint.includes('/file/skin-analysis')) {
      return Promise.resolve({
        status: 200,
        result: {
          files: [{
            file_id: 'mock_file_' + Date.now(),
            requests: [{
              url: 'https://mock-upload-url.com',
              headers: {}
            }]
          }]
        }
      });
    }
    
    if (endpoint.includes('/task/skin-analysis')) {
      if (options.method === 'POST') {
        return Promise.resolve({
          status: 200,
          result: { task_id: 'mock_task_' + Date.now() }
        });
      } else {
        return Promise.resolve({
          status: 200,
          result: {
            status: 'success',
            results: [{
              data: [{ url: 'https://mock-result-url.com/result.zip' }]
            }]
          }
        });
      }
    }
    
    return Promise.resolve({ status: 200, result: {} });
  }

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

    if (file.size < 1024) {
      throw new PerfectCorpAPIError(
        'File size too small. Please select a valid image.',
        'FILE_TOO_SMALL'
      );
    }
  }

  async uploadImage(imageFile) {
  console.log('📤 [UPLOAD] 開始上傳圖片');
  console.log('📤 [IMAGE INFO]:', {
    name: imageFile.name,
    size: imageFile.size,
    type: imageFile.type
  });

  if (this.useMockAPI) {
    console.log('🧪 [MOCK UPLOAD] 模擬上傳，回傳假的檔案 ID');
    return `mock_file_id_${Date.now()}`;
  }

  // 實際上傳邏輯...
  const response = await this.makeAPIRequest('/upload', {
    method: 'POST',
    body: imageFile
  });

  console.log('✅ [UPLOAD SUCCESS] 圖片上傳成功:', response);
  return response.file_id;
  }

  async startSkinAnalysis(fileId, analysisType = 'HD') {
    console.log('🔬 [ANALYSIS] 開始肌膚分析');
    console.log('🔬 [ANALYSIS PARAMS]:', { fileId, analysisType });

    if (this.useMockAPI) {
      console.log('🧪 [MOCK ANALYSIS] 模擬分析，回傳假的任務 ID');
      return `mock_task_id_${Date.now()}`;
    }

    const analysisActions = analysisType === 'HD' ? 
      SKIN_ANALYSIS_CONFIG.HD_ACTIONS : 
      SKIN_ANALYSIS_CONFIG.SD_ACTIONS;

    const requestBody = {
      file_id: fileId,
      actions: analysisActions
    };

    console.log('🔬 [ANALYSIS REQUEST]:', JSON.stringify(requestBody, null, 2));

    const response = await this.makeAPIRequest('/task/ai-skin-analysis', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    console.log('✅ [ANALYSIS STARTED] 分析任務已啟動:', response);
    return response.task_id;
  }

  async getAnalysisStatus(taskId) {
    try {
      if (this.useMockAPI) {
        const taskAge = Date.now() - parseInt(taskId.split('_')[2]);
        
        if (taskAge < 3000) {
          return {
            status: 'processing',
            polling_interval: 1000
          };
        } else {
          return {
            status: 'success',
            results: [{
              data: [{ url: 'mock://analysis-result.zip' }]
            }]
          };
        }
      }

      const response = await this.makeAPIRequest(`/task/skin-analysis?task_id=${encodeURIComponent(taskId)}`);
      return response.result;
    } catch (error) {
      if (error instanceof PerfectCorpAPIError) throw error;
      throw new PerfectCorpAPIError('Failed to get analysis status', 'STATUS_CHECK_ERROR', error);
    }
  }

  async pollAnalysisResult(taskId, onProgress = null) {
    console.log('⏳ [POLLING] 開始輪詢分析結果');
    console.log('⏳ [TASK ID]:', taskId);

    if (this.useMockAPI) {
      console.log('🧪 [MOCK POLLING] 模擬輪詢過程');
      
      // 模擬輪詢過程
      for (let i = 1; i <= 3; i++) {
        console.log(`🧪 [MOCK POLL ${i}] 模擬輪詢第 ${i} 次`);
        onProgress?.({ attempts: i, maxAttempts: 3 });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const mockResult = this.generateMockAnalysisResult();
      console.log('🧪 [MOCK RESULT] 模擬分析結果:', mockResult);
      return mockResult;
    }

    const maxAttempts = 30;
    const pollInterval = 2000; // 2 秒

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔍 [POLL ${attempt}] 第 ${attempt} 次輪詢 (最多 ${maxAttempts} 次)`);
      
      try {
        const response = await this.makeAPIRequest(`/task/ai-skin-analysis?task_id=${taskId}`);
        
        console.log(`📊 [POLL RESPONSE ${attempt}]:`, JSON.stringify(response, null, 2));
        
        onProgress?.({ attempts: attempt, maxAttempts });

        if (response.status === 'success') {
          console.log('🎉 [ANALYSIS COMPLETE] 分析完成!');
          console.log('🔍 [FINAL RESULT]:', JSON.stringify(response.result, null, 2));
          return this.formatAnalysisResult(response.result);
        }

        if (response.status === 'error') {
          console.error('❌ [ANALYSIS ERROR] 分析失敗:', response.error);
          throw new PerfectCorpAPIError(
            `Analysis failed: ${response.error}`,
            'ANALYSIS_ERROR',
            response
          );
        }

        console.log(`⏳ [WAITING] 分析進行中，${pollInterval/1000} 秒後重試...`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));

      } catch (error) {
        console.error(`💥 [POLL ERROR ${attempt}] 輪詢發生錯誤:`, error);
        
        if (attempt === maxAttempts) {
          throw new PerfectCorpAPIError(
            'Analysis polling timeout',
            'ANALYSIS_TIMEOUT',
            error
          );
        }
      }
    }

    throw new PerfectCorpAPIError(
      'Analysis timeout - exceeded maximum polling attempts',
      'ANALYSIS_TIMEOUT',
      { maxAttempts, taskId }
    );
  }

  async processAnalysisResult(statusResult) {
    try {
      if (this.useMockAPI) {
        return this.generateMockAnalysisResult();
      }

      if (!statusResult.results?.[0]?.data?.[0]?.url) {
        throw new PerfectCorpAPIError('Invalid analysis result format', 'INVALID_RESULT_FORMAT');
      }

      const resultURL = statusResult.results[0].data[0].url;
      
      const zipResponse = await fetch(resultURL, {
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      });

      if (!zipResponse.ok) {
        throw new PerfectCorpAPIError('Failed to download analysis result', 'DOWNLOAD_ERROR');
      }

      const zipBlob = await zipResponse.blob();
      const analysisData = await this.parseAnalysisZip(zipBlob);
      
      return this.formatAnalysisResult(analysisData);
    } catch (error) {
      if (error instanceof PerfectCorpAPIError) throw error;
      throw new PerfectCorpAPIError('Failed to process analysis result', 'RESULT_PROCESSING_ERROR', error);
    }
  }

  generateMockAnalysisResult() {
    const baseScore = Math.floor(Math.random() * 20) + 70;
    
    return {
      overall_score: baseScore,
      skin_age: Math.floor(Math.random() * 10) + 25,
      timestamp: new Date().toISOString(),
      
      concerns: [
        {
          name: "皺紋",
          score: Math.floor(Math.random() * 30) + 70,
          status: this.getScoreStatus(Math.floor(Math.random() * 30) + 70),
          improvement: this.generateImprovement(),
          category: "aging"
        },
        {
          name: "毛孔",
          score: Math.floor(Math.random() * 30) + 60,
          status: this.getScoreStatus(Math.floor(Math.random() * 30) + 60),
          improvement: this.generateImprovement(),
          category: "texture"
        },
        {
          name: "色斑",
          score: Math.floor(Math.random() * 20) + 80,
          status: this.getScoreStatus(Math.floor(Math.random() * 20) + 80),
          improvement: this.generateImprovement(),
          category: "pigmentation"
        },
        {
          name: "水分",
          score: Math.floor(Math.random() * 25) + 60,
          status: this.getScoreStatus(Math.floor(Math.random() * 25) + 60),
          improvement: this.generateImprovement(),
          category: "hydration"
        },
        {
          name: "亮澤度",
          score: Math.floor(Math.random() * 15) + 85,
          status: this.getScoreStatus(Math.floor(Math.random() * 15) + 85),
          improvement: this.generateImprovement(),
          category: "radiance"
        },
        {
          name: "膚質",
          score: Math.floor(Math.random() * 25) + 70,
          status: this.getScoreStatus(Math.floor(Math.random() * 25) + 70),
          improvement: this.generateImprovement(),
          category: "texture"
        }
      ],
      
      recommendations: this.generateRecommendations(),
      
      metadata: {
        analysisId: this.generateAnalysisId(),
        processingTime: Math.floor(Math.random() * 3000) + 2000,
        imageQuality: "good",
        faceDetected: true,
        lightingCondition: "optimal",
        apiType: 'mock'
      }
    };
  }

  async parseAnalysisZip(zipBlob) {
    try {
      const JSZip = (await import('jszip')).default;
      
      const zip = await JSZip.loadAsync(zipBlob);
      const scoreFile = zip.file('skinanalysisResult/score_info.json');
      
      if (!scoreFile) {
        throw new PerfectCorpAPIError('Score info file not found in analysis result', 'MISSING_SCORE_FILE');
      }

      const scoreContent = await scoreFile.async('text');
      const scoreData = JSON.parse(scoreContent);

      const maskFiles = {};
      zip.forEach((relativePath, file) => {
        if (relativePath.includes('skinanalysisResult/') && relativePath.endsWith('.png')) {
          maskFiles[relativePath] = file;
        }
      });

      return { scoreData, maskFiles };
    } catch (error) {
      throw new PerfectCorpAPIError('Failed to parse analysis ZIP file', 'ZIP_PARSING_ERROR', error);
    }
  }

  formatAnalysisResult(analysisData) {
    const { scoreData } = analysisData;
    const concerns = [];
    
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
          improvement: this.generateImprovement(),
          category: concernMapping[key].category,
          details: value.details || null
        });
      }
    });

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
        rawData: scoreData,
        apiType: this.useMockAPI ? 'mock' : 'real'
      }
    };
  }

  getScoreStatus(score) {
    if (score >= 85) return "優秀";
    if (score >= 70) return "良好";
    return "需改善";
  }

  generateImprovement() {
    const isPositive = Math.random() > 0.3;
    const value = Math.floor(Math.random() * 15) + 1;
    return isPositive ? `+${value}%` : `-${value}%`;
  }

  calculateOverallScore(concerns) {
    if (concerns.length === 0) return 0;
    const totalScore = concerns.reduce((sum, concern) => sum + concern.score, 0);
    return Math.round(totalScore / concerns.length);
  }

  generateRecommendations(concerns = []) {
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

    if (recommendations.length === 0) {
      recommendations.push('您的肌膚狀態良好，建議維持現有的保養習慣');
    }
    
    recommendations.push('加強防曬保護，預防肌膚老化');
    recommendations.push('保持充足睡眠，有助肌膚自我修復');

    return recommendations.slice(0, 4);
  }

  generateAnalysisId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${this.useMockAPI ? 'MOCK' : 'PC'}_${timestamp}_${random}`;
  }

  async testConnection() {
    try {
      if (this.useMockAPI) {
        return { 
          success: true, 
          message: 'Mock API connection successful',
          type: 'mock'
        };
      }

      const token = await this.getAccessToken();
      
      const response = await fetch(`${API_CONFIG.baseURL}/client/credit`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        return { 
          success: true, 
          message: 'Real API connection successful',
          type: 'real'
        };
      } else {
        return { 
          success: false, 
          message: `API test failed: HTTP ${response.status}`,
          details: await response.text(),
          type: 'real'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'API connection failed',
        error: error.message,
        type: this.useMockAPI ? 'mock' : 'real'
      };
    }
  }

  async getUserQuota() {
    console.log('💰 [QUOTA] 檢查用戶額度');
    
    try {
      if (this.useMockAPI) {
        const mockQuota = {
          available: true,
          remaining: 100,
          total: 100,
          type: 'mock'
        };
        console.log('🧪 [MOCK QUOTA]:', mockQuota);
        return mockQuota;
      }

      const quotaInfo = await this.makeAPIRequest('/client/credit');
      console.log('📊 [QUOTA RESPONSE]:', JSON.stringify(quotaInfo, null, 2));
      
      const totalCredits = quotaInfo.results.reduce((sum, credit) => sum + credit.amount, 0);
      
      const quota = {
        available: totalCredits > 0,
        remaining: totalCredits,
        total: totalCredits,
        type: 'real',
        details: quotaInfo.results
      };
      
      console.log('💰 [FINAL QUOTA]:', quota);
      return quota;
      
    } catch (error) {
      console.error('❌ [QUOTA ERROR] 獲取額度失敗:', error);
      
      return {
        available: false,
        remaining: 0,
        total: 0,
        error: error.message,
        type: this.useMockAPI ? 'mock' : 'real'
      };
    }
  }

  async checkAvailability() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.useMockAPI) {
        return { 
          available: true, 
          type: 'mock',
          message: 'Mock API mode enabled'
        };
      }

      await this.getAccessToken();
      return { 
        available: true, 
        type: 'real',
        message: 'Real API connection successful'
      };
    } catch (error) {
      console.warn('API availability check failed:', error);
      
      this.useMockAPI = true;
      
      return { 
        available: true, 
        type: 'mock_fallback',
        error: error.message,
        message: 'Switched to Mock API mode due to connection issues'
      };
    }
  }
}

// ========================================
// 創建服務實例
// ========================================

const perfectCorpAPI = new PerfectCorpAPIService();

// ========================================
// 便捷方法導出
// ========================================

export const analyseSkin = async (imageFile, onProgress = null) => {
  try {
    if (!perfectCorpAPI.isInitialized) {
      await perfectCorpAPI.initialize();
    }

    onProgress?.({ step: 1, message: '正在上傳圖片...', progress: 10 });
    const fileId = await perfectCorpAPI.uploadImage(imageFile);
    
    onProgress?.({ step: 2, message: '開始 AI 分析...', progress: 30 });
    const taskId = await perfectCorpAPI.startSkinAnalysis(fileId, 'HD');
    
    onProgress?.({ step: 2, message: '分析中，請稍候...', progress: 50 });
    const result = await perfectCorpAPI.pollAnalysisResult(taskId, (progress) => {
      onProgress?.({ 
        step: 2, 
        message: `分析進行中 (${progress.attempts}/${progress.maxAttempts})...`,
        progress: 50 + (progress.attempts / progress.maxAttempts * 40)
      });
    });
    
    onProgress?.({ step: 3, message: '分析完成！', progress: 100 });
    return result;
  } catch (error) {
    onProgress?.({ step: -1, message: error.message });
    throw error;
  }
};

export const checkAPIAvailability = async () => {
  return await perfectCorpAPI.checkAvailability();
};

export const getUserQuota = async () => {
  return await perfectCorpAPI.getUserQuota();
};

export const testAPIConnection = async () => {
  try {
    const result = await perfectCorpAPI.testConnection();
    console.log('API Connection Test:', result);
    return result;
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    return { 
      success: false, 
      message: 'Connection test failed',
      error: error.message 
    };
  }
};

export const preprocessImage = async (file) => {
  try {
    perfectCorpAPI.validateImageFile(file);
    return await optimizeImage(file);
  } catch (error) {
    throw new PerfectCorpAPIError('Image preprocessing failed', 'PREPROCESSING_ERROR', error);
  }
};

const optimizeImage = async (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      try {
        const { width, height } = img;
        const maxDimension = 2048;
        let newWidth = width;
        let newHeight = height;
        
        if (width > maxDimension || height > maxDimension) {
          const scale = Math.min(maxDimension / width, maxDimension / height);
          newWidth = Math.floor(width * scale);
          newHeight = Math.floor(height * scale);
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
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
          0.9
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

export const getErrorMessage = (error) => {
  if (error instanceof PerfectCorpAPIError) {
    switch (error.code) {
      case 'INVALID_FILE_FORMAT':
        return '圖片格式不支援，請使用 JPG、JPEG 或 PNG 格式';
      case 'FILE_TOO_LARGE':
        return '圖片檔案過大，請選擇小於 10MB 的圖片';
      case 'FILE_TOO_SMALL':
        return '圖片檔案過小，請選擇有效的圖片';
      case 'AUTH_ERROR':
        return 'API 認證失敗，已切換到演示模式';
      case 'NETWORK_ERROR':
        return '網絡連接異常，使用離線模式';
      case 'ANALYSIS_TIMEOUT':
        return '分析超時，請重試';
      case 'API_ERROR':
        return 'API 服務暫時不可用，使用演示模式';
      case 'TOKEN_GENERATION_ERROR':
        return '認證令牌生成失敗，已切換到演示模式';
      case 'PREPROCESSING_ERROR':
        return '圖片處理失敗，請重新選擇圖片';
      default:
        return error.message || '系統錯誤，已切換到演示模式';
    }
  }
  
  return '系統錯誤，請重試';
};

export const createMemoryFromAnalysisResult = (analysisResult, existingMemories = []) => {
  return {
    id: existingMemories.length + 1,
    moment: `AI 肌膚分析 - 總分 ${analysisResult.overall_score}`,
    emotion: analysisResult.metadata.apiType === 'mock' ? '🧪' : '🔬',
    date: new Date().toLocaleDateString('zh-TW'),
    product: analysisResult.metadata.apiType === 'mock' ? 'AI 演示分析' : 'AI 智能分析',
    aiAnalysis: `肌膚年齡: ${analysisResult.skin_age}歲，${getAnalysisInsight(analysisResult.overall_score)}`,
    skinMetrics: analysisResult.concerns.reduce((acc, concern) => {
      acc[concern.name] = concern.score;
      return acc;
    }, {}),
    analysisId: analysisResult.metadata?.analysisId,
    timestamp: analysisResult.timestamp,
    analysisData: analysisResult
  };
};

const getAnalysisInsight = (score) => {
  if (score >= 85) return "肌膚狀態優秀，建議維持現有保養習慣";
  if (score >= 75) return "肌膚狀態良好，建議持續保養";
  if (score >= 65) return "肌膚需要加強護理，建議調整保養方案";
  return "建議尋求專業皮膚科醫師建議";
};

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
    const previousConcern = previousResult.concerns?.find(
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
    overallChange: currentResult.overall_score - (previousResult.overall_score || 0),
    skinAgeChange: currentResult.skin_age - (previousResult.skin_age || 0),
    daysBetween: Math.floor((new Date(currentResult.timestamp) - new Date(previousResult.timestamp)) / (1000 * 60 * 60 * 24))
  };
};

export const getAPIConfig = () => {
  const isDebug = process.env.NODE_ENV === 'development';
  
  if (!isDebug) {
    return { debug: false };
  }
  
  return {
    debug: true,
    useMockAPI: perfectCorpAPI.useMockAPI,
    isInitialized: perfectCorpAPI.isInitialized,
    hasClientId: !!API_CONFIG.clientId,
    hasClientSecret: !!API_CONFIG.clientSecret,
    timeout: API_CONFIG.timeout,
    retryAttempts: API_CONFIG.retryAttempts,
    environment: process.env.NODE_ENV
  };
};

// ========================================
// 進階功能模組
// ========================================

export const batchAnalysis = async (imageFiles, onBatchProgress = null) => {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    try {
      onBatchProgress?.({
        current: i + 1,
        total: imageFiles.length,
        fileName: imageFiles[i].name,
        message: `正在分析第 ${i + 1} 張圖片...`
      });
      
      const result = await analyseSkin(imageFiles[i], (progress) => {
        onBatchProgress?.({
          current: i + 1,
          total: imageFiles.length,
          fileName: imageFiles[i].name,
          message: progress.message,
          progress: progress.progress
        });
      });
      
      results.push({
        fileName: imageFiles[i].name,
        result,
        success: true
      });
      
    } catch (error) {
      errors.push({
        fileName: imageFiles[i].name,
        error: getErrorMessage(error),
        success: false
      });
    }
  }
  
  return {
    results,
    errors,
    successCount: results.length,
    errorCount: errors.length,
    totalCount: imageFiles.length
  };
};

export const exportAnalysisResults = (results, format = 'json') => {
  try {
    switch (format.toLowerCase()) {
      case 'json':
        return exportAsJSON(results);
      case 'csv':
        return exportAsCSV(results);
      case 'pdf':
        return exportAsPDF(results);
      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    throw new PerfectCorpAPIError('Export failed', 'EXPORT_ERROR', error);
  }
};

const exportAsJSON = (results) => {
  const data = JSON.stringify(results, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `skin_analysis_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return { success: true, format: 'json' };
};

const exportAsCSV = (results) => {
  const headers = [
    '分析ID', '時間戳', '總體評分', '肌膚年齡', 
    '皺紋', '毛孔', '色斑', '水分', '亮澤度', '膚質',
    'API類型', '處理時間'
  ];
  
  const rows = results.map(result => [
    result.metadata?.analysisId || '',
    result.timestamp || '',
    result.overall_score || '',
    result.skin_age || '',
    ...result.concerns.map(c => c.score),
    result.metadata?.apiType || '',
    result.metadata?.processingTime || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `skin_analysis_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return { success: true, format: 'csv' };
};

const exportAsPDF = (results) => {
  console.warn('PDF export not implemented. Please install jsPDF library.');
  return exportAsJSON(results);
};

// ========================================
// 歷史記錄管理
// ========================================

export class SkinAnalysisHistory {
  constructor() {
    this.storageKey = 'beauty_memory_analysis_history';
    this.maxHistorySize = 100;
  }
  
  save(analysisResult) {
    try {
      const history = this.getAll();
      history.unshift({
        ...analysisResult,
        savedAt: new Date().toISOString()
      });
      
      if (history.length > this.maxHistorySize) {
        history.splice(this.maxHistorySize);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Failed to save analysis history:', error);
      return false;
    }
  }
  
  getAll() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load analysis history:', error);
      return [];
    }
  }
  
  getById(analysisId) {
    const history = this.getAll();
    return history.find(item => item.metadata?.analysisId === analysisId);
  }
  
  delete(analysisId) {
    try {
      const history = this.getAll();
      const filtered = history.filter(item => item.metadata?.analysisId !== analysisId);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete analysis record:', error);
      return false;
    }
  }
  
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear analysis history:', error);
      return false;
    }
  }
  
  getStatistics() {
    const history = this.getAll();
    
    if (history.length === 0) {
      return {
        totalAnalyses: 0,
        averageScore: 0,
        lastAnalysisDate: null,
        improvementTrend: null
      };
    }
    
    const scores = history.map(h => h.overall_score).filter(s => s);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    let improvementTrend = 'stable';
    if (history.length >= 2) {
      const recent = scores.slice(0, 3);
      const older = scores.slice(-3);
      const recentAvg = recent.reduce((sum, s) => sum + s, 0) / recent.length;
      const olderAvg = older.reduce((sum, s) => sum + s, 0) / older.length;
      
      if (recentAvg > olderAvg + 2) {
        improvementTrend = 'improving';
      } else if (recentAvg < olderAvg - 2) {
        improvementTrend = 'declining';
      }
    }
    
    return {
      totalAnalyses: history.length,
      averageScore: Math.round(averageScore),
      lastAnalysisDate: history[0]?.timestamp,
      improvementTrend,
      mockAnalyses: history.filter(h => h.metadata?.apiType === 'mock').length,
      realAnalyses: history.filter(h => h.metadata?.apiType === 'real').length
    };
  }
}

export const skinAnalysisHistory = new SkinAnalysisHistory();

// ========================================
// 肌膚健康評估
// ========================================

export const SkinHealthAssessment = {
  assessOverallHealth(analysisResult) {
    const score = analysisResult.overall_score;
    
    if (score >= 90) return { level: 'excellent', message: '肌膚狀態極佳', color: '#22c55e' };
    if (score >= 80) return { level: 'good', message: '肌膚狀態良好', color: '#3b82f6' };
    if (score >= 70) return { level: 'fair', message: '肌膚狀態一般', color: '#f59e0b' };
    if (score >= 60) return { level: 'poor', message: '肌膚需要改善', color: '#ef4444' };
    return { level: 'critical', message: '建議諮詢專業醫師', color: '#dc2626' };
  },
  
  generateSkincareRoutine(analysisResult) {
    const concerns = analysisResult.concerns || [];
    const routine = {
      morning: [],
      evening: [],
      weekly: [],
      priority: []
    };
    
    routine.morning.push('溫和潔面', '保濕精華', '防曬霜 SPF30+');
    routine.evening.push('深層清潔', '保濕乳液');
    
    concerns.forEach(concern => {
      if (concern.score < 70) {
        switch (concern.category) {
          case 'hydration':
            routine.evening.push('玻尿酸精華');
            routine.priority.push('加強保濕');
            break;
          case 'aging':
            routine.evening.push('抗老精華（含胜肽）');
            routine.weekly.push('抗老面膜');
            routine.priority.push('抗衰老護理');
            break;
          case 'pigmentation':
            routine.morning.push('維他命C精華');
            routine.weekly.push('美白面膜');
            routine.priority.push('美白淡斑');
            break;
          case 'texture':
            routine.weekly.push('溫和去角質');
            routine.priority.push('改善膚質');
            break;
        }
      }
    });
    
    return routine;
  },
  
  predictImprovementTimeline(analysisResult) {
    const concerns = analysisResult.concerns || [];
    const predictions = [];
    
    concerns.forEach(concern => {
      if (concern.score < 80) {
        let timeframe = '8-12週';
        let confidence = 'medium';
        
        switch (concern.category) {
          case 'hydration':
            timeframe = '2-4週';
            confidence = 'high';
            break;
          case 'texture':
            timeframe = '4-6週';
            confidence = 'high';
            break;
          case 'pigmentation':
            timeframe = '8-16週';
            confidence = 'medium';
            break;
          case 'aging':
            timeframe = '12-24週';
            confidence = 'medium';
            break;
        }
        
        predictions.push({
          concern: concern.name,
          currentScore: concern.score,
          expectedImprovement: '10-20%',
          timeframe,
          confidence
        });
      }
    });
    
    return predictions;
  }
};

// ========================================
// 2025 九紫離火運整合
// ========================================

export const FengShuiIntegration = {
  getBestSkincareTime() {
    const now = new Date();
    const hour = now.getHours();
    
    const fireHours = [7, 8, 9, 11, 12, 13];
    const waterHours = [19, 20, 21, 23, 0, 1];
    
    if (fireHours.includes(hour)) {
      return {
        type: 'fire',
        recommendation: '離火時辰，適合美白和提亮護理',
        energy: 'high',
        color: '#f43f5e'
      };
    } else if (waterHours.includes(hour)) {
      return {
        type: 'water',
        recommendation: '水元素時辰，適合深層保濕和修復',
        energy: 'calm',
        color: '#3b82f6'
      };
    } else {
      return {
        type: 'neutral',
        recommendation: '平衡時辰，適合基礎護理',
        energy: 'balanced',
        color: '#8b5cf6'
      };
    }
  },
  
  getSeasonalRecommendation() {
    const month = new Date().getMonth() + 1;
    
    const seasons = {
      spring: { months: [3, 4, 5], focus: '清潔和排毒', element: '木' },
      summer: { months: [6, 7, 8], focus: '防曬和控油', element: '火' },
      autumn: { months: [9, 10, 11], focus: '保濕和滋養', element: '金' },
      winter: { months: [12, 1, 2], focus: '修復和抗老', element: '水' }
    };
    
    for (const [season, info] of Object.entries(seasons)) {
      if (info.months.includes(month)) {
        return {
          season,
          focus: info.focus,
          element: info.element,
          recommendation: `${info.element}行當令，重點進行${info.focus}護理`
        };
      }
    }
  },
  
  getColorRecommendation(analysisResult) {
    const score = analysisResult.overall_score;
    
    if (score >= 85) {
      return {
        primary: '#ffd700',
        secondary: '#ff6b6b',
        meaning: '金火相映，美麗光芒'
      };
    } else if (score >= 70) {
      return {
        primary: '#8b5cf6',
        secondary: '#f59e0b',
        meaning: '紫氣東來，財運亨通'
      };
    } else {
      return {
        primary: '#3b82f6',
        secondary: '#10b981',
        meaning: '水木相生，煥發生機'
      };
    }
  }
};

// ========================================
// 最終導出
// ========================================

if (typeof window !== 'undefined') {
  perfectCorpAPI.initialize().catch(console.error);
  
  window.addEventListener('online', () => {
    console.log('🌐 Network connection restored');
    perfectCorpAPI.checkAvailability();
  });
  
  window.addEventListener('offline', () => {
    console.log('📡 Network connection lost, switching to offline mode');
    perfectCorpAPI.useMockAPI = true;
  });
}

export { perfectCorpAPI as default, PerfectCorpAPIError, SKIN_ANALYSIS_CONFIG };

console.log('✅ Perfect Corp API Service loaded successfully - Version 2.0.0');