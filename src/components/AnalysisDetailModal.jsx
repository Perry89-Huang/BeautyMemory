// src/components/AnalysisDetailModal.jsx
// 肌膚分析詳細記錄查看組件

import React, { useState } from 'react';
import { BiX, BiDownload } from 'react-icons/bi';
import { formatTaiwanTime, getTaiwanDateString } from '../utils/timezone';

/**
 * 肌膚分析項目的中文對照表
 */
const SKIN_ANALYSIS_LABELS = {
  pores_left_cheek: '左臉頰毛孔',
  pores_right_cheek: '右臉頰毛孔',
  pores_forehead: '額頭毛孔',
  pores_jaw: '下顎毛孔',
  nasolabial_fold: '法令紋',
  nasolabial_fold_severity: '法令紋嚴重度',
  eye_pouch: '眼袋',
  eye_pouch_severity: '眼袋嚴重度',
  forehead_wrinkle: '抬頭紋',
  eye_finelines: '眼周細紋',
  dark_circle: '黑眼圈',
  crows_feet: '魚尾紋',
  glabella_wrinkle: '眉間紋',
  skin_spot: '色斑',
  acne: '痘痘',
  blackhead: '黑頭',
  mole: '痣',
  skin_type: '膚質',
  left_eyelids: '左眼皮',
  right_eyelids: '右眼皮',
  skin_color: '膚色',
  closed_comedones: '閉口粉刺',
  skintone_ita: '膚色 ITA 值',
  skin_hue_ha: '膚色 HA 值',
  sensitivity: '敏感度',
  skin_age: '肌膚年齡'
};

/**
 * 根據 value 值評估狀態
 */
const getStatusByValue = (value) => {
  if (value === 0) return { text: '優秀', color: 'text-green-600', bgColor: 'bg-green-50' };
  if (value === 1) return { text: '輕微', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  if (value === 2) return { text: '中度', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  return { text: '需改善', color: 'text-red-600', bgColor: 'bg-red-50' };
};

/**
 * 獲取膚質標籤
 */
const getSkinTypeLabel = (type) => {
  const types = ['油性肌膚', '乾性肌膚', '中性肌膚', '混合性肌膚'];
  return types[type] || '未知';
};

/**
 * 獲取膚色標籤
 */
const getSkinColorLabel = (color) => {
  const colors = ['白皙', '黃調', '棕調', '黑調'];
  return colors[color] || '未知';
};

/**
 * 肌膚分析詳細記錄查看組件
 */
const AnalysisDetailModal = ({ record, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'details' | 'recommendations' | 'routine'

  if (!record) return null;

  // 解析完整分析數據 - 支援多種數據來源和結構
  // 1. 優先使用 full_analysis_data (資料庫標準欄位)
  // 2. 如果有 result 包裝層，解包
  // 3. 備用使用 analysis
  let rawData = record.full_analysis_data || record.analysis || {};
  
  // 處理可能的 result 包裝層 (來自 AI Lab API)
  const analysisData = rawData.result || rawData;
  
  const recommendations = record.recommendations || [];
  
  // 從多個可能的來源提取 skin_age
  const skinAge = record.skin_age || analysisData.skin_age?.value || analysisData.skin_age;
  
  console.log('📊 歷史記錄數據詳細:', {
    recordId: record.id,
    hasFullAnalysisData: !!record.full_analysis_data,
    hasResultWrapper: !!rawData.result,
    hasAnalysis: !!record.analysis,
    skinAge: skinAge,
    overallScore: record.overall_score,
    analysisDataKeys: Object.keys(analysisData),
    sampleData: {
      forehead_wrinkle: analysisData.forehead_wrinkle,
      acne: analysisData.acne,
      skin_type: analysisData.skin_type,
      sensitivity: analysisData.sensitivity
    }
  });
  
  // 從資料庫讀取已保存的保養方案
  const skincareRoutine = record.skincare_routine || {
    morning: [],
    evening: [],
    weekly: [],
    products: [],
    lifestyle: []
  };

  // 分類分析數據
  const categorizeAnalysis = (analysis) => {
    const categories = {
      '🕳️ 毛孔問題': ['pores_left_cheek', 'pores_right_cheek', 'pores_forehead', 'pores_jaw'],
      '👵 皺紋老化': ['nasolabial_fold', 'forehead_wrinkle', 'eye_finelines', 'crows_feet', 'glabella_wrinkle', 'nasolabial_fold_severity'],
      '👁️ 眼周問題': ['eye_pouch', 'dark_circle', 'left_eyelids', 'right_eyelids', 'eye_pouch_severity'],
      '🎨 色素問題': ['skin_spot', 'mole', 'skin_color', 'skintone_ita', 'skin_hue_ha'],
      '🔴 痘痘粉刺': ['acne', 'blackhead', 'closed_comedones'],
      '📊 肌膚狀態': ['skin_type', 'sensitivity', 'skin_age']
    };

    const result = {};
    Object.entries(categories).forEach(([category, keys]) => {
      result[category] = keys
        .filter(key => analysis[key] !== undefined && analysis[key] !== null)
        .map(key => ({
          key,
          label: SKIN_ANALYSIS_LABELS[key],
          data: analysis[key]
        }));
    });

    return result;
  };

  const categorizedData = categorizeAnalysis(analysisData);

  // 渲染分析項目
  const renderAnalysisItem = (item) => {
    const { key, label, data } = item;

    if (!data || typeof data !== 'object') return null;

    let displayValue = '';
    let status = null;

    // 特殊處理不同類型的數據
    if (['acne', 'mole', 'skin_spot', 'blackhead', 'closed_comedones'].includes(key)) {
      const count = data.rectangle ? data.rectangle.length : (data.value || 0);
      displayValue = `${count} 處`;
      status = count === 0 ? getStatusByValue(0) : count <= 3 ? getStatusByValue(1) : getStatusByValue(2);
    } else if (key === 'skin_type') {
      displayValue = getSkinTypeLabel(data.skin_type);
    } else if (key === 'skin_color') {
      displayValue = getSkinColorLabel(data.skin_color);
    } else if (key === 'sensitivity') {
      if (data.sensitivity_area !== undefined && data.sensitivity_intensity !== undefined) {
        const area = (data.sensitivity_area * 100).toFixed(1);
        const intensity = data.sensitivity_intensity.toFixed(1);
        displayValue = `面積 ${area}% / 強度 ${intensity}`;
        status = data.sensitivity_area < 0.1 ? getStatusByValue(0) : data.sensitivity_area < 0.3 ? getStatusByValue(1) : getStatusByValue(2);
      } else {
        displayValue = 'N/A';
      }
    } else if (key === 'skin_age') {
      displayValue = `${data.value || 'N/A'} 歲`;
    } else if (['skintone_ita', 'skin_hue_ha'].includes(key)) {
      displayValue = data.ITA?.toFixed(2) || data.HA?.toFixed(2) || 'N/A';
    } else if (data.value !== undefined) {
      status = getStatusByValue(data.value);
      displayValue = status.text;
    } else {
      displayValue = 'N/A';
    }

    const confidence = data.confidence ? `${(data.confidence * 100).toFixed(1)}%` : null;

    return (
      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {confidence && (
            <p className="text-xs text-gray-500 mt-0.5">可信度: {confidence}</p>
          )}
        </div>
        <div className={`px-3 py-1 rounded-lg font-semibold text-sm ${status ? `${status.color} ${status.bgColor}` : 'text-gray-700 bg-gray-100'}`}>
          {displayValue}
        </div>
      </div>
    );
  };

  // 下載報告
  const downloadReport = () => {
    const reportContent = generateReportText();
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `美魔力肌膚檢測報告_${getTaiwanDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 生成報告文本
  const generateReportText = () => {
    const date = formatTaiwanTime(record.created_at);
    
    let report = `
========================================
美魔力 AI 肌膚檢測報告
========================================

檢測日期: ${date}
整體評分: ${record.overall_score} 分
${skinAge ? `肌膚年齡: ${skinAge} 歲\n` : ''}
風水時辰: ${record.feng_shui_element} · ${record.feng_shui_blessing}

----------------------------------------
個人化專屬保養方案
----------------------------------------

🌅 早晨保養程序
`;
    skincareRoutine.morning.forEach((item, idx) => {
      report += `${item.step}. ${item.name}\n   ${item.desc}\n`;
    });

    report += `
🌙 晚間保養程序
`;
    skincareRoutine.evening.forEach((item, idx) => {
      report += `${item.step}. ${item.name}\n   ${item.desc}\n`;
    });

    report += `
📅 每週特殊保養
`;
    skincareRoutine.weekly.forEach((item, idx) => {
      report += `• ${item.freq} - ${item.name}\n   ${item.desc}\n`;
    });

    if (skincareRoutine.products.length > 0) {
      report += `
🛍️ 推薦產品組合
`;
      skincareRoutine.products.forEach((product, idx) => {
        report += `${product}\n`;
      });
    }

    report += `
🌿 生活習慣建議
`;
    skincareRoutine.lifestyle.forEach((tip, idx) => {
      report += `${tip}\n`;
    });

    report += `
----------------------------------------
詳細分析結果
----------------------------------------

`;

    Object.entries(categorizedData).forEach(([category, items]) => {
      if (items.length > 0) {
        report += `\n${category}\n`;
        items.forEach(item => {
          const { key, label, data } = item;
          let value = 'N/A';
          
          if (['acne', 'mole', 'skin_spot', 'blackhead', 'closed_comedones'].includes(key)) {
            const count = data.rectangle ? data.rectangle.length : (data.value || 0);
            value = `${count} 處`;
          } else if (key === 'skin_type') {
            value = getSkinTypeLabel(data.skin_type);
          } else if (key === 'skin_color') {
            value = getSkinColorLabel(data.skin_color);
          } else if (key === 'sensitivity') {
            if (data.sensitivity_area !== undefined) {
              value = `面積 ${(data.sensitivity_area * 100).toFixed(1)}%`;
            }
          } else if (data.value !== undefined) {
            value = getStatusByValue(data.value).text;
          }
          
          report += `  • ${label}: ${value}\n`;
        });
      }
    });

    if (recommendations.length > 0) {
      report += `
----------------------------------------
個人化保養建議
----------------------------------------

`;
      recommendations.forEach((rec, index) => {
        const suggestion = typeof rec === 'string' ? rec : (rec.suggestion || rec.issue || '');
        report += `${index + 1}. ${suggestion}\n`;
      });
    }

    report += `
----------------------------------------
本報告由美魔力 AI 肌膚檢測系統自動生成
僅供參考，不構成醫療建議

© 2025 美魔力 Beauty Memory
========================================
    `;

    return report;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">詳細分析報告</h2>
              <p className="text-purple-100 text-sm">
                {formatTaiwanTime(record.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadReport}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="下載報告"
              >
                <BiDownload className="w-6 h-6" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <BiX className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            📊 總覽
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'details'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            🔍 詳細數據
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'recommendations'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            💡 保養建議
          </button>
          <button
            onClick={() => setActiveTab('routine')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'routine'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            ✨ 專屬保養方案
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 主要評分卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">{record.overall_score || 'N/A'}</p>
                  <p className="text-sm text-gray-600 mt-1">整體評分</p>
                </div>
                {skinAge && (
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-indigo-600">{skinAge}</p>
                    <p className="text-sm text-gray-600 mt-1">肌膚年齡</p>
                  </div>
                )}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{record.feng_shui_element || '未知'}</p>
                  <p className="text-sm text-gray-600 mt-1">風水元素</p>
                </div>
              </div>

              {/* 分析總結 */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📋 分析總結
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {/* 基礎狀態 */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">🌸</span>
                      基礎狀態
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">膚色</span>
                        <span className="font-semibold text-gray-800">
                          {analysisData.skin_color !== undefined ? getSkinColorLabel(analysisData.skin_color.skin_color) : '棕調'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">肌膚年齡</span>
                        <span className="font-bold text-lg text-indigo-600">{skinAge || 'N/A'} 歲</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">膚質</span>
                        <span className="font-semibold text-gray-800">
                          {analysisData.skin_type !== undefined ? getSkinTypeLabel(analysisData.skin_type.skin_type) : '混合性肌膚'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 老化指標 */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">😊</span>
                      老化指標
                    </h4>
                    <div className="space-y-2 text-sm">
                      {(() => {
                        const wrinkles = ['forehead_wrinkle', 'crows_feet', 'eye_finelines', 'nasolabial_fold'];
                        const detected = wrinkles.filter(k => analysisData[k]?.value >= 1);
                        return (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">皺紋檢測</span>
                              <span className={`font-bold text-lg ${detected.length > 2 ? 'text-red-600' : detected.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                {detected.length} 項
                              </span>
                            </div>
                            {detected.length > 0 && (
                              <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                                發現：{detected.map(k => SKIN_ANALYSIS_LABELS[k]).join('、')}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* 瑕疵與敏感 */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">🔴</span>
                      瑕疵與敏感
                    </h4>
                    <div className="space-y-2 text-sm">
                      {(() => {
                        const blemishes = ['acne', 'skin_spot', 'blackhead', 'closed_comedones'];
                        const totalCount = blemishes.reduce((sum, key) => {
                          const data = analysisData[key];
                          if (data?.rectangle) return sum + data.rectangle.length;
                          if (data?.value) return sum + data.value;
                          return sum;
                        }, 0);
                        
                        return (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">斑點/痘痘</span>
                              <span className={`font-bold text-lg ${totalCount > 5 ? 'text-red-600' : totalCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                {totalCount} 處
                              </span>
                            </div>
                            {analysisData.sensitivity && (
                              <div className="mt-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">敏感度</span>
                                  <span className={`font-semibold ${
                                    analysisData.sensitivity.sensitivity_intensity > 50 ? 'text-red-600' : 'text-orange-600'
                                  }`}>
                                    {analysisData.sensitivity.sensitivity_intensity?.toFixed(0) || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* 肌膚指標 (水潤度、光澤度、緊緻度) */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">💎</span>
                    肌膚指標
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {(() => {
                      // 從 full_analysis_data 中取得 scores
                      const scores = record.full_analysis_data?.scores || {};
                      const hydration = scores.hydration || record.hydration_score || 0;
                      const radiance = scores.radiance || record.radiance_score || 0;
                      const firmness = scores.firmness || record.firmness_score || 0;

                      return (
                        <>
                          {/* 水潤度 */}
                          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                            <div className="text-2xl mb-1">💧</div>
                            <div className="text-xs text-gray-600 mb-2">水潤度</div>
                            <div className={`text-2xl font-bold ${
                              hydration >= 80 ? 'text-blue-600' :
                              hydration >= 60 ? 'text-cyan-600' : 'text-orange-600'
                            }`}>
                              {hydration}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {hydration >= 80 ? '優異' : hydration >= 60 ? '良好' : '需改善'}
                            </div>
                          </div>

                          {/* 光澤度 */}
                          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                            <div className="text-2xl mb-1">✨</div>
                            <div className="text-xs text-gray-600 mb-2">光澤度</div>
                            <div className={`text-2xl font-bold ${
                              radiance >= 80 ? 'text-yellow-600' :
                              radiance >= 60 ? 'text-amber-600' : 'text-orange-600'
                            }`}>
                              {radiance}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {radiance >= 80 ? '優異' : radiance >= 60 ? '良好' : '需改善'}
                            </div>
                          </div>

                          {/* 緊緻度 */}
                          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                            <div className="text-2xl mb-1">🎯</div>
                            <div className="text-xs text-gray-600 mb-2">緊緻度</div>
                            <div className={`text-2xl font-bold ${
                              firmness >= 80 ? 'text-purple-600' :
                              firmness >= 60 ? 'text-pink-600' : 'text-red-600'
                            }`}>
                              {firmness}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {firmness >= 80 ? '優異' : firmness >= 60 ? '良好' : '需改善'}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* 專業總結 */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    專業總結
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {(() => {
                      const score = record.overall_score;
                      const age = skinAge;
                      const wrinkles = ['forehead_wrinkle', 'crows_feet', 'nasolabial_fold'].filter(k => analysisData[k]?.value >= 1);
                      const blemishes = ['acne', 'skin_spot'].reduce((sum, k) => {
                        const data = analysisData[k];
                        return sum + (data?.rectangle?.length || data?.value || 0);
                      }, 0);
                      
                      let summary = `根據 AI 深度分析，您的肌膚整體評分為 ${score} 分，肌膚年齡為 ${age} 歲。`;
                      
                      if (wrinkles.length > 0) {
                        summary += ` 檢測到 ${wrinkles.map(k => SKIN_ANALYSIS_LABELS[k]).join('、')} 等老化跡象，建議加強抗老保養。`;
                      }
                      
                      if (blemishes > 5) {
                        summary += ` 發現多處色斑與痘痘問題，需要針對性護理。`;
                      } else if (blemishes > 0) {
                        summary += ` 有少量瑕疵，持續保養可改善。`;
                      }
                      
                      if (analysisData.sensitivity?.sensitivity_intensity > 50) {
                        summary += ` 肌膚敏感度較高，建議採用溫和舒緩產品。`;
                      }
                      
                      if (score >= 85) {
                        summary += ` 整體狀態優異，請繼續保持良好習慣！`;
                      } else if (score >= 70) {
                        summary += ` 肌膚狀態良好，持續保養可達到更佳效果。`;
                      } else {
                        summary += ` 建議參考專屬保養方案，加強日常保養。`;
                      }
                      
                      return summary;
                    })()}
                  </p>
                </div>
              </div>

              {/* 風水時辰 */}
              {record.feng_shui_blessing && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🔮 風水時辰加持
                  </h3>
                  <p className="text-gray-700">
                    <span className="font-bold text-amber-700">{record.feng_shui_element}</span> 元素
                  </p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{record.feng_shui_blessing}</p>
                </div>
              )}

              {/* 檢測時間資訊 */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">⏰ 檢測資訊</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>• 檢測時間：{formatTaiwanTime(record.created_at)}</p>
                  <p>• 檢測日期：{getTaiwanDateString(record.created_at)}</p>
                  {record.source && <p>• 資料來源：{record.source === 'local' ? '本地記錄' : '雲端記錄'}</p>}
                </div>
              </div>

              {/* 圖片 */}
              {record.image_url && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">📸 檢測照片</h3>
                  <img
                    src={record.image_url}
                    alt="檢測照片"
                    className="rounded-lg max-w-full mx-auto shadow-md"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Skincare Routine Tab */}
          {activeTab === 'routine' && (
            <div className="space-y-6">
              {skincareRoutine.morning.length === 0 && skincareRoutine.evening.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">此記錄尚無專屬保養方案</p>
                  <p className="text-sm text-gray-400">請進行新的檢測以獲得完整的個人化保養方案</p>
                </div>
              ) : (
                <>
              {/* 早晨保養 */}
              {skincareRoutine.morning.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🌅 早晨保養程序
                </h3>
                <div className="space-y-3">
                  {skincareRoutine.morning.map((item, index) => (
                    <div key={index} className="flex gap-3 bg-white/60 rounded-lg p-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* 晚間保養 */}
              {skincareRoutine.evening.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🌙 晚間保養程序
                </h3>
                <div className="space-y-3">
                  {skincareRoutine.evening.map((item, index) => (
                    <div key={index} className="flex gap-3 bg-white/60 rounded-lg p-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* 每週特殊保養 */}
              {skincareRoutine.weekly.length > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📅 每週特殊保養
                </h3>
                <div className="space-y-3">
                  {skincareRoutine.weekly.map((item, index) => (
                    <div key={index} className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-pink-500 text-white text-xs rounded-full font-semibold">
                          {item.freq}
                        </span>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                      </div>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* 推薦產品組合 */}
              {skincareRoutine.products.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    🛍️ 推薦產品組合
                  </h3>
                  <div className="space-y-2">
                    {skincareRoutine.products.map((product, index) => (
                      <div key={index} className="bg-white/60 rounded-lg p-3 text-gray-700">
                        {product}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 生活習慣建議 */}
              {skincareRoutine.lifestyle.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5 border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🌿 生活習慣建議
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {skincareRoutine.lifestyle.map((tip, index) => (
                    <div key={index} className="bg-white/60 rounded-lg p-3 text-sm text-gray-700">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* 溫馨提示 */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-blue-700">💡 溫馨提示：</span>
                  本保養方案根據您的肌膚檢測結果量身定制。建議持續使用 28 天（一個肌膚更新週期）後再次檢測，追蹤改善成效。如有任何不適，請立即停用並諮詢專業人士。
                </p>
              </div>
              </>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {Object.entries(categorizedData).map(([category, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={category} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-3">{category}</h3>
                    <div className="space-y-1">
                      {items.map(item => renderAnalysisItem(item))}
                    </div>
                  </div>
                );
              })}
              {Object.values(categorizedData).every(items => items.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  <p>暫無詳細分析數據</p>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => {
                  const suggestion = typeof rec === 'string' ? rec : (rec.suggestion || rec.issue || '');
                  return (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1 leading-relaxed">{suggestion}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>暫無護膚建議</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-between items-center border-t">
          <button
            onClick={downloadReport}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <BiDownload className="w-5 h-5" />
            下載報告
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetailModal;
