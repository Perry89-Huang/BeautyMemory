import React from 'react';
import { HiOutlineCloudArrowUp as Upload, HiOutlineCpuChip as Brain, HiOutlineCircleStack as Database, HiOutlineXMark as X } from 'react-icons/hi2';
import { ANALYSIS_STEPS } from '../../data/constants';

/**
 * Skin Analysis Modal Component
 * Main modal for conducting AI skin analysis
 */
const SkinAnalysisModal = ({ 
  isOpen, 
  onClose, 
  activeStep, 
  uploadedImage, 
  isAnalyzing, 
  analysisResult, 
  onImageUpload, 
  onSaveToMemory 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <ModalHeader onClose={onClose} />
        <AnalysisStepsIndicator activeStep={activeStep} />
        <ModalContent 
          activeStep={activeStep}
          uploadedImage={uploadedImage}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          onImageUpload={onImageUpload}
          onSaveToMemory={onSaveToMemory}
        />
      </div>
    </div>
  );
};

/**
 * Modal Header with Close Button
 */
const ModalHeader = ({ onClose }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-slate-800">AI 肌膚分析系統</h2>
    <button 
      onClick={onClose}
      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors group"
      aria-label="關閉分析視窗"
    >
      <X className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
    </button>
  </div>
);

/**
 * Analysis Steps Indicator
 */
const AnalysisStepsIndicator = ({ activeStep }) => (
  <div className="grid md:grid-cols-4 gap-4 mb-8">
    {ANALYSIS_STEPS.map((step, index) => (
      <StepIndicatorCard 
        key={index} 
        step={step} 
        index={index} 
        activeStep={activeStep} 
      />
    ))}
  </div>
);

/**
 * Individual Step Indicator Card
 */
const StepIndicatorCard = ({ step, index, activeStep }) => {
  const getStepStatus = () => {
    if (activeStep === index) return 'active';
    if (activeStep > index) return 'completed';
    return 'pending';
  };

  const status = getStepStatus();
  
  const statusClasses = {
    active: 'border-purple-400 bg-purple-50',
    completed: 'border-green-400 bg-green-50',
    pending: 'border-slate-200 bg-slate-50'
  };

  const iconClasses = {
    active: 'bg-purple-500 text-white',
    completed: 'bg-green-500 text-white',
    pending: 'bg-slate-300 text-slate-600'
  };

  return (
    <div className={`text-center p-4 rounded-xl border-2 transition-all duration-300 ${statusClasses[status]}`}>
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all duration-300 ${iconClasses[status]}`}>
        {React.cloneElement(step.icon, { className: "w-6 h-6" })}
      </div>
      <div className="text-xs text-purple-500 font-bold mb-1">{step.step}</div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h3>
      <p className="text-xs text-slate-600">{step.description}</p>
    </div>
  );
};

/**
 * Modal Content Based on Current Step
 */
const ModalContent = ({ 
  activeStep, 
  uploadedImage, 
  isAnalyzing, 
  analysisResult, 
  onImageUpload, 
  onSaveToMemory 
}) => {
  if (!uploadedImage && activeStep === 0) {
    return <ImageUploadSection onImageUpload={onImageUpload} />;
  }

  if (uploadedImage && isAnalyzing) {
    return <AnalyzingSection />;
  }

  if (analysisResult && !isAnalyzing && activeStep === 3) {
    return <AnalysisResultsSection result={analysisResult} onSaveToMemory={onSaveToMemory} />;
  }

  if (activeStep === 4) {
    return <SavedToMemorySection />;
  }

  return null;
};

/**
 * Image Upload Section
 */
const ImageUploadSection = ({ onImageUpload }) => (
  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center mb-6 hover:border-purple-400 transition-colors duration-300">
    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
    <h3 className="text-lg font-bold text-slate-800 mb-2">上傳您的照片</h3>
    <p className="text-slate-600 mb-4">支援 JPG、PNG 格式，建議正面清晰照片</p>
    <p className="text-sm text-slate-500 mb-6">
      💡 提示：確保光線充足、臉部清晰可見，以獲得最佳分析效果
    </p>
    
    <input 
      type="file" 
      accept="image/*" 
      onChange={onImageUpload}
      className="hidden" 
      id="imageUpload"
    />
    <label 
      htmlFor="imageUpload"
      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      選擇照片
    </label>
  </div>
);

/**
 * Analyzing Section
 */
const AnalyzingSection = () => (
  <div className="text-center py-8">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse">
      <Brain className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">AI 正在分析您的肌膚...</h3>
    <p className="text-slate-600 mb-4">Perfect Corp 引擎正在進行 14 項專業檢測</p>
    
    {/* Progress Bar */}
    <div className="w-64 bg-slate-200 rounded-full h-2 mx-auto mb-4">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse transition-all duration-1000" 
           style={{ width: '75%' }}></div>
    </div>
    
    {/* Analysis Steps */}
    <div className="text-sm text-slate-500 space-y-1">
      <p>🔍 檢測臉部特徵...</p>
      <p>📊 分析肌膚狀態...</p>
      <p>🧠 生成個人化建議...</p>
    </div>
  </div>
);

/**
 * Analysis Results Section
 */
const AnalysisResultsSection = ({ result, onSaveToMemory }) => (
  <div className="space-y-6">
    <OverallScoreCard result={result} />
    <ConcernsGrid concerns={result.concerns} />
    <RecommendationsCard recommendations={result.recommendations} />
    <SaveButton onSaveToMemory={onSaveToMemory} />
  </div>
);

/**
 * Overall Score Card
 */
const OverallScoreCard = ({ result }) => (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-slate-800">分析結果</h3>
      <div className="text-right">
        <div className="text-3xl font-bold text-purple-600">{result.overall_score}</div>
        <div className="text-sm text-slate-600">總體評分</div>
      </div>
    </div>
    <div className="text-center">
      <div className="inline-block bg-white rounded-lg p-3 shadow-sm">
        <span className="text-sm text-slate-600">AI 推算肌膚年齡：</span>
        <span className="text-lg font-bold text-purple-600 ml-2">{result.skin_age} 歲</span>
      </div>
    </div>
  </div>
);

/**
 * Concerns Grid
 */
const ConcernsGrid = ({ concerns }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {concerns.map((concern, index) => (
      <ConcernCard key={index} concern={concern} />
    ))}
  </div>
);

/**
 * Individual Concern Card
 */
const ConcernCard = ({ concern }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case '優秀': return 'bg-green-100 text-green-700 border-green-200';
      case '良好': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-slate-800">{concern.name}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(concern.status)}`}>
          {concern.status}
        </span>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>評分</span>
          <span className="font-bold">{concern.score}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000" 
            style={{width: `${concern.score}%`}}
          ></div>
        </div>
      </div>
      
      <div className="text-xs text-slate-600">
        較上次 <span className={concern.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
          {concern.improvement}
        </span>
      </div>
    </div>
  );
};

/**
 * Recommendations Card
 */
const RecommendationsCard = ({ recommendations }) => (
  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span>🤖</span>
      AI 個人化建議
    </h4>
    <ul className="space-y-2">
      {recommendations.map((rec, index) => (
        <li key={index} className="flex items-start gap-2 text-slate-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          {rec}
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Save Button
 */
const SaveButton = ({ onSaveToMemory }) => (
  <div className="text-center">
    <button 
      onClick={onSaveToMemory}
      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      保存到美麗記憶庫
    </button>
  </div>
);

/**
 * Saved to Memory Section
 */
const SavedToMemorySection = () => (
  <div className="text-center py-8">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
      <Database className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">已保存至記憶庫！</h3>
    <p className="text-slate-600">您的美麗記憶已成功記錄</p>
    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
      <p className="text-sm text-green-700">
        🎉 恭喜！您的肌膚分析數據已加入美麗記憶庫，可隨時查看歷史趨勢變化
      </p>
    </div>
  </div>
);

export default SkinAnalysisModal;