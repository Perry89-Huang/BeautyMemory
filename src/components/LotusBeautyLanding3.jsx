import React, { useEffect } from 'react';

const LotusBeautyLanding3 = () => {
  useEffect(() => {
    // 注入樣式
    if (!document.getElementById('landing-page-styles')) {
      const style = document.createElement('style');
      style.id = 'landing-page-styles';
      style.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Microsoft JhengHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #333;
        }

        .landing-page {
          background: #ffffff;
          min-height: 100vh;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInDown 0.6s ease;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
          animation: fadeInUp 0.6s ease 0.2s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          animation: fadeInUp 0.6s ease 0.4s both;
        }

        .hero-highlight {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.2rem 0.8rem;
          border-radius: 8px;
          font-weight: 600;
        }

        .countdown-timer {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
          animation: fadeInUp 0.6s ease 0.6s both;
        }

        .countdown-item {
          text-align: center;
        }

        .countdown-number {
          font-size: 3rem;
          font-weight: 700;
          display: block;
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem;
          border-radius: 15px;
          min-width: 100px;
        }

        .countdown-label {
          font-size: 0.9rem;
          margin-top: 0.5rem;
          opacity: 0.9;
        }

        .hero-cta {
          margin-top: 2rem;
          animation: fadeInUp 0.6s ease 0.8s both;
        }

        .cta-primary {
          display: inline-block;
          background: white;
          color: #667eea;
          padding: 1.2rem 3rem;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border: none;
          cursor: pointer;
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        /* Problem Section */
        .problem-section {
          padding: 4rem 2rem;
          background: #f8f9fa;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 3rem;
          position: relative;
          padding-bottom: 1rem;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }

        .problem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .problem-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border-left: 4px solid #e74c3c;
        }

        .problem-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .problem-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .problem-title {
          font-size: 1.3rem;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .problem-description {
          color: #6c757d;
          line-height: 1.8;
        }

        /* Solution Section */
        .solution-section {
          padding: 4rem 2rem;
          background: white;
        }

        .solution-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .solution-card {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border-left: 4px solid #27ae60;
        }

        .solution-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
        }

        .solution-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .solution-title {
          font-size: 1.3rem;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .solution-description {
          color: #6c757d;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .solution-benefit {
          background: white;
          padding: 0.8rem;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #27ae60;
          font-weight: 600;
        }

        /* Comparison Section */
        .comparison-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .comparison-table {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .comparison-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .comparison-table thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .comparison-table th {
          padding: 1.5rem;
          text-align: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .comparison-table td {
          padding: 1.5rem;
          text-align: center;
          border-bottom: 1px solid #eee;
        }

        .comparison-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .comparison-label {
          font-weight: 600;
          color: #2c3e50;
          text-align: left;
        }

        .comparison-bad {
          color: #e74c3c;
        }

        .comparison-good {
          color: #27ae60;
          font-weight: 600;
        }

        /* Technology Section */
        .technology-section {
          padding: 4rem 2rem;
          background: white;
        }

        .tech-timeline {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
        }

        .tech-timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }

        .tech-item {
          display: flex;
          align-items: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .tech-item:nth-child(odd) {
          flex-direction: row;
        }

        .tech-item:nth-child(even) {
          flex-direction: row-reverse;
        }

        .tech-content {
          flex: 1;
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin: 0 2rem;
        }

        .tech-generation {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .tech-title {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .tech-description {
          color: #6c757d;
          line-height: 1.8;
        }

        .tech-circle {
          width: 30px;
          height: 30px;
          background: white;
          border: 4px solid #667eea;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }

        /* Opportunity Section */
        .opportunity-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .opportunity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .opportunity-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .opportunity-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
        }

        .opportunity-number {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ffd700;
        }

        .opportunity-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .opportunity-description {
          opacity: 0.9;
          font-size: 0.95rem;
        }

        /* Form Section */
        .form-section {
          padding: 4rem 2rem;
          background: #f8f9fa;
        }

        .form-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .form-title {
          text-align: center;
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          font-weight: 600;
        }

        .form-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-select {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: 'Microsoft JhengHei', sans-serif;
          background: white;
        }

        .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-submit {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Microsoft JhengHei', sans-serif;
        }

        .form-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .form-privacy {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #6c757d;
        }

        /* Testimonial Section */
        .testimonial-section {
          padding: 4rem 2rem;
          background: white;
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .testimonial-card {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .testimonial-quote {
          font-size: 3rem;
          color: #667eea;
          opacity: 0.3;
          line-height: 0;
          margin-bottom: 1rem;
        }

        .testimonial-text {
          color: #2c3e50;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .testimonial-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .testimonial-info h4 {
          color: #2c3e50;
          margin-bottom: 0.2rem;
        }

        .testimonial-info p {
          color: #6c757d;
          font-size: 0.9rem;
        }

        /* FAQ Section */
        .faq-section {
          padding: 4rem 2rem;
          background: #f8f9fa;
        }

        .faq-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          background: white;
          margin-bottom: 1rem;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .faq-question {
          padding: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem;
          color: #6c757d;
          line-height: 1.8;
        }

        /* Footer CTA */
        .footer-cta {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .footer-cta h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .footer-cta p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.95;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .countdown-timer {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .countdown-number {
            font-size: 2rem;
            min-width: 80px;
          }

          .section-title {
            font-size: 2rem;
          }

          .tech-timeline::before {
            left: 0;
          }

          .tech-item:nth-child(odd),
          .tech-item:nth-child(even) {
            flex-direction: column;
          }

          .tech-content {
            margin: 0;
          }

          .tech-circle {
            left: 0;
            transform: translateX(0);
          }

          .form-container {
            padding: 2rem;
          }

          .comparison-table {
            font-size: 0.85rem;
          }

          .comparison-table th,
          .comparison-table td {
            padding: 0.8rem 0.5rem;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('landing-page-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const scrollToForm = () => {
    document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🔥 2025年最具潛力的美容事業機會</div>
          <h1 className="hero-title">
            不用囤貨、業績不歸零<br />
            把握<span className="hero-highlight">荷顏黃金創業期</span>
          </h1>
          <p className="hero-subtitle">
            韓國幹細胞技術 × 創新混合模式 × 初期市場紅利<br />
            傳統直銷做不到的，荷顏做到了
          </p>
          
          <div className="countdown-timer">
            <div className="countdown-item">
              <span className="countdown-number">2025</span>
              <span className="countdown-label">剛啟動</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">0</span>
              <span className="countdown-label">囤貨壓力</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">∞</span>
              <span className="countdown-label">業績累積</span>
            </div>
          </div>

          <div className="hero-cta">
            <button onClick={scrollToForm} className="cta-primary">
              🎯 立即加入 Line 諮詢，搶佔區域先機
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="section-container">
          <h2 className="section-title">做傳統直銷，你是否遇過這些困擾？</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">😰</div>
              <h3 className="problem-title">每月業績壓力</h3>
              <p className="problem-description">
                必須達到當月業績才能領取獎金，否則全部歸零。月底總是焦慮不安，擔心業績不達標。
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📦</div>
              <h3 className="problem-title">囤貨壓力大</h3>
              <p className="problem-description">
                為了保住階級或達成業績，不得不囤貨。家裡堆滿產品，資金壓力沉重。
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">🔄</div>
              <h3 className="problem-title">業績歸零重來</h3>
              <p className="problem-description">
                過去的努力無法累積，每個月都要從零開始。辛苦累積的業績，一夕歸零。
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📉</div>
              <h3 className="problem-title">市場已飽和</h3>
              <p className="problem-description">
                傳統品牌經營多年，市場競爭激烈。親友早已加入其他品牌，推薦困難重重。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section">
        <div className="section-container">
          <h2 className="section-title">荷顏全新模式，徹底解決這些問題</h2>
          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-icon">✅</div>
              <h3 className="solution-title">業績累積永不歸零</h3>
              <p className="solution-description">
                你的每一分努力都會被記錄和累積。不用擔心月底歸零，業績累積隨時可領。
              </p>
              <div className="solution-benefit">
                💰 真正的長期投資，努力永遠有價值
              </div>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🎯</div>
              <h3 className="solution-title">無當月業績限制</h3>
              <p className="solution-description">
                沒有每月必須達標的壓力。按照自己的節奏發展，不用為了保級而勉強。
              </p>
              <div className="solution-benefit">
                😌 零壓力經營，真正的事業自由
              </div>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🚫</div>
              <h3 className="solution-title">零囤貨壓力</h3>
              <p className="solution-description">
                不需要為了達成業績而囤貨。專注在真正需要產品的客戶，健康發展事業。
              </p>
              <div className="solution-benefit">
                💪 輕資產創業，風險最小化
              </div>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🌟</div>
              <h3 className="solution-title">市場空白期優勢</h3>
              <p className="solution-description">
                2025年剛啟動，你的親友圈還沒人做。現在加入就是區域先行者，搶佔最佳位置。
              </p>
              <div className="solution-benefit">
                🚀 初期紅利機會，錯過要再等10年
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="section-container">
          <h2 className="section-title">荷顏 vs 傳統直銷品牌</h2>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th style={{width: '30%'}}>比較項目</th>
                  <th style={{width: '35%'}}>傳統直銷品牌</th>
                  <th style={{width: '35%'}}>荷顏創新模式</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="comparison-label">獎金領取方式</td>
                  <td className="comparison-bad">❌ 當月必須達標才能領<br />未達標全部歸零</td>
                  <td className="comparison-good">✅ 累積制，隨時可領<br />永不歸零</td>
                </tr>
                <tr>
                  <td className="comparison-label">囤貨壓力</td>
                  <td className="comparison-bad">❌ 為保級必須囤貨<br />資金壓力大</td>
                  <td className="comparison-good">✅ 零囤貨壓力<br />輕鬆經營</td>
                </tr>
                <tr>
                  <td className="comparison-label">產品技術</td>
                  <td className="comparison-bad">⚠️ 植物萃取（傳統技術）<br />第一代護膚科技</td>
                  <td className="comparison-good">✅ 韓國幹細胞外秘體<br />第三代護膚科技</td>
                </tr>
                <tr>
                  <td className="comparison-label">市場飽和度</td>
                  <td className="comparison-bad">❌ 經營15-22年<br />市場高度飽和</td>
                  <td className="comparison-good">✅ 2025年啟動<br />市場空白期</td>
                </tr>
                <tr>
                  <td className="comparison-label">商業模式</td>
                  <td className="comparison-bad">⚠️ 傳統多層次直銷<br />階級壓力大</td>
                  <td className="comparison-good">✅ 創新混合模式<br />風險最低</td>
                </tr>
                <tr>
                  <td className="comparison-label">經營風險</td>
                  <td className="comparison-bad">❌ 高風險<br />囤貨+業績壓力</td>
                  <td className="comparison-good">✅ 低風險<br />無囤貨無壓力</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="section-container">
          <h2 className="section-title">三個世代的技術差異</h2>
          <div className="tech-timeline">
            <div className="tech-item">
              <div className="tech-content">
                <span className="tech-generation">第一代技術</span>
                <h3 className="tech-title">傳統植物萃取</h3>
                <p className="tech-description">
                  <strong>代表品牌：生麗國際、天麗生技</strong><br />
                  使用傳統植物萃取技術，雖然溫和但活性成分濃度有限，效果較慢且不穩定。這是20年前的技術標準。
                </p>
              </div>
              <div className="tech-circle"></div>
            </div>

            <div className="tech-item">
              <div className="tech-content">
                <span className="tech-generation">第二代技術</span>
                <h3 className="tech-title">低溫萃取技術</h3>
                <p className="tech-description">
                  <strong>代表：部分國際品牌</strong><br />
                  採用低溫萃取保留更多活性成分，效果提升但成本較高，市場應用有限。
                </p>
              </div>
              <div className="tech-circle"></div>
            </div>

            <div className="tech-item">
              <div className="tech-content">
                <span className="tech-generation" style={{background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'}}>第三代技術 ⭐</span>
                <h3 className="tech-title">幹細胞外秘體技術</h3>
                <p className="tech-description">
                  <strong>荷顏獨家採用</strong><br />
                  韓國最新幹細胞外秘體技術，是護膚科技的革命性突破。分子小、滲透快、效果顯著，這是未來10年的主流技術。<br /><br />
                  <strong style={{color: '#27ae60'}}>技術優勢：</strong> 比傳統植萃效果快3倍，成分活性高5倍，這就是世代差異！
                </p>
              </div>
              <div className="tech-circle" style={{borderColor: '#27ae60'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Section */}
      <section className="opportunity-section">
        <div className="section-container">
          <h2 className="section-title" style={{color: 'white'}}>為什麼現在是最佳時機？</h2>
          <div className="opportunity-grid">
            <div className="opportunity-card">
              <div className="opportunity-number">2025</div>
              <h3 className="opportunity-title">品牌剛啟動</h3>
              <p className="opportunity-description">
                市場空白期，你的親友圈還沒人做。現在加入就是區域先行者，搶佔最佳位置。
              </p>
            </div>
            <div className="opportunity-card">
              <div className="opportunity-number">100%</div>
              <h3 className="opportunity-title">市場可開發性</h3>
              <p className="opportunity-description">
                沒有競爭壓力，每個人都是潛在客戶。不像傳統品牌，親友早已被其他人推薦過。
              </p>
            </div>
            <div className="opportunity-card">
              <div className="opportunity-number">1st</div>
              <h3 className="opportunity-title">初期紅利優勢</h3>
              <p className="opportunity-description">
                品牌知名度建立期，公司資源全力支持。初期夥伴享有最多培訓和推廣資源。
              </p>
            </div>
            <div className="opportunity-card">
              <div className="opportunity-number">∞</div>
              <h3 className="opportunity-title">長期發展潛力</h3>
              <p className="opportunity-description">
                業績永不歸零的制度，讓你的努力真正累積。今天的付出，未來持續有回報。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="section-container">
          <h2 className="section-title">早期夥伴真實分享</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                我之前在某傳統直銷品牌做了3年，每個月都為了業績焦慮。加入荷顏後，完全沒有囤貨壓力，業績還能累積，這才是我理想中的事業模式！
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">Linda</div>
                <div className="testimonial-info">
                  <h4>Linda 陳</h4>
                  <p>前某直銷品牌經銷商 → 荷顏創始夥伴</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                幹細胞技術真的很有感！客戶用了都說比之前的產品效果好太多。市場反應超好，根本不用硬推銷，產品會自己說話。
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">Amy</div>
                <div className="testimonial-info">
                  <h4>Amy 王</h4>
                  <p>美容從業者 → 荷顏經銷夥伴</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                2025年初加入，現在已經發展了20多位客戶。因為是新品牌，大家都很有興趣。如果晚一年加入，這個優勢就沒了。真慶幸自己把握了機會！
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">Kevin</div>
                <div className="testimonial-info">
                  <h4>Kevin 林</h4>
                  <p>上班族 → 荷顏兼職創業者</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <h2 className="section-title">常見問題</h2>
          <div className="faq-container">
            <div className="faq-item">
              <div className="faq-question">
                Q: 真的不需要囤貨嗎？
                <span>▼</span>
              </div>
              <div className="faq-answer">
                A: 是的！荷顏採用累積制度，不需要為了達成業績而囤貨。您可以按照實際需求訂貨，專注在服務真正需要產品的客戶。
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                Q: 業績真的永不歸零嗎？
                <span>▼</span>
              </div>
              <div className="faq-answer">
                A: 沒錯！與傳統直銷不同，荷顏的業績會持續累積。即使某個月沒有達標，之前的業績依然保留，隨時可以領取獎金。
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                Q: 我沒有做過直銷，可以加入嗎？
                <span>▼</span>
              </div>
              <div className="faq-answer">
                A: 當然可以！荷顏的創新模式特別適合新手。我們提供完整的培訓支持，而且沒有傳統直銷的高壓和囤貨問題，讓您可以輕鬆起步。
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                Q: 現在加入真的有優勢嗎？
                <span>▼</span>
              </div>
              <div className="faq-answer">
                A: 絕對有！2025年剛啟動，市場空白期。您的親友圈還沒人做荷顏，現在加入就是區域先行者。想想看，生麗2002年、天麗2009年創立時的初期夥伴現在都怎麼樣了？
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                Q: 需要投資多少錢？
                <span>▼</span>
              </div>
              <div className="faq-answer">
                A: 荷顏的起步門檻很彈性，而且沒有囤貨壓力，不會有大量資金壓力。具體方案請聯繫我們，我們會根據您的情況提供最適合的建議。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Line Contact Section */}
      <section className="form-section" id="contact-form">
        <div className="form-container">
          <h2 className="form-title">🎯 立即加入諮詢</h2>
          <p style={{textAlign: 'center', color: '#6c757d', marginBottom: '2rem'}}>
            加入我們的 Line 官方帳號，立即獲得專業諮詢<br />
          </p>
          
          

          <a 
            href="https://line.me/R/ti/p/@lotus-beauty" 
            target="_blank" 
            rel="noopener noreferrer"
            className="form-submit"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              marginBottom: '1rem'
            }}
          >
            <span style={{fontSize: '1.5rem', marginRight: '0.5rem'}}>💬</span>
            加入 Line 立即諮詢
          </a>

          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '15px',
            marginTop: '2rem'
          }}>
            <h4 style={{
              color: '#2c3e50',
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>加入後您將獲得：</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '0.8rem 0',
                borderBottom: '1px solid #e9ecef',
                color: '#495057',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{color: '#27ae60', fontSize: '1.2rem'}}>✓</span>
                一對一專業顧問諮詢
              </li>
              <li style={{
                padding: '0.8rem 0',
                borderBottom: '1px solid #e9ecef',
                color: '#495057',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{color: '#27ae60', fontSize: '1.2rem'}}>✓</span>
                詳細獎金制度說明
              </li>
              <li style={{
                padding: '0.8rem 0',
                borderBottom: '1px solid #e9ecef',
                color: '#495057',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{color: '#27ae60', fontSize: '1.2rem'}}>✓</span>
                產品體驗與試用資訊
              </li>
              <li style={{
                padding: '0.8rem 0',
                color: '#495057',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{color: '#27ae60', fontSize: '1.2rem'}}>✓</span>
                說明會與培訓課程通知
              </li>
            </ul>
          </div>

          <p className="form-privacy">
            加入 Line 官方帳號即表示您同意接收相關資訊。我們重視您的隱私，不會將資料提供給第三方。
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <h2>別讓機會溜走</h2>
        <p>10年後回頭看，你會感謝今天做出的決定</p>
        <a 
          href="https://line.me/R/ti/p/@lotus-beauty" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cta-primary"
          style={{
            display: 'inline-block',
            textDecoration: 'none'
          }}
        >
          💬 立即加入 Line 諮詢
        </a>
        <p style={{marginTop: '2rem', fontSize: '0.9rem', opacity: '0.8'}}>
          Line 官方帳號 ID：@lotus-beauty
        </p>
      </section>
    </div>
  );
};

export default LotusBeautyLanding3;