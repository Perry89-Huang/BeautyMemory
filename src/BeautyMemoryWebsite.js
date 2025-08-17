import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Star, Sparkles, Heart, Brain, Zap, Camera, Calendar, Database, TrendingUp, Shield, Smartphone, Scan, Upload, Play, BarChart3, Eye, Droplets, Sun } from 'lucide-react';

const BeautyMemoryWebsite = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [memories, setMemories] = useState([]);
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 智能記憶系統演示數據
  useEffect(() => {
    const beautyMemories = [
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
    setMemories(beautyMemories);
  }, []);

  const systemFeatures = [
    {
      icon: <Scan className="w-8 h-8" />,
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
      icon: <Database className="w-8 h-8" />,
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
      icon: <Camera className="w-8 h-8" />,
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
      icon: <Zap className="w-8 h-8" />,
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

  const skinAnalysisFeatures = [
    { name: "皺紋檢測", icon: <Eye className="w-5 h-5" />, color: "text-purple-600" },
    { name: "毛孔分析", icon: <Scan className="w-5 h-5" />, color: "text-blue-600" },
    { name: "色斑檢測", icon: <Sun className="w-5 h-5" />, color: "text-amber-600" },
    { name: "水分測試", icon: <Droplets className="w-5 h-5" />, color: "text-cyan-600" },
    { name: "膚質分析", icon: <BarChart3 className="w-5 h-5" />, color: "text-green-600" },
    { name: "亮澤度", icon: <Sparkles className="w-5 h-5" />, color: "text-pink-600" }
  ];

  const analysisSteps = [
    {
      step: "01",
      title: "上傳照片",
      description: "上傳清晰的臉部照片，確保光線充足",
      icon: <Upload className="w-8 h-8" />,
      action: "選擇照片"
    },
    {
      step: "02", 
      title: "AI 分析中",
      description: "Perfect Corp AI 引擎進行 14 項專業檢測",
      icon: <Brain className="w-8 h-8" />,
      action: "分析中..."
    },
    {
      step: "03",
      title: "生成報告",
      description: "獲得專業肌膚分析報告與改善建議",
      icon: <BarChart3 className="w-8 h-8" />,
      action: "查看報告"
    },
    {
      step: "04",
      title: "記憶儲存", 
      description: "將分析結果加入您的美麗記憶庫",
      icon: <Database className="w-8 h-8" />,
      action: "保存記憶"
    }
  ];

  // 模擬肌膚分析功能
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        startAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setActiveAnalysisStep(1);
    
    // 模擬分析過程
    setTimeout(() => {
      setActiveAnalysisStep(2);
      // 模擬分析結果
      setTimeout(() => {
        const mockResult = {
          overall_score: 78,
          skin_age: 25,
          concerns: [
            { name: "皺紋", score: 85, status: "良好", improvement: "+5%" },
            { name: "毛孔", score: 72, status: "需改善", improvement: "-8%" },
            { name: "色斑", score: 88, status: "優秀", improvement: "+12%" },
            { name: "水分", score: 65, status: "偏乾", improvement: "-3%" },
            { name: "亮澤度", score: 91, status: "優秀", improvement: "+15%" },
            { name: "膚質", score: 76, status: "良好", improvement: "+7%" }
          ],
          recommendations: [
            "建議加強保濕護理",
            "使用含維他命C的精華",
            "定期去角質改善毛孔"
          ]
        };
        setAnalysisResult(mockResult);
        setActiveAnalysisStep(3);
        setIsAnalyzing(false);
      }, 3000);
    }, 2000);
  };

  const saveToMemory = () => {
    const newMemory = {
      id: memories.length + 1,
      moment: `AI 肌膚分析 - 總分 ${analysisResult.overall_score}`,
      emotion: "🔬",
      date: new Date().toLocaleDateString('zh-TW'),
      product: "AI 智能分析",
      aiAnalysis: `肌膚年齡: ${analysisResult.skin_age}歲，建議持續保養`,
      skinMetrics: analysisResult.concerns.reduce((acc, concern) => {
        acc[concern.name] = concern.score;
        return acc;
      }, {})
    };
    setMemories([newMemory, ...memories]);
    setActiveAnalysisStep(4);
    
    setTimeout(() => {
      setShowSkinAnalysis(false);
      setActiveAnalysisStep(0);
      setAnalysisResult(null);
      setUploadedImage(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/60 to-blue-100/40"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        {/* Neural Network Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${10 + i * 8}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                transform: `translateY(${scrollY * (0.1 + i * 0.02)}px)`
              }}
            >
              <div className="w-1 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-40" />
              {i % 3 === 0 && (
                <div className="absolute inset-0 w-8 h-8 border border-purple-200/30 rounded-full animate-ping" />
              )}
            </div>
          ))}
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8 inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200/50 shadow-lg">
            <Scan className="w-5 h-5 text-purple-500 mr-2 animate-pulse" />
            <span className="text-slate-700 text-sm font-medium">Perfect Corp AI • 醫師級肌膚分析技術</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-6 tracking-tight">
            美魔力
          </h1>
          
          <div className="mb-8">
            <p className="text-3xl md:text-4xl text-slate-700 font-bold mb-3">
              Beauty Memory
            </p>
            <p className="text-xl text-purple-600 font-medium mb-2">
              AI 智能肌膚分析 • 美麗記憶系統
            </p>
            <p className="text-lg text-slate-500 italic">
              Memory = 美魔力 • Perfect Corp 技術驅動
            </p>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            全球首創 AI 美麗記憶技術<br />
            <span className="text-pink-500 font-medium">95% 準確率媲美專業皮膚科醫師</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setShowSkinAnalysis(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              立即 AI 肌膚分析
            </button>
            <button className="px-8 py-4 border-2 border-purple-300 rounded-full text-purple-600 font-semibold text-lg hover:bg-purple-50 transition-all duration-300 shadow-sm">
              了解分析技術
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </div>
      </section>

      {/* AI Skin Analysis Modal */}
      {showSkinAnalysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">AI 肌膚分析系統</h2>
              <button 
                onClick={() => setShowSkinAnalysis(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Analysis Steps */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {analysisSteps.map((step, index) => (
                <div key={index} className={`text-center p-4 rounded-xl border-2 transition-all ${
                  activeAnalysisStep === index 
                    ? 'border-purple-400 bg-purple-50' 
                    : activeAnalysisStep > index 
                      ? 'border-green-400 bg-green-50'
                      : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                    activeAnalysisStep === index 
                      ? 'bg-purple-500 text-white' 
                      : activeAnalysisStep > index
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-300 text-slate-600'
                  }`}>
                    {React.cloneElement(step.icon, { className: "w-6 h-6" })}
                  </div>
                  <div className="text-xs text-purple-500 font-bold mb-1">{step.step}</div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Upload Section */}
            {!uploadedImage && (
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center mb-6">
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">上傳您的照片</h3>
                <p className="text-slate-600 mb-4">支援 JPG、PNG 格式，建議正面清晰照片</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden" 
                  id="imageUpload"
                />
                <label 
                  htmlFor="imageUpload"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  選擇照片
                </label>
              </div>
            )}

            {/* Analysis in Progress */}
            {uploadedImage && isAnalyzing && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">AI 正在分析您的肌膚...</h3>
                <p className="text-slate-600 mb-4">Perfect Corp 引擎正在進行 14 項專業檢測</p>
                <div className="w-64 bg-slate-200 rounded-full h-2 mx-auto">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">分析結果</h3>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">{analysisResult.overall_score}</div>
                      <div className="text-sm text-slate-600">總體評分</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-block bg-white rounded-lg p-3 shadow-sm">
                      <span className="text-sm text-slate-600">AI 推算肌膚年齡：</span>
                      <span className="text-lg font-bold text-purple-600 ml-2">{analysisResult.skin_age} 歲</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResult.concerns.map((concern, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-800">{concern.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          concern.status === '優秀' ? 'bg-green-100 text-green-700' :
                          concern.status === '良好' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
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
                            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" 
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
                  ))}
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-slate-800 mb-3">AI 個人化建議</h4>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <button 
                    onClick={saveToMemory}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                  >
                    保存到美麗記憶庫
                  </button>
                </div>
              </div>
            )}

            {activeAnalysisStep === 4 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">已保存至記憶庫！</h3>
                <p className="text-slate-600">您的美麗記憶已成功記錄</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skin Analysis Features Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm border-y border-slate-200/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              14 項專業肌膚檢測
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Perfect Corp 醫師級 AI 技術，95% 準確率
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {skinAnalysisFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${feature.color} bg-opacity-10`}>
                    {React.cloneElement(feature.icon, { className: `w-5 h-5 ${feature.color}` })}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{feature.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* System Features Section */}
      <section className="py-20 px-4 relative bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              AI 智能美麗記憶系統
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              整合 Perfect Corp 專業肌膚分析技術，為您打造專屬的美麗記憶庫，
              讓每一次護膚都成為科學化的美麗投資。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {systemFeatures.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-purple-600 text-sm mb-4 font-medium">{feature.subtitle}</p>
                  <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-600">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Memory Showcase */}
      <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              AI 美麗記憶實例
            </h2>
            <p className="text-lg text-slate-600">
              系統智能記錄的真實美麗蛻變數據
            </p>
          </div>

          <div className="grid gap-6">
            {memories.map((memory, index) => (
              <div key={memory.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{memory.emotion}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-slate-800 font-bold text-lg">{memory.moment}</p>
                      <div className="text-xs text-purple-500 bg-purple-50 px-2 py-1 rounded-full">
                        Memory #{memory.id}
                      </div>
                    </div>
                    <p className="text-slate-600 mb-2">使用產品：{memory.product}</p>
                    <p className="text-slate-500 text-sm mb-3">{memory.date}</p>
                    
                    {/* Skin Metrics Display */}
                    {memory.skinMetrics && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {Object.entries(memory.skinMetrics).slice(0, 3).map(([key, value], idx) => (
                          <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 text-center">
                            <div className="text-xs text-slate-600">{key}</div>
                            <div className="text-sm font-bold text-purple-600">{value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200/50">
                      <p className="text-sm text-purple-600 font-medium">
                        🤖 {memory.aiAnalysis}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={() => setShowSkinAnalysis(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto"
            >
              <Camera className="w-5 h-5" />
              立即進行 AI 肌膚分析
            </button>
          </div>
        </div>
      </section>

      {/* Perfect Corp Technology Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Perfect Corp 專業技術驅動
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              採用全球領先的 Perfect Corp AI 肌膚分析技術，
              提供媲美專業皮膚科醫師的精準檢測服務。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">95% 準確率</h3>
              <p className="text-slate-600">Wake Forest 醫學院皮膚科教授驗證，與醫師診斷相關性超過 80%</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">即時分析</h3>
              <p className="text-slate-600">先進 AI 演算法，數秒內完成 14 項專業肌膚檢測</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">隱私保護</h3>
              <p className="text-slate-600">企業級安全防護，您的美麗數據完全保密</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  全方位肌膚健康檢測
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">HD 高清皺紋檢測（額頭、魚尾紋、法令紋等 7 個區域）</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-700">精密毛孔分析（鼻翼、臉頰、額頭分區檢測）</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-slate-700">色斑與亮澤度全面評估</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700">肌膚年齡 AI 智能推算</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border-4 border-purple-200 mb-4">
                  <Scan className="w-16 h-16 text-purple-600" />
                </div>
                <p className="text-slate-600 text-sm">
                  Perfect Corp 專利 AgileFace® 追蹤技術
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-200 shadow-xl">
            <Scan className="w-20 h-20 text-purple-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              立即體驗 AI 肌膚分析
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Perfect Corp 專業技術 • 95% 醫師級準確率<br />
              開始建立專屬的美麗記憶庫
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-6">
              <input 
                type="email" 
                placeholder="輸入郵件，獲取 AI 分析報告"
                className="w-full px-6 py-3 bg-white/80 border border-slate-300 rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 backdrop-blur-sm shadow-sm"
              />
              <button 
                onClick={() => setShowSkinAnalysis(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 whitespace-nowrap shadow-lg"
              >
                立即分析
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-600 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <Scan className="w-4 h-4 text-purple-500" />
                <span>14 項專業檢測</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>95% 準確率</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>隱私安全保護</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Database className="w-4 h-4 text-pink-500" />
                <span>美麗記憶庫</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-200 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">美魔力</h3>
              <p className="text-xl text-purple-600 mb-4">Beauty Memory</p>
              <p className="text-slate-600 leading-relaxed">
                AI 智能肌膚分析系統<br />
                Perfect Corp 技術驅動<br />
                Memory = 美魔力
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-4">AI 分析功能</h4>
              <ul className="space-y-2 text-slate-600">
                <li>🔬 14 項專業肌膚檢測</li>
                <li>📊 95% 醫師級準確率</li>
                <li>📸 即時智能分析</li>
                <li>💾 美麗記憶儲存</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-4">技術特色</h4>
              <div className="text-slate-600 space-y-2">
                <p>🏥 Perfect Corp 專業技術</p>
                <p>🔒 企業級安全防護</p>
                <p>📈 個人化改善建議</p>
                <p>🤖 AI 美容顧問服務</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm mb-2">
              © 2025 美魔力 Beauty Memory • AI 智能肌膚分析系統
            </p>
            <p className="text-slate-400 text-xs">
              Powered by Perfect Corp • Memory = 美魔力 • 讓科技記住每個美麗瞬間
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BeautyMemoryWebsite;