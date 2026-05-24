# 學習筆記

## 1. Node.js 靜態伺服器核心概念

### 伺服器做的事情
- **接收 request（網址）**：解析客戶端傳來的 `req.url`。
- **判斷要回傳什麼檔案**：根據路徑匹配對應的檔案資源。
- **設定 Content-Type**：必須告知瀏覽器檔案類型（如 `text/html`、`image/jpeg`），否則會解析失敗。
- **回傳檔案**：利用 `fs` 模組讀取檔案內容並回傳給瀏覽器。

---

## 2. 路由順序（非常重要）

### 越精確的路由要越前面
程式執行是由上而下的，一旦匹配成功就會進入該邏輯並結束。

### 正確順序
1. **精確路徑**：`/` (首頁)、`/index.html`、`/cart.html`。
2. **特定目錄**：如 `/images/*`（使用 `req.url.startsWith("/images/")`）。
3. **通用資源**：如 `.css`、`.js`（透過判斷副檔名）。
4. **最後防線**：404 頁面。

### 錯誤做法
- **先寫 `/` 判斷**：若使用 `if (req.url.startsWith("/"))` 放在最前面，會吃掉所有請求。
- **原因**：因為所有網址（包含 `/cart.html`）都是以 `/` 開頭，這會導致頁面被當成錯誤的檔案類型處理（例如把 HTML 當成圖片），造成畫面黑屏。

---

## 3. 常見錯誤

### HTML 嵌套錯誤
- **現象**：畫面顯示空白或排版異常。
- **原因**：在複製程式碼時，不小心將整個 `index.html` 的內容貼進了 `cart.html` 的標籤內，導致 `<html>` 標籤中又包了一層 `<html>`。
- **修正**：確保每個檔案結構獨立，只有一組標準的 HTML 骨架。

### 靜態資源 MIME 類型錯誤
- **現象**：瀏覽器收到檔案但無法顯示（如：Resource interpreted as stylesheet but transferred with MIME type image/jpeg）。
- **原因**：路由判斷邏輯錯誤，導致伺服器給了錯誤的 `Content-Type`。
- **解決**：檢查 `server.js` 中的 `if...else` 順序，確保圖片與 HTML 分開處理。

---

## 4. 除錯技巧 (Debugging)
- **F12 Network 面板**：觀察每個請求的 `Status Code` 是否為 200，並檢查 `Response Headers` 中的 `Content-Type` 是否正確。
- **Console 訊息**：檢查是否有 JavaScript 因 DOM 結構錯誤而抓不到元素的報錯。