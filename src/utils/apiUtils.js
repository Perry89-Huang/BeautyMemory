/**
 * API 工具函數 - 更新版本
 * 配合完整的 Perfect Corp API 服務
 */

import perfectCorpAPI, { 
  analyseSkin,
  checkAPIAvailability,
  getUserQuota,
  testAPIConnection,
  preprocessImage,
  getErrorMessage,
  createMemoryFromAnalysisResult,
  compareAnalysisResults,
  batchAnalysis,
  exportAnalysisResults,
  skinAnalysisHistory,
  SkinHealthAssessment,
  FengShuiIntegration,
  PerfectCorpAPIError
} from '../services/perfectCorpAPI';

/**
 * 統一的肌膚分析介面
 */
export const performSkinAnalysis = async (imageFile, onProgress = null) => {
  try {
    // 使用完整的 Perfect Corp API 服務
    return await analyseSkin(imageFile, onProgress);
  } catch (error) {
    console.error('Skin analysis failed:', error);
    throw error;
  }
};

/**
 * 批量肌膚分析
 */
export const performBatchAnalysis = async (imageFiles, onBatchProgress = null) => {
  try {
    return await batchAnalysis(imageFiles, onBatchProgress);
  } catch (error) {
    console.error('Batch analysis failed:', error);
    throw error;
  }
};

/**
 * 導出分析結果
 */
export const exportResults = async (results, format = 'json') => {
  try {
    return await exportAnalysisResults(results, format);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

/**
 * 獲取肌膚健康評估
 */
export const getSkinHealthAssessment = (analysisResult) => {
  try {
    return {
      health: SkinHealthAssessment.assessOverallHealth(analysisResult),
      routine: SkinHealthAssessment.generateSkincareRoutine(analysisResult),
      timeline: SkinHealthAssessment.predictImprovementTimeline(analysisResult)
    };
  } catch (error) {
    console.error('Health assessment failed:', error);
    return null;
  }
};

/**
 * 獲取風水建議
 */
export const getFengShuiRecommendations = (analysisResult = null) => {
  try {
    return {
      timing: FengShuiIntegration.getBestSkincareTime(),
      seasonal: FengShuiIntegration.getSeasonalRecommendation(),
      colors: analysisResult ? FengShuiIntegration.getColorRecommendation(analysisResult) : null
    };
  } catch (error) {
    console.error('FengShui recommendations failed:', error);
    return null;
  }
};

/**
 * 管理分析歷史
 */
export const HistoryManager = {
  save: (analysisResult) => skinAnalysisHistory.save(analysisResult),
  getAll: () => skinAnalysisHistory.getAll(),
  getById: (id) => skinAnalysisHistory.getById(id),
  delete: (id) => skinAnalysisHistory.delete(id),
  clear: () => skinAnalysisHistory.clear(),
  getStats: () => skinAnalysisHistory.getStatistics()
};

/**
 * 創建美麗記憶條目
 */
export const createBeautyMemory = (analysisResult, existingMemories = []) => {
  try {
    return createMemoryFromAnalysisResult(analysisResult, existingMemories);
  } catch (error) {
    console.error('Failed to create beauty memory:', error);
    throw error;
  }
};

/**
 * 計算美麗趨勢
 */
export const calculateBeautyTrend = (memories) => {
  try {
    if (memories.length < 2) {
      return {
        trend: 'insufficient_data',
        message: '需要更多分析數據來計算趨勢',
        direction: 'neutral'
      };
    }

    const recentScores = memories
      .slice(0, 5)
      .map(memory => {
        if (memory.analysisData?.overall_score) {
          return memory.analysisData.overall_score;
        }
        const metrics = Object.values(memory.skinMetrics || {});
        return metrics.length > 0 ? metrics.reduce((sum, score) => sum + score, 0) / metrics.length : 0;
      })
      .filter(score => score > 0);

    if (recentScores.length < 2) {
      return {
        trend: 'insufficient_data',
        message: '需要更多有效分析數據',
        direction: 'neutral'
      };
    }

    const firstScore = recentScores[recentScores.length - 1];
    const lastScore = recentScores[0];
    const difference = lastScore - firstScore;

    let trend, message, direction;

    if (difference > 5) {
      trend = 'improving';
      direction = 'up';
      message = `肌膚狀態持續改善，提升了 ${difference.toFixed(1)} 分`;
    } else if (difference < -5) {
      trend = 'declining';
      direction = 'down';
      message = `肌膚狀態需要關注，下降了 ${Math.abs(difference).toFixed(1)} 分`;
    } else {
      trend = 'stable';
      direction = 'neutral';
      message = '肌膚狀態保持穩定';
    }

    return {
      trend,
      message,
      direction,
      changeValue: difference,
      averageScore: recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length,
      dataPoints: recentScores.length
    };
  } catch (error) {
    console.error('Failed to calculate beauty trend:', error);
    return {
      trend: 'error',
      message: '計算趨勢時發生錯誤',
      direction: 'neutral'
    };
  }
};

/**
 * 獲取今日護膚建議
 */
export const getTodaySkincareAdvice = (userProfile = {}) => {
  try {
    const fengShui = getFengShuiRecommendations();
    const now = new Date();
    const hour = now.getHours();
    
    let timeAdvice = '';
    if (hour >= 6 && hour < 12) {
      timeAdvice = '晨間護膚重點：清潔、保濕、防曬';
    } else if (hour >= 12 && hour < 18) {
      timeAdvice = '午間護膚重點：補水、防曬補強';
    } else if (hour >= 18 && hour < 22) {
      timeAdvice = '晚間護膚重點：深層清潔、修復保養';
    } else {
      timeAdvice = '夜間護膚重點：密集修復、抗老護理';
    }

    return {
      timeAdvice,
      fengShuiTiming: fengShui?.timing,
      seasonalFocus: fengShui?.seasonal,
      recommendedProducts: getRecommendedProducts(hour, userProfile)
    };
  } catch (error) {
    console.error('Failed to get today skincare advice:', error);
    return null;
  }
};

/**
 * 根據時間和用戶資料推薦產品
 */
const getRecommendedProducts = (hour, userProfile) => {
  const products = [];
  
  if (hour >= 6 && hour < 12) {
    products.push('溫和洗面乳', '保濕精華', '防曬霜 SPF30+');
  } else if (hour >= 18 && hour < 22) {
    products.push('深層清潔', '修復精華', '晚霜');
    
    if (userProfile.skinType === 'dry') {
      products.push('滋潤面膜');
    } else if (userProfile.skinType === 'oily') {
      products.push('控油精華');
    }
  }
  
  return products;
};

/**
 * 智能護膚計劃生成器
 */
export const generateSmartSkincareRoutine = (analysisResults, userPreferences = {}) => {
  try {
    if (!analysisResults || analysisResults.length === 0) {
      return getBasicSkincareRoutine();
    }

    const latestResult = analysisResults[0];
    const healthAssessment = getSkinHealthAssessment(latestResult);
    const fengShui = getFengShuiRecommendations(latestResult);
    const trend = calculateBeautyTrend(analysisResults);

    return {
      basic: healthAssessment?.routine || getBasicSkincareRoutine(),
      personalized: getPersonalizedRoutine(latestResult, userPreferences),
      fengShuiOptimized: getFengShuiOptimizedRoutine(fengShui),
      trendBased: getTrendBasedAdjustments(trend),
      timeline: healthAssessment?.timeline || []
    };
  } catch (error) {
    console.error('Failed to generate smart skincare routine:', error);
    return getBasicSkincareRoutine();
  }
};

const getBasicSkincareRoutine = () => ({
  morning: ['溫和潔面', '保濕精華', '防曬霜'],
  evening: ['深層清潔', '保濕乳液'],
  weekly: ['溫和去角質'],
  priority: ['基礎保濕', '防曬保護']
});

const getPersonalizedRoutine = (analysisResult, preferences) => {
  const routine = getBasicSkincareRoutine();
  
  // 根據分析結果調整
  analysisResult.concerns?.forEach(concern => {
    if (concern.score < 70) {
      switch (concern.category) {
        case 'hydration':
          routine.evening.push('玻尿酸精華');
          break;
        case 'aging':
          routine.evening.push('抗老精華');
          break;
        case 'pigmentation':
          routine.morning.push('維他命C精華');
          break;
      }
    }
  });
  
  // 根據用戶偏好調整
  if (preferences.minimalist) {
    routine.morning = routine.morning.slice(0, 3);
    routine.evening = routine.evening.slice(0, 3);
  }
  
  return routine;
};

const getFengShuiOptimizedRoutine = (fengShui) => {
  if (!fengShui) return {};
  
  return {
    bestTime: fengShui.timing?.recommendation || '任何時間都適合基礎護理',
    seasonalFocus: fengShui.seasonal?.recommendation || '保持均衡護理',
    luckyColors: fengShui.colors || null
  };
};

const getTrendBasedAdjustments = (trend) => {
  if (!trend) return {};
  
  const adjustments = [];
  
  if (trend.direction === 'down') {
    adjustments.push('加強修復護理');
    adjustments.push('增加營養精華使用頻率');
  } else if (trend.direction === 'up') {
    adjustments.push('維持現有護理習慣');
    adjustments.push('可嘗試新的進階護理');
  }
  
  return {
    message: trend.message,
    adjustments
  };
};

/**
 * 分析結果增強處理
 */
export const enhanceAnalysisResult = (result, previousResults = []) => {
  try {
    const enhanced = { ...result };
    
    // 添加比較數據
    if (previousResults.length > 0) {
      enhanced.comparison = compareAnalysisResults(result, previousResults[0]);
    }
    
    // 添加健康評估
    enhanced.healthAssessment = getSkinHealthAssessment(result);
    
    // 添加風水建議
    enhanced.fengShuiAdvice = getFengShuiRecommendations(result);
    
    // 添加趨勢分析
    if (previousResults.length > 0) {
      const allResults = [result, ...previousResults];
      enhanced.trend = calculateBeautyTrend(allResults.map(r => ({
        analysisData: r,
        skinMetrics: r.concerns?.reduce((acc, c) => {
          acc[c.name] = c.score;
          return acc;
        }, {}) || {}
      })));
    }
    
    // 添加個性化建議
    enhanced.personalizedAdvice = generatePersonalizedAdvice(result);
    
    return enhanced;
  } catch (error) {
    console.error('Failed to enhance analysis result:', error);
    return result;
  }
};

const generatePersonalizedAdvice = (result) => {
  const advice = [];
  const score = result.overall_score;
  
  if (score >= 85) {
    advice.push('🎉 您的肌膚狀態優秀！繼續保持現有的護理習慣');
    advice.push('💎 可以嘗試一些進階的美容護理來維持最佳狀態');
  } else if (score >= 70) {
    advice.push('😊 您的肌膚狀態良好，建議針對性改善');
    advice.push('📈 堅持護理，很快就能看到更好的效果');
  } else {
    advice.push('💪 肌膚需要加強護理，建議制定系統性的改善計劃');
    advice.push('🔬 考慮諮詢專業皮膚科醫師獲得更精準的建議');
  }
  
  return advice;
};

// 導出所有工具函數
export {
  // 原有的導出
  preprocessImage,
  getErrorMessage,
  checkAPIAvailability,
  getUserQuota,
  testAPIConnection,
  compareAnalysisResults,
  PerfectCorpAPIError,
  
  // Perfect Corp API 實例
  perfectCorpAPI as default
};