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
  BiBrain 
} from 'react-icons/bi';

import { 
  FiDatabase, 
  FiCamera, 
  FiZap, 
  FiEye, 
  FiDroplet, 
  FiSun, 
  FiBarChart, 
  FiUpload 
} from 'react-icons/fi';

import { 
  AiOutlineScan,
  AiOutlineBarChart,
  AiOutlineEye,
  AiOutlineDatabase,
  AiOutlineThunderbolt
} from 'react-icons/ai';

import { 
  RiSparklingFill,
  RiBrainFill
} from 'react-icons/ri';

// === System Features Configuration ===
export const SYSTEM_FEATURES = [
  {
    icon: <BiScan className="w-8 h-8" />,
    title: "AI 即時肌膚掃描",
    subtitle: "14 項專業肌膚檢測",
    description: "運用Perfect Corp專業技術，即時分析皺紋、毛孔、色斑、亮澤度等14項肌膚指標，95%準確率媲美專業皮膚科醫師",
    gradient: "from-blue-400 to-cyan-400",
    details: [
      "即時肌膚狀態掃描",
      "14項專業肌膚分析", 
      "95%醫師級準確率",
      "個人化改善建議"
    ]
  },
  {
    icon: <BiData className="w-8 h-8" />,
    title: "美麗記憶資料庫",
    subtitle: "每一次改變都被完整記錄",
    description: "建立個人美麗成長歷程，記錄每次護膚的細微變化，形成專屬的美麗記憶庫",
    gradient: "from-purple-400 to-indigo-400",
    details: [
      "美麗歷程完整記錄",
      "護膚效果數據分析",
      "個人偏好學習記憶", 
      "美容習慣智能優化"
    ]
  },
  {
    icon: <BiCamera className="w-8 h-8" />,
    title: "智能記憶捕捉",
    subtitle: "科技記住每個美麗瞬間",
    description: "高精度影像識別技術，自動捕捉並分析美麗變化，讓每個進步都成為珍貴記憶",
    gradient: "from-pink-400 to-rose-400",
    details: [
      "高清肌膚影像記錄",
      "自動美麗變化檢測",
      "時間軸美麗對比",
      "成果分享與慶祝"
    ]
  },
  {
    icon: <FiZap className="w-8 h-8" />,
    title: "即時智能提醒",
    subtitle: "永不錯過的美麗時光",
    description: "基於您的生活節奏和肌膚週期，智能提醒最佳護膚時機，讓美麗成為習慣",
    gradient: "from-amber-400 to-orange-400",
    details: [
      "個人化護膚時程表",
      "生理週期美容提醒",
      "環境因子護膚建議",
      "習慣養成智能助手"
    ]
  }
];

// === Skin Analysis Features ===
export const SKIN_ANALYSIS_FEATURES = [
  { name: "皺紋檢測", icon: <FiEye className="w-5 h-5" />, color: "text-purple-600" },
  { name: "毛孔分析", icon: <BiScan className="w-5 h-5" />, color: "text-blue-600" },
  { name: "色斑檢測", icon: <BiSun className="w-5 h-5" />, color: "text-amber-600" },
  { name: "水分測試", icon: <BiDroplet className="w-5 h-5" />, color: "text-cyan-600" },
  { name: "膚質分析", icon: <BiBarChart className="w-5 h-5" />, color: "text-green-600" },
  { name: "亮澤度", icon: <RiSparklingFill className="w-5 h-5" />, color: "text-pink-600" }
];

// === Analysis Steps Configuration ===
export const ANALYSIS_STEPS = [
  {
    step: "01",
    title: "上傳照片",
    description: "上傳清晰的臉部照片，確保光線充足",
    icon: <FiUpload className="w-8 h-8" />,
    action: "選擇照片"
  },
  {
    step: "02", 
    title: "AI 分析中",
    description: "Perfect Corp AI 引擎進行 14 項專業檢測",
    icon: <RiBrainFill className="w-8 h-8" />,
    action: "分析中..."
  },
  {
    step: "03",
    title: "生成報告",
    description: "獲得專業肌膚分析報告與改善建議",
    icon: <AiOutlineBarChart className="w-8 h-8" />,
    action: "查看報告"
  },
  {
    step: "04",
    title: "記憶儲存", 
    description: "將分析結果加入您的美麗記憶庫",
    icon: <AiOutlineDatabase className="w-8 h-8" />,
    action: "保存記憶"
  }
];

// === Initial Demo Data ===
export const INITIAL_MEMORIES = [
  { 
    id: 1, 
    moment: "肌膚水分提升 15%", 
    emotion: "💧", 
    date: "2025.01.15",
    product: "蓮花精華露",
    aiAnalysis: "AI 分析：肌膚狀態顯著改善",
    skinMetrics: { hydration: 85, brightness: 78, firmness: 82 }
  },
  { 
    id: 2, 
    moment: "細紋減少 8 條", 
    emotion: "✨", 
    date: "2025.01.20",
    product: "野山蘿蔔精華",
    aiAnalysis: "AI 建議：持續使用效果更佳",
    skinMetrics: { wrinkles: 92, texture: 88, radiance: 85 }
  },
  { 
    id: 3, 
    moment: "膚色亮度提升 2 階", 
    emotion: "🌟", 
    date: "2025.01.25",
    product: "美白保濕霜",
    aiAnalysis: "AI 預測：4 週後達到理想狀態",
    skinMetrics: { brightness: 91, evenness: 87, glow: 89 }
  },
];

// === App Configuration ===
export const APP_CONFIG = {
  brand: {
    name: "美魔力",
    englishName: "Beauty Memory",
    tagline: "Memory = 美魔力",
    description: "AI 智能肌膚分析系統"
  },
  technology: {
    provider: "Perfect Corp",
    accuracy: "95%",
    features: 14,
    patentTech: "AgileFace® 追蹤技術"
  },
  contact: {
    year: "2025",
    copyright: "美魔力 Beauty Memory • AI 智能肌膚分析系統",
    poweredBy: "Powered by Perfect Corp • Memory = 美魔力 • 讓科技記住每個美麗瞬間"
  }
};