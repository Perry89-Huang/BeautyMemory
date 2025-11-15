import React, { useState, useEffect } from 'react';

const Heyan28DaysLanding = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  // 倒數計時器
  useEffect(() => {
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 7);

    const updateCountdown = () => {
      const now = new Date();
      const distance = endTime - now;

      if (distance < 0) {
        endTime.setDate(endTime.getDate() + 7);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // 浮動CTA控制
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setShowFloatingCTA(window.pageYOffset > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const trackConversion = (location) => {
    console.log('Conversion tracked from:', location);
    // Facebook Pixel tracking can be added here
    // fbq('track', 'InitiateCheckout', { ... });
  };

  const faqData = [
    {
      question: '真的28天就能年輕5-10歲嗎？',
      answer: '是的！荷顏採用幹細胞外泌體+SOD雙科技，直達細胞層級進行修護。根據用戶回饋，持續使用28天後，細紋淡化70-80%，膚色提亮2個色階，整體視覺年齡逆轉5-10歲。當然，每個人膚質基礎不同，實際效果會有差異，但絕大多數用戶都能看到明顯改善。'
    },
    {
      question: '和醫美比起來，效果如何？',
      answer: '醫美是「外力介入」，荷顏是「激活自身」。醫美效果快但需要恢復期、有風險、而且會逐漸消退。荷顏透過幹細胞外泌體激活你自己的細胞再生能力，效果自然持久，而且沒有任何副作用。許多用戶表示，持續使用荷顏的效果不輸醫美，但價格只要1/3，而且更安全。'
    },
    {
      question: '什麼是幹細胞外泌體？安全嗎？',
      answer: '外泌體是細胞釋放的「信使囊泡」，攜帶生長因子、蛋白質等生物活性物質，可以傳遞「年輕化」指令給肌膚細胞。這是2013年諾貝爾生理醫學獎的研究成果，已被廣泛應用於醫美和再生醫學。荷顏使用的是百年野山蔘幹細胞外泌體，經過SGS全項檢測，安全性極高，孕婦、哺乳期、敏感肌都可以使用。'
    },
    {
      question: '我40多歲了，還有效嗎？',
      answer: '當然有效！40-50歲是最需要細胞級抗老的階段。我們有很多40-50歲的用戶，使用28天後效果都非常明顯。有位42歲的用戶說：「同事都問我是不是去打了什麼針！」細胞有自我修復能力，只要用對方法激活它，任何年齡都能看到改善。'
    },
    {
      question: '需要配合其他產品使用嗎？',
      answer: '不需要！荷顏是四效合一的全方位護理（修護、抗老、美白、舒緩），單獨使用就有很好的效果。如果你想搭配其他基礎保養品也完全沒問題。建議：洗臉後直接使用荷顏，讓幹細胞外泌體和SOD充分發揮作用。'
    },
    {
      question: '28天後還需要繼續使用嗎？',
      answer: '建議持續使用！28天是「看到明顯效果」的週期，但細胞抗老是持續的過程。就像運動健身一樣，不能練28天就停止。持續使用可以維持年輕狀態，甚至繼續改善。而且復購只要$3,800，CP值非常高。許多用戶已經持續使用3-6個月，效果越來越好！'
    },
  ];

  const testimonials = [
    {
      name: '陳小姐',
      age: '42歲',
      type: '熟齡肌 | 台北',
      days: '28天完成',
      rating: 5,
      content: '用了28天，同事都問我是不是去打了什麼針！其實我什麼醫美都沒做，就是每天用荷顏。現在照鏡子都覺得自己年輕了至少7-8歲，細紋真的淡化很多，臉也變緊緻了。最開心的是老公也說我變年輕了！',
      results: [
        '法令紋淡化 70%',
        '眼周細紋幾乎消失',
        '臉部輪廓明顯提升',
        '膚色亮白 2個色階'
      ]
    },
    {
      name: '林小姐',
      age: '38歲',
      type: '混合肌 | 新竹',
      days: '28天完成',
      rating: 5,
      content: '我之前用過很多抗老產品，效果都不明顯。荷顏真的不一樣！第2週就感覺皮膚變緊緻了，到第4週整個人像換了一個人。朋友聚會大家都驚呼：你怎麼越來越年輕？真的很有成就感！',
      results: [
        '整體年輕 8-10歲',
        '毛孔縮小 60%',
        '肌膚彈性大幅提升',
        '素顏也有好氣色'
      ]
    },
    {
      name: '張小姐',
      age: '35歲',
      type: '敏感肌 | 台中',
      days: '28天完成',
      rating: 5,
      content: '敏感肌真的很難找到適合的抗老產品。荷顏完全不刺激，而且效果驚人！用了4週，不只細紋淡化，連敏感問題都改善了。現在皮膚又嫩又亮，比5年前還好。真心推薦給所有想變年輕的姊妹！',
      results: [
        '細紋淡化 80%',
        '敏感泛紅大幅改善',
        '肌膚質感提升明顯',
        '年輕 6-7歲'
      ]
    }
  ];

  const timelineData = [
    {
      day: 7,
      title: '🌟 細胞甦醒期',
      badge: '第1週',
      description: '幹細胞外泌體開始進入肌底，激活沉睡的細胞再生機制。SOD抗氧化系統開始清除累積的自由基。',
      results: [
        '膚色開始變亮，暗沉改善',
        '肌膚觸感變得柔軟細緻',
        '細胞代謝速度提升',
        '輕微細紋開始淡化'
      ]
    },
    {
      day: 14,
      title: '✨ 深層修護期',
      badge: '第2週',
      description: '細胞再生機制全面啟動，膠原蛋白和彈力蛋白開始增生。肌膚屏障功能顯著改善。',
      results: [
        '細紋明顯淡化 40-50%',
        '毛孔收縮，肌膚細緻度提升',
        '膚色提亮 1-2 個色階',
        '肌膚彈性開始恢復',
        '痘印、色斑開始淡化'
      ]
    },
    {
      day: 21,
      title: '🎯 緊緻塑形期',
      badge: '第3週',
      description: '新生膠原蛋白開始重組肌膚結構，輪廓線條明顯提升。深層修護效果開始顯現。',
      results: [
        '細紋淡化 60-70%',
        '臉部輪廓緊緻提升',
        '肌膚飽滿度明顯增加',
        '毛孔縮小 50% 以上',
        '肌膚質感接近年輕狀態'
      ]
    },
    {
      day: 28,
      title: '🏆 逆齡完成期',
      badge: '第4週',
      description: '細胞再生循環建立完成，肌膚年齡逆轉 5-10 歲。達到穩定的年輕化狀態。',
      results: [
        '整體年輕 5-10 歲',
        '細紋幾乎完全淡化',
        '肌膚緊緻度大幅提升',
        '自然光澤感，素顏也美',
        '朋友都問：做了什麼醫美？'
      ]
    }
  ];

  return (
    <div style={{ fontFamily: "'Microsoft JhengHei', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 浮動CTA */}
      {showFloatingCTA && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          padding: '15px',
          textAlign: 'center',
          zIndex: 1000,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.5s ease'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
            🔥 28天逆齡計畫 限時優惠
          </div>
          <a 
            href="https://lin.ee/Ubulr5Z" 
            onClick={() => trackConversion('floating_cta')}
            style={{
              background: 'white',
              color: '#e74c3c',
              padding: '12px 30px',
              border: 'none',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            立即開始逆齡 $4,980
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '60px 20px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'rgba(231, 76, 60, 0.9)',
            color: 'white',
            padding: '10px 25px',
            borderRadius: '30px',
            fontSize: '15px',
            fontWeight: '700',
            display: 'inline-block',
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)'
          }}>
            🧬 細胞級抗老革命
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: '1.3',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            不用醫美、不打針
            <span style={{
              color: '#ffd700',
              fontSize: '52px',
              display: 'block',
              margin: '10px 0'
            }}>
              28天年輕 5-10歲
            </span>
            的秘密
          </h1>

          <p style={{
            fontSize: '22px',
            marginBottom: '35px',
            opacity: '0.95',
            lineHeight: '1.6'
          }}>
            幹細胞外泌體 + SOD 雙科技<br />
            直達細胞核心，激活再生機制<br />
            讓年齡只是數字，不是外表
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            margin: '35px 0',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: '🧬', title: '幹細胞外泌體', desc: '細胞層級修護' },
              { icon: '🛡️', title: 'SOD抗氧化', desc: '清除老化因子' },
              { icon: '⚡', title: '28天見效', desc: '明顯年輕化' }
            ].map((badge, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '20px 30px',
                borderRadius: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                minWidth: '200px'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>{badge.icon}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px' }}>{badge.title}</div>
                <div style={{ fontSize: '13px', opacity: '0.9' }}>{badge.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px' }}>
            <a 
              href="https://lin.ee/Ubulr5Z" 
              onClick={() => trackConversion('hero_primary')}
              style={{
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                padding: '20px 50px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(231, 76, 60, 0.4)',
                display: 'inline-block',
                textDecoration: 'none',
                margin: '5px'
              }}
            >
              🚀 立即開始28天逆齡計畫
            </a>
          </div>

          <div style={{ marginTop: '30px', fontSize: '14px', opacity: '0.9' }}>
            ✓ SGS檢測合格 | ✓ 全台免運
          </div>
        </div>
      </section>


      {/* 28天時間軸 */}
      <section style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '15px',
            color: '#2c3e50'
          }}>
            📅 28天逆齡時間軸
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#7f8c8d',
            fontSize: '18px',
            marginBottom: '60px'
          }}>
            看得見的改變，一天比一天年輕
          </p>

          <div style={{ position: 'relative', padding: '40px 20px' }}>
            {/* 中間的連接線 */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '40px',
              bottom: '40px',
              width: '2px',
              background: 'linear-gradient(180deg, #3498db, #e74c3c)',
              transform: 'translateX(-50%)',
              zIndex: 0
            }}></div>

            {timelineData.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                marginBottom: '80px',
                position: 'relative',
                flexDirection: index % 2 === 0 ? 'row-reverse' : 'row',
                alignItems: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '0',
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #3498db, #e74c3c)',
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: '0 6px 20px rgba(52, 152, 219, 0.5)',
                  border: '5px solid white',
                  zIndex: 10
                }}>
                  <div style={{ fontSize: '11px', opacity: '0.9' }}>Day</div>
                  <div style={{ fontSize: '22px', marginTop: '-2px' }}>{item.day}</div>
                </div>

                <div style={{
                  width: '42%',
                  background: 'white',
                  padding: '30px',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  [index % 2 === 0 ? 'marginRight' : 'marginLeft']: 'auto',
                  [index % 2 === 0 ? 'marginLeft' : 'marginRight']: '8%',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: '700',
                    display: 'inline-block',
                    marginBottom: '15px'
                  }}>
                    {item.badge}
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#2c3e50',
                    marginBottom: '15px'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: '#555',
                    lineHeight: '1.8',
                    marginBottom: '15px'
                  }}>
                    {item.description}
                  </p>
                  <div style={{
                    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                    padding: '15px',
                    borderRadius: '12px',
                    marginTop: '15px'
                  }}>
                    <strong>明顯改善：</strong>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                      {item.results.map((result, i) => (
                        <li key={i} style={{
                          padding: '5px 0',
                          paddingLeft: '25px',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: '#27ae60',
                            fontWeight: '700'
                          }}>✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 科技解析 */}
      <section style={{
        padding: '80px 20px',
        background: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '15px',
            color: '#2c3e50'
          }}>
            🔬 雙科技如何讓你年輕 5-10 歲？
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#7f8c8d',
            fontSize: '18px',
            marginBottom: '50px'
          }}>
            不是表面功夫，而是細胞層級的真正逆齡
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginTop: '50px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              padding: '40px',
              borderRadius: '25px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              borderTop: '5px solid #3498db'
            }}>
              <span style={{ fontSize: '64px', marginBottom: '20px', display: 'block' }}>🧬</span>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '20px'
              }}>
                幹細胞外泌體
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#e74c3c',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                The Cell Regeneration Technology
              </p>
              <p style={{ marginBottom: '20px', color: '#555', lineHeight: '1.8' }}>
                外泌體是細胞間的「信使」，攜帶生長因子、蛋白質等生物活性物質，直接傳遞「年輕化」指令給肌膚細胞。
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  { title: '直達細胞核：', desc: '30-150nm超微粒徑，完美滲透至基底層' },
                  { title: '激活再生：', desc: '啟動細胞自我修復和再生機制' },
                  { title: '膠原增生：', desc: '促進膠原蛋白合成，提升肌膚彈性' },
                  { title: '快速見效：', desc: '7-14天即可感受明顯改善' },
                  { title: '溫和高效：', desc: '零刺激，所有膚質都適用' }
                ].map((feature, i) => (
                  <li key={i} style={{
                    padding: '12px 0',
                    paddingLeft: '35px',
                    position: 'relative',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '15px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      fontSize: '20px'
                    }}>🔬</span>
                    <strong>{feature.title}</strong> {feature.desc}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              padding: '40px',
              borderRadius: '25px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              borderTop: '5px solid #e74c3c'
            }}>
              <span style={{ fontSize: '64px', marginBottom: '20px', display: 'block' }}>🛡️</span>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '20px'
              }}>
                SOD 抗氧化系統
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#e74c3c',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                The Anti-Aging Defense System
              </p>
              <p style={{ marginBottom: '20px', color: '#555', lineHeight: '1.8' }}>
                超氧化物歧化酶（SOD）是人體最強的抗氧化酵素，清除自由基效果是維生素E的20倍！
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  { title: '清除自由基：', desc: '中和導致老化的氧化壓力' },
                  { title: '延緩衰老：', desc: '減少細胞DNA損傷，延長細胞壽命' },
                  { title: '防禦保護：', desc: '建立強大的抗氧化防護屏障' },
                  { title: '提亮膚色：', desc: '抑制黑色素，改善暗沉' },
                  { title: '持續守護：', desc: '24小時抗老化防護' }
                ].map((feature, i) => (
                  <li key={i} style={{
                    padding: '12px 0',
                    paddingLeft: '35px',
                    position: 'relative',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '15px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      fontSize: '20px'
                    }}>🔬</span>
                    <strong>{feature.title}</strong> {feature.desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '50px',
            padding: '40px',
            background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
            borderRadius: '20px'
          }}>
            <h3 style={{
              fontSize: '26px',
              marginBottom: '20px',
              color: '#2c3e50'
            }}>
              💡 為什麼需要「雙科技」？
            </h3>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#555',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <strong>單一技術不夠！</strong>只修護不防護，效果會被自由基抵消。<br />
              <strong>幹細胞外泌體</strong>負責「進攻」→ 激活細胞再生<br />
              <strong>SOD抗氧化系統</strong>負責「防守」→ 清除老化因子<br /><br />
              攻守兼備，才能達到真正的逆齡效果！
            </p>
          </div>
        </div>
      </section>

      {/* 用戶見證 */}
      <section style={{
        padding: '80px 20px',
        background: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '15px',
            color: '#2c3e50'
          }}>
            💬 她們的28天逆齡旅程
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#7f8c8d',
            fontSize: '18px',
            marginBottom: '50px'
          }}>
            真實用戶分享，看得見的年輕
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '35px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '24px',
                    marginRight: '15px'
                  }}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: '18px',
                      marginBottom: '5px',
                      color: '#2c3e50'
                    }}>
                      {testimonial.name} {testimonial.age}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#7f8c8d'
                    }}>
                      {testimonial.type}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    padding: '6px 15px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {testimonial.days}
                  </div>
                </div>

                <div style={{
                  color: '#f39c12',
                  fontSize: '18px',
                  marginBottom: '15px'
                }}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>

                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: '#555',
                  marginBottom: '20px'
                }}>
                  {testimonial.content}
                </p>

                <div style={{
                  background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                  padding: '20px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #f39c12'
                }}>
                  <div style={{
                    fontWeight: '700',
                    color: '#2c3e50',
                    marginBottom: '10px'
                  }}>
                    📊 28天成果：
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {testimonial.results.map((result, i) => (
                      <li key={i} style={{
                        padding: '5px 0',
                        fontSize: '14px',
                        color: '#555'
                      }}>
                        ✓ {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a 
              href="https://lin.ee/Ubulr5Z" 
              onClick={() => trackConversion('testimonial_cta')}
              style={{
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                color: 'white',
                padding: '18px 40px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(231, 76, 60, 0.4)',
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              💫 我也要開始28天逆齡
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: '80px 20px',
        background: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '15px',
            color: '#2c3e50'
          }}>
            ❓ 常見問題
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#7f8c8d',
            fontSize: '18px',
            marginBottom: '50px'
          }}>
            解答你的所有疑問
          </p>

          {faqData.map((faq, index) => (
            <div key={index} style={{
              background: 'white',
              marginBottom: '15px',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
            }}>
              <div 
                onClick={() => toggleFAQ(index)}
                style={{
                  padding: '25px 30px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '17px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: activeFAQ === index ? '#f8f9fa' : 'white'
                }}
              >
                <span>{faq.question}</span>
                <span style={{
                  fontSize: '24px',
                  transition: 'transform 0.3s ease',
                  transform: activeFAQ === index ? 'rotate(180deg)' : 'rotate(0)'
                }}>
                  ▼
                </span>
              </div>
              <div style={{
                maxHeight: activeFAQ === index ? '500px' : '0',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                padding: activeFAQ === index ? '25px 30px' : '0 30px',
                color: '#555',
                lineHeight: '1.8'
              }}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 最終CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', marginBottom: '20px' }}>
            ⏰ 不要讓「早知道」成為遺憾
          </h2>
          <p style={{ fontSize: '22px', marginBottom: '40px', opacity: '0.95' }}>
            每天延遲，就多一天老化<br />
            現在開始，28天後遇見更年輕的自己
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '25px',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            <div style={{
              fontSize: '42px',
              fontWeight: '700',
              marginBottom: '15px'
            }}>
              $4,980
            </div>
            <div style={{
              fontSize: '18px',
              opacity: '0.9',
              marginBottom: '25px'
            }}>
              荷顏靚膚液 3瓶組<br />
              28天逆齡計畫
            </div>
            <a 
              href="https://lin.ee/Ubulr5Z" 
              onClick={() => trackConversion('final_cta')}
              style={{
                background: 'white',
                color: '#e74c3c',
                padding: '22px 55px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '22px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              🚀 立即開始逆齡旅程
            </a>
            <div style={{
              marginTop: '25px',
              fontSize: '14px',
              opacity: '0.9'
            }}>
               ✓ 全台免運 | ✓ SGS檢測合格
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <section style={{
        background: '#2c3e50',
        color: 'white',
        padding: '40px 20px 150px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '20px' }}>🌸 荷顏 Lotus Beauty</h3>
          <p style={{ opacity: '0.9', marginBottom: '10px' }}>讓美麗不被條件局限</p>
          <p style={{ opacity: '0.8', fontSize: '14px', marginBottom: '25px' }}>台灣天然調膚專家 × 韓國幹細胞科技</p>
          
          <div style={{ marginBottom: '25px' }}>
            <a 
              href="https://lin.ee/Ubulr5Z" 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '12px 30px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                border: '2px solid white',
                transition: 'all 0.3s ease',
                marginRight: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e74c3c';
                e.target.style.borderColor = '#e74c3c';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.borderColor = 'white';
              }}
            >
              📱 荷顏 官網
            </a>

          </div>

          <p style={{ opacity: '0.7', fontSize: '13px' }}>
            歡迎造訪 荷顏 的官方網站，深入了解荷顏的品牌故事、產品詳情
          </p>
        </div>
      </section>
    </div>
  );
};

export default Heyan28DaysLanding;
