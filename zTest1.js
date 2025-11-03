const analyzeImage = async () => {
  if (!selectedImage) {
    setError('請先上傳照片');
    return;
  }

  setIsAnalyzing(true);
  setError(null);
  setAnalysisProgress(0);

  try {
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    const formData = new FormData();
    formData.append('image', selectedImage);

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData
    });

    clearInterval(progressInterval);
    setAnalysisProgress(100);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API 完整回應:', data);

    if (data.success) {
      // 修復: 正確提取分析數據
      // API 結構是 data.data.analysis.result
      let rawAnalysis = {};
      
      if (data.data?.analysis?.result) {
        rawAnalysis = data.data.analysis.result;
        console.log('✅ 從 data.data.analysis.result 提取數據');
      } else if (data.data?.result) {
        rawAnalysis = data.data.result;
        console.log('✅ 從 data.data.result 提取數據');
      } else if (data.data?.analysis) {
        rawAnalysis = data.data.analysis;
        console.log('✅ 從 data.data.analysis 提取數據');
      } else {
        console.error('❌ 無法找到分析數據');
      }
      
      console.log('原始分析數據:', rawAnalysis);
      console.log('分析項目數量:', Object.keys(rawAnalysis).length);
      
      const overallScore = calculateOverallScore(rawAnalysis);
      const skinAge = estimateSkinAge(rawAnalysis);
      const recommendations = generateRecommendations(rawAnalysis);
      
      const processedData = {
        overall_score: overallScore,
        skin_age: skinAge,
        analysis: rawAnalysis,
        recommendations: recommendations,
        face_rectangle: data.data?.face_rectangle || data.data?.analysis?.face_rectangle,
        raw_data: data.data
      };
      
      console.log('處理後的數據:', processedData);
      console.log('分析項目列表:', Object.keys(processedData.analysis));
      setAnalysisResult(processedData);
    } else {
      throw new Error(data.error || '分析失敗');
    }

  } catch (err) {
    console.error('分析錯誤:', err);
    setError(err.message || '分析過程發生錯誤,請重試');
  } finally {
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  }
};
