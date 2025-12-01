import React, { useState, useRef, useEffect } from 'react';

const LotusBeautyAICustomerService = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '您好！我是荷顏智能客服小荷 🌸\n\n很高興為您服務！我可以協助您了解：\n• 產品資訊與成分說明\n• 使用方法與保養建議\n• 訂購流程與優惠活動\n• 配送與退換貨政策\n\n請問有什麼可以幫助您的呢？'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // 荷顏產品知識庫
  const knowledgeBase = {
    products: {
      mainProduct: '荷顏野山蔘調膚品',
      features: ['韓國幹細胞外秘體技術', '台灣野山蔘精華', '四效合一配方', '天然植萃成分'],
      benefits: ['深層保濕', '緊緻提拉', '淡化細紋', '改善膚質']
    },
    company: {
      name: '荷顏 Lotus Beauty',
      slogan: '全面改寫肌膚年齡',
      positioning: '韓國幹細胞技術 × 台灣植萃專家',
      website: 'https://lotusbeauty.life/'
    },
    faq: [
      {
        question: '產品特色',
        keywords: ['特色', '優勢', '差別', '不同', '特點'],
        answer: '荷顏的核心優勢在於結合了韓國先進的幹細胞外秘體技術與台灣珍貴的野山蔘精華。我們的產品採用四效合一配方，能同時達到深層保濕、緊緻提拉、淡化細紋、改善膚質的效果。所有成分都是天然植萃，溫和不刺激，適合各種膚質使用。'
      },
      {
        question: '使用方法',
        keywords: ['怎麼用', '使用', '塗抹', '用法', '步驟'],
        answer: '使用方法很簡單：\n\n1️⃣ 清潔：徹底清潔臉部\n2️⃣ 取量：取適量產品於掌心\n3️⃣ 塗抹：均勻塗抹於臉部與須部\n4️⃣ 按摩：輕柔按摩至完全吸收\n\n建議早晚各使用一次，持續使用效果更佳。敏感肌膚建議先在耳後測試。'
      },
      {
        question: '價格與訂購',
        keywords: ['價格', '多少錢', '費用', '訂購', '購買', '下單'],
        answer: '關於價格與訂購資訊，建議您：\n\n📱 直接訪問官網：https://lotusbeauty.life/\n📞 或聯繫我們的專業顧問，他們會為您提供最新的優惠方案與詳細說明\n\n我們經常推出限時優惠活動，現在諮詢可能有特別優惠喔！'
      },
      {
        question: '配送與退換貨',
        keywords: ['配送', '運送', '物流', '退貨', '換貨', '退換'],
        answer: '📦 配送政策：\n• 台灣本島：3-5個工作天\n• 離島地區：5-7個工作天\n• 滿額免運優惠（請洽客服）\n\n🔄 退換貨政策：\n• 收到商品7天內可退換貨\n• 商品需保持完整包裝\n• 詳細條款請參考官網或洽詢客服'
      },
      {
        question: '適用膚質',
        keywords: ['膚質', '敏感肌', '油性', '乾性', '混合肌', '適合'],
        answer: '荷顏調膚品採用溫和天然配方，適合各種膚質：\n\n✅ 敏感肌：天然植萃，溫和不刺激\n✅ 乾性肌：深層保濕，改善乾燥\n✅ 油性肌：調理油水平衡\n✅ 混合肌：全面調理改善\n✅ 熟齡肌：緊緻提拉，淡化細紋\n\n建議首次使用先進行肌膚測試。'
      },
      {
        question: '成分說明',
        keywords: ['成分', '含有', '原料', '材料', '幹細胞', '野山蔘'],
        answer: '🌿 核心成分：\n\n• 韓國幹細胞外秘體：促進肌膚再生，提升修護力\n• 台灣野山蔘精華：珍貴植萃，深層滋養\n• 天然保濕因子：鎖水保濕，持久滋潤\n• 植物性胜肽：緊緻提拉，改善彈性\n\n所有成分均經過嚴格檢驗，安全無慮。'
      }
    ]
  };

  // 快速問題按鈕
  const quickQuestions = [
    '產品有什麼特色？',
    '如何使用？',
    '適合什麼膚質？',
    '價格與訂購方式？'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI 回應邏輯
  const generateAIResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 關鍵字匹配
    for (const faq of knowledgeBase.faq) {
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return faq.answer;
      }
    }

    // 問候語
    if (lowerMessage.match(/你好|哈囉|嗨|您好|hi|hello/)) {
      return '您好！很高興為您服務 🌸\n\n我是荷顏智能客服，請問有什麼可以幫助您的呢？您可以詢問產品資訊、使用方法、訂購流程等問題。';
    }

    // 感謝語
    if (lowerMessage.match(/謝謝|感謝|thanks/)) {
      return '不客氣！很高興能幫助您 😊\n\n如果還有其他問題，隨時歡迎詢問。祝您使用愉快！';
    }

    // 真人客服轉接
    if (lowerMessage.match(/真人|人工|客服人員|專員/)) {
      return '💁‍♀️ 為您轉接真人客服\n\n請稍候，我們的專業顧問將盡快為您服務。\n\n或者您也可以直接撥打客服專線，我們將竭誠為您解答！';
    }

    // 使用 Claude API 進行智能回應
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [
            { 
              role: "user", 
              content: `你是荷顏（Lotus Beauty）的專業客服人員。請用繁體中文回答以下問題。

公司資訊：
- 品牌：荷顏 Lotus Beauty
- 定位：韓國幹細胞技術 × 台灣植萃專家
- 主打產品：野山蔘調膚品
- 核心技術：韓國幹細胞外秘體技術 + 台灣野山蔘精華
- 產品特色：四效合一（深層保濕、緊緻提拉、淡化細紋、改善膚質）

客戶問題：${userMessage}

請以親切、專業的態度回答，控制在150字以內。如果問題涉及具體價格或訂購，建議客戶訪問官網 https://lotusbeauty.life/ 或聯繫專業顧問。`
            }
          ]
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('API Error:', error);
      return '抱歉，我目前遇到一些技術問題 😅\n\n建議您：\n• 訪問官網：https://lotusbeauty.life/\n• 或直接聯繫我們的客服團隊\n\n我們將竭誠為您服務！';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // 添加用戶訊息
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }]);

    setIsLoading(true);

    // 生成AI回應
    const aiResponse = await generateAIResponse(userMessage);

    // 添加AI回應
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: aiResponse
    }]);

    setIsLoading(false);
  };

  const handleQuickQuestion = async (question) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: question
    }]);

    setIsLoading(true);
    const aiResponse = await generateAIResponse(question);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: aiResponse
    }]);

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 聊天按鈕 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-bubble"
          aria-label="開啟客服對話"
        >
          <span className="chat-icon">💬</span>
          <span className="chat-badge">AI</span>
        </button>
      )}

      {/* 聊天視窗 */}
      {isOpen && (
        <div className="chat-container">
          {/* 標題列 */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🌸</div>
              <div>
                <div className="chat-title">荷顏智能客服</div>
                <div className="chat-status">● 線上服務中</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="chat-close"
              aria-label="關閉對話"
            >
              ✕
            </button>
          </div>

          {/* 訊息區域 */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="message-avatar">🌸</div>
                )}
                <div className="message-content">
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="message-avatar message-avatar-user">👤</div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="message message-assistant">
                <div className="message-avatar">🌸</div>
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 快速問題 */}
          {messages.length <= 1 && (
            <div className="quick-questions">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="quick-question-btn"
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* 輸入區域 */}
          <div className="chat-input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入您的問題..."
              className="chat-input"
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="chat-send-btn"
              disabled={!inputMessage.trim() || isLoading}
            >
              發送
            </button>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* 聊天氣泡按鈕 */
        .chat-bubble {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
          z-index: 9998;
        }

        .chat-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
        }

        .chat-icon {
          font-size: 28px;
        }

        .chat-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e74c3c;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: bold;
        }

        /* 聊天容器 */
        .chat-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9999;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 標題列 */
        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .chat-title {
          font-weight: 600;
          font-size: 16px;
        }

        .chat-status {
          font-size: 12px;
          opacity: 0.9;
        }

        .chat-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .chat-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        /* 訊息區域 */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fa;
        }

        .message {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-assistant {
          justify-content: flex-start;
        }

        .message-user {
          justify-content: flex-end;
        }

        .message-avatar {
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-avatar-user {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .message-assistant .message-content {
          background: white;
          color: #2c3e50;
          border-bottom-left-radius: 4px;
        }

        .message-user .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }

        /* 打字指示器 */
        .typing-indicator {
          display: flex;
          gap: 5px;
          padding: 16px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        /* 快速問題 */
        .quick-questions {
          padding: 10px 20px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #f8f9fa;
        }

        .quick-question-btn {
          background: white;
          border: 1px solid #e9ecef;
          padding: 10px 15px;
          border-radius: 20px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #667eea;
        }

        .quick-question-btn:hover:not(:disabled) {
          background: #667eea;
          color: white;
          border-color: #667eea;
          transform: translateX(5px);
        }

        .quick-question-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* 輸入區域 */
        .chat-input-container {
          padding: 15px 20px;
          background: white;
          border-top: 1px solid #e9ecef;
          display: flex;
          gap: 10px;
        }

        .chat-input {
          flex: 1;
          border: 1px solid #e9ecef;
          border-radius: 20px;
          padding: 10px 15px;
          font-size: 14px;
          resize: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Microsoft JhengHei', 'Segoe UI', sans-serif;
          max-height: 100px;
        }

        .chat-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .chat-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }

        .chat-send-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .chat-send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* 滾動條樣式 */
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 10px;
        }

        /* 手機適配 */
        @media (max-width: 768px) {
          .chat-container {
            width: 100%;
            height: 100%;
            bottom: 0;
            right: 0;
            border-radius: 0;
          }

          .chat-bubble {
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default LotusBeautyAICustomerService;