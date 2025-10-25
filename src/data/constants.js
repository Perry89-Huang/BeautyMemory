import React from 'react';
// 使用 react-icons 替換 lucide-react
import { 
  BiScan, 
  BiData, 
  BiCamera, 
  BiDroplet, 
  BiSun, 
  BiBarChart, 
  BiUpload, 
  BiBrain,
  BiTrendingUp,
  BiHistory,
  BiDownload
} from 'react-icons/bi';

import { 
  FiDatabase, 
  FiCamera, 
  FiZap, 
  FiEye, 
  FiDroplet, 
  FiSun, 
  FiBarChart, 
  FiUpload,
  FiCalendar,
  FiStar,
  FiUsers,
  FiAward
} from 'react-icons/fi';

import { 
  AiOutlineScan,
  AiOutlineBarChart,
  AiOutlineEye,
  AiOutlineDatabase,
  AiOutlineThunderbolt,
  AiOutlineHeart,
  AiOutlineCrown
} from 'react-icons/ai';

import { 
  RiSparklingFill,
  RiBrainFill,
  RiMagicFill,
  RiFlowerFill
} from 'react-icons/ri';

// === 增強版系統功能配置 ===
export const SYSTEM_FEATURES = [
  {
    icon: <BiScan className="w-8 h-8" />,
    title: "AI 即時肌膚掃描",
    subtitle: "Perfect Corp 14項專業檢測",
    description: "運用 Perfect Corp 專業技術，即時分析皺紋、毛孔、色斑、亮澤度等 14 項肌膚指標，95% 準確率媲美專業皮膚科醫師，提供醫師級分析報告。",
    gradient: "from-blue-400 to-cyan-400",
    details: [
      "即時肌膚狀態掃描",
      "14項專業肌膚分析", 
      "95%醫師級準確率",
      "個人化改善建議",
      "HD 高清檢測技術",
      "AI 智能評估系統"
    ],
    features: [
      { name: "皺紋檢測", accuracy: "95%" },
      { name: "毛孔分析", accuracy: "92%" },
      { name: "色斑檢測", accuracy: "94%" },
      { name: "水分測試", accuracy: "90%" }
    ]
  },
  {
    icon: <BiData className="w-8 h-8" />,
    title: "美麗記憶資料庫",
    subtitle: "智能化美麗成長記錄",
    description: "建立個人美麗成長歷程，AI 智能記錄每次護膚的細微變化，形成專屬的美麗記憶庫，追蹤美麗蛻變軌跡。",
    gradient: "from-purple-400 to-indigo-400",
    details: [
      "美麗歷程完整記錄",
      "護膚效果數據分析",
      "個人偏好學習記憶", 
      "美容習慣智能優化",
      "趨勢變化可視化",
      "歷史對比分析"
    ],
    features: [
      { name: "數據保存", capacity: "無限制" },
      { name: "智能分析", level: "深度學習" },
      { name: "趨勢預測", accuracy: "88%" },
      { name: "個性化建議", coverage: "全方位" }
    ]
  },
  {
    icon: <BiCamera className="w-8 h-8" />,
    title: "智能記憶捕捉",
    subtitle: "高精度影像識別技術",
    description: "採用先進的 AI 影像識別技術，自動捕捉並分析美麗變化，智能標記重要時刻，讓每個進步都成為珍貴記憶。",
    gradient: "from-pink-400 to-rose-400",
    details: [
      "高清肌膚影像記錄",
      "自動美麗變化檢測",
      "時間軸美麗對比",
      "成果分享與慶祝",
      "智能標籤系統",
      "多角度拍攝建議"
    ],
    features: [
      { name: "影像品質", resolution: "2K+" },
      { name: "識別精度", accuracy: "96%" },
      { name: "處理速度", time: "< 3秒" },
      { name: "存儲格式", type: "高清無損" }
    ]
  },
  {
    icon: <FiZap className="w-8 h-8" />,
    title: "AI 智能提醒系統",
    subtitle: "個性化護膚時程管理",
    description: "基於您的生活節奏、肌膚週期和 2025 九紫離火運風水時機，智能提醒最佳護膚時機，讓美麗成為自然習慣。",
    gradient: "from-amber-400 to-orange-400",
    details: [
      "個人化護膚時程表",
      "生理週期美容提醒",
      "環境因子護膚建議",
      "習慣養成智能助手",
      "九紫離火運時機提醒",
      "季節性護理調整"
    ],
    features: [
      { name: "智能提醒", frequency: "多頻次" },
      { name: "個性化", level: "深度定制" },
      { name: "風水整合", coverage: "全面" },
      { name: "習慣追蹤", accuracy: "精準" }
    ]
  }
];

// === 增強版肌膚分析功能 ===
export const SKIN_ANALYSIS_FEATURES = [
  { name: "皺紋檢測", icon: <FiEye className="w-5 h-5" />, color: "text-purple-600", category: "aging" },
  { name: "毛孔分析", icon: <BiScan className="w-5 h-5" />, color: "text-blue-600", category: "texture" },
  { name: "色斑檢測", icon: <BiSun className="w-5 h-5" />, color: "text-amber-600", category: "pigmentation" },
  { name: "水分測試", icon: <BiDroplet className="w-5 h-5" />, color: "text-cyan-600", category: "hydration" },
  { name: "膚質分析", icon: <BiBarChart className="w-5 h-5" />, color: "text-green-600", category: "texture" },
  { name: "亮澤度", icon: <RiSparklingFill className="w-5 h-5" />, color: "text-pink-600", category: "radiance" },
  { name: "緊緻度", icon: <AiOutlineThunderbolt className="w-5 h-5" />, color: "text-indigo-600", category: "firmness" },
  { name: "黑眼圈", icon: <AiOutlineEye className="w-5 h-5" />, color: "text-gray-600", category: "eye_area" },
  { name: "眼袋檢測", icon: <FiEye className="w-5 h-5" />, color: "text-slate-600", category: "eye_area" },
  { name: "泛紅分析", icon: <AiOutlineHeart className="w-5 h-5" />, color: "text-red-500", category: "sensitivity" },
  { name: "出油檢測", icon: <BiDroplet className="w-5 h-5" />, color: "text-yellow-600", category: "oiliness" },
  { name: "痘痘分析", icon: <BiScan className="w-5 h-5" />, color: "text-orange-600", category: "blemish" },
  { name: "膚色均勻度", icon: <RiSparklingFill className="w-5 h-5" />, color: "text-violet-600", category: "evenness" },
  { name: "肌膚年齡", icon: <FiCalendar className="w-5 h-5" />, color: "text-emerald-600", category: "age" }
];

// === 增強版分析步驟配置 ===
export const ANALYSIS_STEPS = [
  {
    step: "01",
    title: "上傳照片",
    description: "上傳清晰的臉部照片，確保光線充足，最佳效果請在自然光下拍攝",
    icon: <FiUpload className="w-8 h-8" />,
    action: "選擇照片",
    tips: [
      "使用自然光拍攝",
      "保持臉部清潔",
      "正面角度最佳",
      "避免強烈陰影"
    ],
    requirements: {
      format: "JPG, PNG",
      size: "< 10MB",
      resolution: "≥ 480x480"
    }
  },
  {
    step: "02", 
    title: "AI 分析中",
    description: "Perfect Corp AI 引擎進行 14 項專業檢測，採用醫師級分析標準",
    icon: <RiBrainFill className="w-8 h-8" />,
    action: "分析中...",
    process: [
      "圖像預處理",
      "臉部特徵識別", 
      "肌膚區域分割",
      "多維度數據分析"
    ],
    technology: "Perfect Corp AgileFace® 技術"
  },
  {
    step: "03",
    title: "生成報告",
    description: "獲得專業肌膚分析報告、個性化改善建議與風水時機推薦",
    icon: <AiOutlineBarChart className="w-8 h-8" />,
    action: "查看報告",
    includes: [
      "14項專業評分",
      "肌膚年齡評估",
      "個性化建議",
      "風水時機指導"
    ],
    accuracy: "95% 醫師級準確率"
  },
  {
    step: "04",
    title: "記憶儲存", 
    description: "將分析結果加入您的美麗記憶庫，建立個人美麗成長檔案",
    icon: <AiOutlineDatabase className="w-8 h-8" />,
    action: "保存記憶",
    benefits: [
      "歷史趨勢追蹤",
      "效果對比分析",
      "智能提醒設置",
      "個性化護理計劃"
    ],
    storage: "雲端安全存儲"
  }
];

// === 增強版初始演示數據 ===
export const INITIAL_MEMORIES = [
  { 
    id: 1, 
    moment: "肌膚水分提升 15%", 
    emotion: "💧", 
    date: "2025.01.15",
    product: "蓮花精華露",
    aiAnalysis: "AI 分析：肌膚狀態顯著改善，水分充足度達到優秀等級",
    skinMetrics: { 
      水分: 85, 
      亮澤度: 78, 
      緊緻度: 82,
      膚質: 80,
      整體評分: 81
    },
    tags: ["保濕", "改善", "晨間護理"],
    fengShuiAdvice: "水行旺盛，適合深層保濕",
    improvement: "+15%",
    analysisType: "mock"
  },
  { 
    id: 2, 
    moment: "細紋減少 8 條", 
    emotion: "✨", 
    date: "2025.01.20",
    product: "野山蘿蔔精華",
    aiAnalysis: "AI 建議：抗老效果顯著，建議持續使用以達最佳效果",
    skinMetrics: { 
      皺紋: 92, 
      膚質: 88, 
      亮澤度: 85,
      緊緻度: 89,
      整體評分: 88
    },
    tags: ["抗老", "精華", "夜間護理"],
    fengShuiAdvice: "金運旺盛，宜進行修復護理",
    improvement: "+12%",
    analysisType: "professional"
  },
  { 
    id: 3, 
    moment: "膚色亮度提升 2 階", 
    emotion: "🌟", 
    date: "2025.01.25",
    product: "美白保濕霜",
    aiAnalysis: "AI 預測：持續護理 4 週後可達到理想美白效果",
    skinMetrics: { 
      亮澤度: 91, 
      色斑: 87, 
      膚色均勻度: 89,
      水分: 86,
      整體評分: 88
    },
    tags: ["美白", "提亮", "日間護理"],
    fengShuiAdvice: "火元素活躍，適合亮白護理",
    improvement: "+18%",
    analysisType: "professional"
  },
];

// === 2025 九紫離火運配置 ===
export const FENG_SHUI_CONFIG = {
  theme: "九紫離火運",
  year: 2025,
  duration: "2024-2043",
  elements: {
    primary: "火",
    secondary: "土",
    colors: {
      fire: "#ff4757",
      earth: "#ffa726", 
      metal: "#ffd700",
      water: "#42a5f5",
      wood: "#66bb6a"
    }
  },
  bestTimes: {
    fire: [7, 8, 9, 11, 12, 13], // 辰時、巳時、午時
    water: [19, 20, 21, 23, 0, 1], // 戌時、亥時、子時
    earth: [14, 15, 16, 17, 18], // 未時、申時、酉時
    metal: [2, 3, 4, 5, 6], // 寅時、卯時、辰時
    wood: [9, 10, 11] // 巳時、午時
  },
  recommendations: {
    fire: "離火時辰，適合美白和提亮護理，能量充沛",
    water: "水元素時辰，適合深層保濕和修復，寧靜安撫", 
    earth: "土元素時辰，適合基礎護理和穩固保養",
    metal: "金元素時辰，適合緊緻和抗老護理",
    wood: "木元素時辰，適合清潔和排毒護理"
  }
};

// === 增強版應用配置 ===
export const APP_CONFIG = {
  brand: {
    name: "美魔力",
    englishName: "Beauty Memory",
    tagline: "Memory = 美魔力",
    description: "AI 智能肌膚分析系統",
    version: "2.0.0",
    slogan: "讓科技記住每個美麗瞬間"
  },
  technology: {
    provider: "Perfect Corp",
    accuracy: "95%",
    features: 14,
    patentTech: "AgileFace® 追蹤技術",
    apiVersion: "v1.0",
    certification: "醫師級認證"
  },
  features: {
    realTimeAnalysis: true,
    batchProcessing: true,
    historyTracking: true,
    fengShuiIntegration: true,
    exportFunctionality: true,
    multiLanguage: false,
    mobileOptimized: true,
    cloudStorage: true
  },
  pricing: {
    free: {
      name: "體驗版",
      analyses: 3,
      features: ["基礎分析", "簡單建議"]
    },
    premium: {
      name: "專業版", 
      analyses: 50,
      features: ["完整分析", "趨勢追蹤", "風水建議", "批量處理"]
    },
    enterprise: {
      name: "企業版",
      analyses: "unlimited",
      features: ["全功能", "API 接入", "定制化服務"]
    }
  },
  contact: {
    year: "2025",
    copyright: "美魔力 Beauty Memory • AI 智能肌膚分析系統",
    poweredBy: "Powered by Perfect Corp • Memory = 美魔力 • 讓科技記住每個美麗瞬間",
    email: "contact@beautymemory.com",
    website: "https://beautymemory.com"
  },
  social: {
    wechat: "BeautyMemory2025",
    weibo: "@美魔力AI",
    xiaohongshu: "美魔力護膚",
    douyin: "beautymemory"
  }
};

// === 護膚建議數據庫 ===
export const SKINCARE_RECOMMENDATIONS = {
  hydration: [
    "使用含玻尿酸成分的精華液",
    "每日補充足夠水分",
    "使用保濕面膜 2-3 次/週",
    "避免過度清潔"
  ],
  aging: [
    "使用含胜肽成分的抗老精華",
    "規律使用維他命 A 產品",
    "加強防曬保護",
    "保持充足睡眠"
  ],
  pigmentation: [
    "使用含維他命 C 的美白精華",
    "定期進行溫和去角質",
    "嚴格防曬，SPF30+",
    "避免長時間日光照射"
  ],
  texture: [
    "使用溫和去角質產品",
    "定期深層清潔",
    "使用含果酸的產品",
    "保持肌膚水油平衡"
  ],
  sensitivity: [
    "選擇溫和無刺激產品",
    "避免含酒精的護膚品",
    "使用舒緩類面膜",
    "簡化護膚步驟"
  ]
};

// === 用戶等級系統 ===
export const USER_LEVELS = {
  beginner: {
    name: "美麗新手",
    icon: "🌸",
    analyses: [0, 5],
    benefits: ["基礎分析", "簡單建議"]
  },
  intermediate: {
    name: "護膚達人", 
    icon: "💎",
    analyses: [6, 20],
    benefits: ["詳細分析", "趨勢追蹤", "個性化建議"]
  },
  expert: {
    name: "美麗專家",
    icon: "👑", 
    analyses: [21, 50],
    benefits: ["專業分析", "風水建議", "批量處理", "優先客服"]
  },
  master: {
    name: "美魔力大師",
    icon: "✨",
    analyses: [51, Infinity],
    benefits: ["全功能", "專屬顧問", "定制服務", "內測權限"]
  }
};

// === 成就系統 ===
export const ACHIEVEMENTS = [
  {
    id: "first_analysis",
    name: "初次分析",
    description: "完成第一次 AI 肌膚分析",
    icon: "🎉",
    reward: "解鎖趨勢追蹤功能"
  },
  {
    id: "week_streak",
    name: "護膚達人",
    description: "連續 7 天進行肌膚護理",
    icon: "🔥",
    reward: "獲得專屬護膚計劃"
  },
  {
    id: "improvement_master",
    name: "改善大師", 
    description: "肌膚評分提升 20 分以上",
    icon: "📈",
    reward: "解鎖高級分析功能"
  },
  {
    id: "feng_shui_follower",
    name: "風水護膚家",
    description: "按風水時機護膚 10 次",
    icon: "🔮",
    reward: "獲得專屬風水護膚指南"
  }
];

// === 季節性護膚配置 ===
export const SEASONAL_CARE = {
  spring: {
    months: [3, 4, 5],
    element: "木",
    focus: "清潔排毒",
    products: ["溫和清潔", "排毒面膜", "輕質保濕"],
    advice: "春季肌膚容易敏感，重點清潔和溫和護理"
  },
  summer: {
    months: [6, 7, 8], 
    element: "火",
    focus: "防曬控油",
    products: ["清爽防曬", "控油精華", "舒緩蘆薈"],
    advice: "夏季重點防曬和控油，避免毛孔阻塞"
  },
  autumn: {
    months: [9, 10, 11],
    element: "金", 
    focus: "保濕滋養",
    products: ["深層保濕", "滋養精油", "修復面膜"],
    advice: "秋季加強保濕，為冬季做好準備"
  },
  winter: {
    months: [12, 1, 2],
    element: "水",
    focus: "修復抗老", 
    products: ["濃潤面霜", "抗老精華", "滋養面膜"],
    advice: "冬季重點修復和抗老，加強滋養護理"
  }
};

// === 導出所有配置 ===
export default {
  SYSTEM_FEATURES,
  SKIN_ANALYSIS_FEATURES,
  ANALYSIS_STEPS,
  INITIAL_MEMORIES,
  FENG_SHUI_CONFIG,
  APP_CONFIG,
  SKINCARE_RECOMMENDATIONS,
  USER_LEVELS,
  ACHIEVEMENTS,
  SEASONAL_CARE
};