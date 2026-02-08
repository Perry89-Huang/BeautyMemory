# Google OAuth 在 LINE 內建瀏覽器的問題解決方案

## 問題描述

當用戶透過 LINE 分享的連結開啟網站時，會使用 LINE 的內建瀏覽器（WebView）。Google 基於安全考量，會封鎖來自特定 WebView 的 OAuth 請求，導致出現錯誤：

```
已封鎖存取權：「Web application」的要求不符合 Google 政策
Error 403: disallowed_useragent
```

## 已實施的解決方案

### 1. 自動檢測內建瀏覽器
在 `MemberAuth.jsx` 中加入了 `isInAppBrowser()` 函數，可以檢測：
- LINE 內建瀏覽器
- Facebook 內建瀏覽器
- Instagram 內建瀏覽器
- Twitter 內建瀏覽器
- 其他 WebView 環境

### 2. 友善的錯誤提示
當檢測到用戶在內建瀏覽器中嘗試使用 Google 登入時，會顯示：
- 清楚的錯誤訊息
- 提供複製網址的選項
- 指引用戶在外部瀏覽器開啟

### 3. 預防性提示
在 Google 登入按鈕下方會顯示警告訊息，提醒用戶需要在外部瀏覽器使用。

## 使用方式

### 用戶操作指引

#### 在 LINE 中開啟連結時：

1. **方法一：使用右上角選單**
   - 點擊右上角的「⋯」
   - 選擇「在瀏覽器中開啟」或「在 Safari 中開啟」
   - 在正常瀏覽器中使用 Google 登入

2. **方法二：複製網址**
   - 嘗試 Google 登入時會收到錯誤提示
   - 系統會詢問是否要複製網址
   - 點擊確認後，在 Safari/Chrome 中貼上網址開啟

3. **方法三：使用 Email 登入**
   - 不受瀏覽器限制
   - 可以在 LINE 內建瀏覽器中正常使用

### 技術實作細節

```javascript
// 檢測內建瀏覽器
const isInAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  
  if (ua.includes('Line/') || ua.includes('LIFF/')) {
    return 'LINE';
  }
  // ... 其他檢測
  return null;
};

// 在 Google 登入時檢查
const handleGoogleLogin = async () => {
  const inAppBrowser = isInAppBrowser();
  if (inAppBrowser) {
    // 顯示錯誤訊息並提供解決方案
    setMessage({
      type: 'error',
      text: `⚠️ 無法在 ${inAppBrowser} 內建瀏覽器使用 Google 登入\n\n請點擊右上角「...」選擇「在瀏覽器中開啟」`
    });
    return;
  }
  // 繼續正常的 OAuth 流程
};
```

## 測試工具

訪問 `/browser-detection.html` 可以檢測當前瀏覽器環境，確認是否支援 Google OAuth。

## 替代方案

如果用戶堅持在 LINE 內建瀏覽器使用，可以：

1. **使用 Email + 密碼註冊/登入**
   - 不受瀏覽器限制
   - 功能完全相同

2. **使用 LIFF (LINE Front-end Framework)**
   - 需要申請 LINE Login Channel
   - 可以在 LINE 內建瀏覽器中使用 LINE 登入
   - 需要額外開發成本

## 其他受影響的平台

相同的問題也會出現在：
- Facebook Messenger 內建瀏覽器
- Instagram 內建瀏覽器
- Twitter 內建瀏覽器
- WeChat 內建瀏覽器

所有這些都已在 `isInAppBrowser()` 函數中處理。

## Google Cloud Console 設定檢查

確保在 Google Cloud Console 中：

1. **已授權的重新導向 URI**
   ```
   https://你的域名/
   https://你的域名/auth/callback
   https://你的域名/oauth-test.html
   ```

2. **已授權的 JavaScript 來源**
   ```
   https://你的域名
   ```

3. **OAuth 同意畫面**
   - 確認應用程式名稱正確
   - 添加必要的範圍（email, profile）
   - 如果是測試模式，添加測試使用者

## 常見問題

### Q: 為什麼 Google 要封鎖 WebView？
A: 基於安全考量，Google 認為 WebView 環境較難確保安全性，容易被惡意應用程式利用來竊取帳號資訊。

### Q: 可以繞過這個限制嗎？
A: 技術上可以修改 User Agent，但這違反 Google 的使用條款，且可能隨時被封鎖。不建議這樣做。

### Q: 使用 Email 登入和 Google 登入有什麼差別？
A: 功能完全相同，只是登入方式不同。Google 登入更方便（不需記密碼），但 Email 登入相容性更好。

### Q: 未來會支援 LINE Login 嗎？
A: 可以考慮整合 LINE Login，但需要額外的開發成本和 LINE 官方審核。

## 相關檔案

- `src/components/MemberAuth.jsx` - 會員登入元件（包含檢測邏輯）
- `public/browser-detection.html` - 瀏覽器檢測工具
- `src/BeautyMemoryWebsiteWithAuth.jsx` - 主要應用程式檔案

## 參考資料

- [Google Identity: User Agent Policy](https://developers.google.com/identity/protocols/oauth2/policies)
- [OAuth 2.0 for Mobile & Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app)
