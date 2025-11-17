# API 測試指南

## 問題診斷：400 Bad Request

### 可能原因：

1. **圖片格式問題**
   - API 可能只接受特定格式 (JPEG/PNG)
   - 檔案大小限制
   - 檔案名稱包含特殊字元

2. **FormData 字段名稱錯誤**
   - 後端期望的字段名可能不是 'image'
   - 可能需要額外的參數

3. **CORS 問題**
   - 跨域請求被阻擋

4. **API 金鑰或認證**
   - 缺少必要的認證 headers

### 測試步驟：

#### 1. 使用 curl 測試 API

```bash
# 基本測試
curl -X POST https://beautymemory-6a58c48154f4.herokuapp.com/api/analyze \
  -F "image=@/path/to/your/image.jpg"

# 如果需要 API 金鑰
curl -X POST https://beautymemory-6a58c48154f4.herokuapp.com/api/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/your/image.jpg"
```

#### 2. 檢查後端 API 文檔

查看 Heroku 應用程式的 logs：
```bash
heroku logs --tail -a beautymemory-6a58c48154f4
```

#### 3. 測試不同的字段名稱

常見的圖片上傳字段名：
- `image`
- `file`
- `photo`
- `picture`
- `img`

### 修復建議：

#### 方案 1：檢查後端期望的參數

修改 FormData 字段名稱：
```javascript
formData.append('file', selectedImage);  // 試試 'file'
// 或
formData.append('photo', selectedImage); // 試試 'photo'
```

#### 方案 2：添加額外參數

某些 API 需要額外參數：
```javascript
formData.append('image', selectedImage);
formData.append('type', 'face_analysis');
formData.append('return_landmark', '1');
```

#### 方案 3：Base64 編碼方式

改用 Base64 上傳：
```javascript
const base64 = await convertToBase64(selectedImage);
const response = await fetch(`${API_BASE_URL}/api/analyze`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ image: base64 })
});
```

#### 方案 4：使用代理繞過 CORS

在 `package.json` 中添加：
```json
{
  "proxy": "https://beautymemory-6a58c48154f4.herokuapp.com"
}
```

然後請求改為：
```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: formData
});
```

### 調試信息

當前發送的資訊：
- URL: `https://beautymemory-6a58c48154f4.herokuapp.com/api/analyze`
- Method: POST
- Content-Type: multipart/form-data (自動)
- Field name: 'image'
- File types: image/jpeg, image/png
- Max size: 10MB

### 下一步行動

1. 查看瀏覽器 Network 面板的詳細請求/回應
2. 檢查 Heroku 後端日誌
3. 確認後端 API 的實際參數要求
4. 嘗試不同的字段名稱和格式
