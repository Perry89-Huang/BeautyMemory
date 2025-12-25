// src/utils/timezone.js
// 台灣時區處理工具（前端）

/**
 * 將任何時間轉換為台灣時區的 Date 對象
 * @param {Date|string} date - 輸入時間
 * @returns {Date} 台灣時區的 Date 對象
 */
export function toTaiwanDate(date) {
  const d = new Date(date);
  // 使用 Intl API 轉換為台灣時區
  return new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
}

/**
 * 格式化為台灣時間顯示（完整格式）
 * @param {Date|string} date - 輸入時間
 * @param {Object} options - 格式選項
 * @returns {string} 格式化的台灣時間字符串
 */
export function formatTaiwanTime(date, options = {}) {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    
    // 檢查日期是否有效
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date);
      return 'Invalid Date';
    }
    
    const defaultOptions = {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return d.toLocaleString('zh-TW', { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Error formatting Taiwan time:', error, date);
    return 'Error';
  }
}

/**
 * 格式化為台灣日期（不含時間）
 * @param {Date|string} date - 輸入時間
 * @returns {string} 格式化的日期字符串
 */
export function formatTaiwanDate(date) {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    
    // 檢查日期是否有效
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date);
      return 'Invalid Date';
    }
    
    return d.toLocaleDateString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting Taiwan date:', error, date);
    return 'Error';
  }
}

/**
 * 獲取台灣當前時間的 ISO 字符串（用於文件名等）
 * @returns {string} YYYY-MM-DD 格式
 */
export function getTaiwanDateString() {
  const d = toTaiwanDate(new Date());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 獲取完整的台灣時間戳（用於本地存儲）
 * @returns {string} ISO 格式的台灣時間字符串
 */
export function getTaiwanTimestamp() {
  const now = new Date();
  return now.toLocaleString('sv-SE', { timeZone: 'Asia/Taipei' }).replace(' ', 'T') + '+08:00';
}
