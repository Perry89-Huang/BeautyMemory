// === Mock Data Generation Utilities ===

/**
 * Generates mock skin analysis result
 * Simulates Perfect Corp API response structure
 */
export const generateMockAnalysisResult = () => {
  const baseScore = Math.floor(Math.random() * 20) + 70; // 70-90 range
  
  return {
    overall_score: baseScore,
    skin_age: Math.floor(Math.random() * 10) + 25, // 25-35 range
    timestamp: new Date().toISOString(),
    
    concerns: [
      {
        name: "皺紋",
        score: Math.floor(Math.random() * 30) + 70,
        status: getScoreStatus(Math.floor(Math.random() * 30) + 70),
        improvement: generateImprovement(),
        category: "aging",
        details: {
          forehead: Math.floor(Math.random() * 20) + 70,
          crowfeet: Math.floor(Math.random() * 20) + 75,
          nasolabial: Math.floor(Math.random() * 25) + 65
        }
      },
      {
        name: "毛孔",
        score: Math.floor(Math.random() * 30) + 60,
        status: getScoreStatus(Math.floor(Math.random() * 30) + 60),
        improvement: generateImprovement(),
        category: "texture",
        details: {
          nose: Math.floor(Math.random() * 30) + 40,
          cheek: Math.floor(Math.random() * 25) + 60,
          forehead: Math.floor(Math.random() * 20) + 70
        }
      },
      {
        name: "色斑",
        score: Math.floor(Math.random() * 20) + 80,
        status: getScoreStatus(Math.floor(Math.random() * 20) + 80),
        improvement: generateImprovement(),
        category: "pigmentation"
      },
      {
        name: "水分",
        score: Math.floor(Math.random() * 25) + 60,
        status: getScoreStatus(Math.floor(Math.random() * 25) + 60),
        improvement: generateImprovement(),
        category: "hydration"
      },
      {
        name: "亮澤度",
        score: Math.floor(Math.random() * 15) + 85,
        status: getScoreStatus(Math.floor(Math.random() * 15) + 85),
        improvement: generateImprovement(),
        category: "radiance"
      },
      {
        name: "膚質",
        score: Math.floor(Math.random() * 25) + 70,
        status: getScoreStatus(Math.floor(Math.random() * 25) + 70),
        improvement: generateImprovement(),
        category: "texture"
      }
    ],
    
    recommendations: generateRecommendations(),
    
    metadata: {
      analysisId: generateAnalysisId(),
      processingTime: Math.floor(Math.random() * 3000) + 2000, // 2-5 seconds
      imageQuality: "good",
      faceDetected: true,
      lightingCondition: "optimal"
    }
  };
};

/**
 * Determines status based on score
 */
const getScoreStatus = (score) => {
  if (score >= 85) return "優秀";
  if (score >= 70) return "良好";
  return "需改善";
};

/**
 * Generates random improvement percentage
 */
const generateImprovement = () => {
  const isPositive = Math.random() > 0.3; // 70% chance of positive improvement
  const value = Math.floor(Math.random() * 15) + 1;
  return isPositive ? `+${value}%` : `-${value}%`;
};

/**
 * Generates personalized recommendations based on skin analysis
 */
const generateRecommendations = () => {
  const recommendations = [
    "建議加強保濕護理，使用含玻尿酸成分的精華液",
    "定期使用溫和去角質產品，改善肌膚紋理",
    "使用含維他命C的精華，提升肌膚亮澤度",
    "加強防曬保護，預防色斑形成",
    "建議使用含胜肽成分的抗老精華",
    "保持充足睡眠，有助肌膚自我修復",
    "多攝取抗氧化食物，由內而外改善膚質",
    "使用含煙醯胺成分的產品，改善毛孔問題"
  ];
  
  // Randomly select 3-4 recommendations
  const shuffled = recommendations.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 3);
};

/**
 * Generates unique analysis ID
 */
const generateAnalysisId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BM_${timestamp}_${random}`;
};

/**
 * Creates a new memory entry from analysis result
 */
export const createMemoryFromAnalysis = (analysisResult, memories) => {
  return {
    id: memories.length + 1,
    moment: `AI 肌膚分析 - 總分 ${analysisResult.overall_score}`,
    emotion: "🔬",
    date: new Date().toLocaleDateString('zh-TW'),
    product: "AI 智能分析",
    aiAnalysis: `肌膚年齡: ${analysisResult.skin_age}歲，${getAnalysisInsight(analysisResult.overall_score)}`,
    skinMetrics: analysisResult.concerns.reduce((acc, concern) => {
      acc[concern.name] = concern.score;
      return acc;
    }, {}),
    analysisId: analysisResult.metadata?.analysisId,
    timestamp: analysisResult.timestamp
  };
};

/**
 * Generates analysis insight based on overall score
 */
const getAnalysisInsight = (score) => {
  if (score >= 85) return "肌膚狀態優秀，建議維持現有保養習慣";
  if (score >= 75) return "肌膚狀態良好，建議持續保養";
  if (score >= 65) return "肌膚需要加強護理，建議調整保養方案";
  return "建議尋求專業皮膚科醫師建議";
};

/**
 * Simulates API delay for realistic user experience
 */
export const simulateAPIDelay = (minMs = 2000, maxMs = 5000) => {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Validates uploaded image file
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  const errors = [];
  
  if (!validTypes.includes(file.type)) {
    errors.push('請上傳 JPG、JPEG 或 PNG 格式的圖片');
  }
  
  if (file.size > maxSize) {
    errors.push('圖片大小不能超過 10MB');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formats date for display
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
};

/**
 * Calculates skin improvement trend
 */
export const calculateSkinTrend = (memories) => {
  if (memories.length < 2) return null;
  
  const recent = memories.slice(0, 5); // Last 5 records
  const scores = recent
    .filter(memory => memory.skinMetrics)
    .map(memory => {
      const metrics = Object.values(memory.skinMetrics);
      return metrics.reduce((sum, score) => sum + score, 0) / metrics.length;
    });
  
  if (scores.length < 2) return null;
  
  const trend = scores[0] - scores[scores.length - 1];
  
  return {
    direction: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable',
    percentage: Math.abs(trend).toFixed(1),
    message: trend > 0 
      ? `肌膚狀態持續改善，提升了 ${Math.abs(trend).toFixed(1)}%`
      : trend < 0 
        ? `需要調整保養方案，建議加強護理`
        : `肌膚狀態保持穩定`
  };
};