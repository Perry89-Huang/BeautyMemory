/**
 * AI 推薦服務模組
 * 用於前端調用 AI 專家推薦系統
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * 獲取 AI 專家肌膚推薦
 * @param {Object} analysisResult - 肌膚分析結果
 * @param {string} userQuery - 用戶額外問題（可選）
 * @returns {Promise<Object>} AI 推薦結果
 */
export async function getAISkinRecommendation(analysisResult, userQuery = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/skin-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysisResult,
        userQuery
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '獲取 AI 推薦失敗');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('AI 推薦錯誤:', error);
    throw error;
  }
}

/**
 * AI 客服對話
 * @param {string} message - 用戶問題
 * @returns {Promise<Object>} AI 回應
 */
export async function chatWithAI(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'AI 對話失敗');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('AI 對話錯誤:', error);
    throw error;
  }
}

export default {
  getAISkinRecommendation,
  chatWithAI
};
