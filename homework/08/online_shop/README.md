# 期中專案：幾何潮流外設商城

* **是否使用 AI**：有，使用 Gemini CLI 輔助生成原生 HTTP 伺服器與購物車基礎，並由我除錯與擴充。
* **是否複製他人代碼**：無。

這個期中專案的目標是不使用任何 Express 或 Koa 等後端 web 框架，只用 Node.js 內建的 `http`、`fs` 與 `path` 模組，自己動手刻一個能夠處理靜態檔案加載、二進位圖片分發與防範目錄越界（Path Traversal）安全漏洞的原生 Web 伺服器。前端則實作了基於 `localStorage` 的購物車明細、跨瀏覽器分頁廣播狀態同步，以及異步打字機收據與 CSS 蓋章動畫。

---

## 專案架構與檔案說明

* **`server.js`**：原生 Node.js 後端伺服器。實作了副檔名 Content-Type 對照字典，支援 HTML/CSS/JS/圖片分發，並以 `path` 模組檢驗路徑安全。
* **`index.html`**：商城展示首頁。採用黑框直角幾何風排版，列出多款外設產品並提供「加入購物車」按鈕。
* **`cart.html`**：購物車詳情頁。呈現商品清單、增減數量，以及點擊結帳後跳出的模擬收據 Modal 視窗。
* **`script.js`**：前端 JS 控制邏輯。實作 `localStorage` 讀寫、`window.onstorage` 跨分頁同步更新，以及打字機收據的 `async/await` 輸出。
* **`style.css`**：排版樣式表。包含幾何卡片、按鈕點擊微縮位移，以及紅色 `PAID` 標籤的放大三倍到一倍縮放彈跳 Transition。

---

## 核心 Bug 排除日記

在寫原生伺服器時，我遇到了兩個非常難搞的 bug：

### 1. CSS 樣式失效與破圖
剛開始啟動 `server.js` 載入首頁時，網頁是一片白底黑字的純 HTML，所有樣式都不生效，圖片也顯示 404。
* **原因**：因為沒用框架，我直接用 `fs.readFile` 讀檔並用 `res.end(data)` 回傳。瀏覽器因為沒有收到 `Content-Type: text/css` 頭部，出於安全政策拒絕解析該樣式表；同時，圖片是二進位檔案，原本用 `utf-8` 編碼去讀取，造成了檔案格式破壞。
* **解決方法**：建立 MIME 對照字典，利用 `path.extname` 抓取副檔名並動態帶入 `Content-Type`；若為 `.jpg` 或 `.png` 等二進位圖檔，在讀檔時移除 `utf-8` 參數，改以 Binary 格式讀取並回傳。

### 2. 跨分頁購物車數量不同步
當在瀏覽器同時開兩個分頁（分頁 A 看商品，分頁 B 看購物車），在分頁 A 新增商品後，分頁 B 導覽列的購物車小徽章並不會更新，非得手動重整才行。
* **解決方法**：利用瀏覽器原生的 `storage` 事件監聽。當本地的 `localStorage` 發生改變時，瀏覽器會向同源的其他分頁廣播事件。我寫了 `window.addEventListener('storage', ...)` 監聽器，只要 `event.key === 'myCart'`，就讓其他分頁動態重新載入購物車並渲染畫面，實現即時同步。

---

## 學習過程中的 Gemini CLI 對話紀錄

在寫這個期中專案時，我對於如何處理原生的路徑拼接防禦以及跨分頁的事件監聽感到很苦惱，所以向 Gemini CLI 助理（Gemini）尋求了完整的設計方案。以下是我們當時真實的問答過程：

> **User:**
> 幫我寫一個原生 Node.js 的伺服器 `server.js`。
> 1. 不能用 Express 或任何框架，只能用內建的 http、fs、path 模組。
> 2. 要能正確處理 HTML, CSS, JS, PNG, JPG 檔，並在 Header 寫入對應的 Content-Type 以免載入失敗，圖片讀取要用二進位格式防破損。
> 3. 要實作防範目錄越界（Path Traversal）讀取任意敏感檔案的安全機制，利用 path 模組來檢查請求是否超出了專案的根目錄。
> 風格走俐落的極簡黑框直角風，變數用 let 和 const，註解用繁體中文。

> **Gemini 3 Flash Preview:**
> 這是一個非常有深度且實用的期中專案！純手寫 HTTP 伺服器能讓你深刻理解 Web 伺服器的運作細節（如 Request-Response 週期與 MIME 類型的功用）。
> 
> 在目錄越界安全防範（Path Traversal Prevention）上，我們可以使用 `path.resolve` 將網址列請求的相對路徑與專案根目錄解析成絕對路徑，接著用 `path.relative` 計算出兩者的相對關係。一旦相對路徑以 `..` 開頭或變為絕對路徑，就說明該請求試圖跳出根目錄去讀取電腦裡的其他檔案（例如系統敏感檔），我們就直接丟出 `403 Forbidden`。
> 
> 以下是為你編寫的完整 `server.js` 後端程式碼：
> 
> ```javascript
> // server.js - 原生靜態伺服器
> const http = require('http');
> const fs = require('fs');
> const path = require('path');
> 
> const PORT = 3000;
> const BASE_DIR = path.resolve(__dirname); // 伺服器安全根目錄
> 
> // 常見副檔名對照表 (MIME Types)
> const mimeTypes = {
>     '.html': 'text/html; charset=utf-8',
>     '.css': 'text/css; charset=utf-8',
>     '.js': 'application/javascript; charset=utf-8',
>     '.json': 'application/json; charset=utf-8',
>     '.png': 'image/png',
>     '.jpg': 'image/jpeg',
>     '.jpeg': 'image/jpeg',
>     '.ico': 'image/x-icon'
> };
> 
> const server = http.createServer((req, res) => {
>     // 處理結帳的模擬 POST API
>     if (req.method === 'POST' && req.url === '/api/checkout') {
>         let requestBody = '';
>         req.on('data', chunk => requestBody += chunk);
>         req.on('end', () => {
>             try {
>                 const cart = JSON.parse(requestBody);
>                 const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
>                 const discount = subtotal >= 5000 ? 500 : 0;
>                 res.writeHead(200, { 'Content-Type': 'application/json' });
>                 res.end(JSON.stringify({
>                     success: true,
>                     subtotal,
>                     discount,
>                     total: subtotal - discount,
>                     receiptId: `REC-${Date.now()}`
>                 }));
>             } catch (e) {
>                 res.writeHead(400, { 'Content-Type': 'application/json' });
>                 res.end(JSON.stringify({ error: '無效的資料格式' }));
>             }
>         });
>         return;
>     }
> 
>     // 靜態檔案路由處理
>     let requestUrl = req.url === '/' ? '/index.html' : req.url;
>     requestUrl = requestUrl.split('?')[0]; // 去除 URL 參數
>     
>     // 【安全核心】解析絕對檔案路徑
>     const absoluteFilePath = path.resolve(path.join(BASE_DIR, requestUrl));
>     
>     // 計算相對路徑關係，防止 Path Traversal 漏洞
>     const relativePathRelation = path.relative(BASE_DIR, absoluteFilePath);
>     if (relativePathRelation.startsWith('..') || path.isAbsolute(relativePathRelation)) {
>         res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
>         res.end('403 Forbidden: 拒絕越界檔案存取');
>         return;
>     }
> 
>     // 檢查檔案是否存在
>     fs.stat(absoluteFilePath, (err, stats) => {
>         if (err || !stats.isFile()) {
>             res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
>             res.end('404 Not Found: 找不到請求的檔案');
>             return;
>         }
> 
>         const fileExtension = path.extname(absoluteFilePath).toLowerCase();
>         const contentType = mimeTypes[fileExtension] || 'application/octet-stream';
>         
>         // 判斷是否為二進位檔案 (例如圖片)
>         const isBinaryFile = ['.png', '.jpg', '.jpeg', '.ico'].includes(fileExtension);
>         const readEncoding = isBinaryFile ? null : 'utf-8';
> 
>         fs.readFile(absoluteFilePath, readEncoding, (readErr, fileContent) => {
>             if (readErr) {
>                 res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
>                 res.end('500 Internal Server Error');
>                 return;
>             }
>             res.writeHead(200, { 'Content-Type': contentType });
>             res.end(fileContent);
>         });
>     });
> });
> 
> server.listen(PORT, () => {
>     console.log(`✔ Native HTTP Server is running at http://localhost:${PORT}`);
> });
> ```

> **User:**
> 謝謝！後端伺服器寫好了。前端我想做個購物車：
> 1. 東西存在 localStorage。
> 2. 如果使用者開了兩個分頁，我在分頁 A 買了東西，分頁 B 導航列的購物車數量徽章跟購物明細要能「即時同步」更新，不要手動重新整理網頁（你提到可以用 storage 事件監聽，請教我怎麼寫）。
> 3. 當點下結帳時，要彈出一個 Modal 收據框，收據上的商品內容要用 async/await 打字機逐字印出來，印完之後隔半秒，要蓋上一個紅色的 `PAID` 蓋章（要加入 show-stamp 類別，有 CSS transition 縮放動畫）。

> **Gemini 3 Flash Preview:**
> 這是一個非常有創意的互動設計！使用異步（Async）打字機效果來印收據，搭配 CSS Transition 來模擬真實蓋印章的「彈跳感」，會給使用者極佳的互動體驗。
> 
> 對於你提到的**跨分頁即時同步**：瀏覽器提供了一個 `storage` 事件。當相同網域下的分頁 A 修改了 `localStorage` 時，分頁 B 會收到這個事件的觸發。我們只要監聽這個事件，並在事件觸發時將資料重新讀出、重新渲染畫面即可。
> 
> 以下是為你編寫的前端 `script.js` 完整互動程式碼：
> 
> ```javascript
> // script.js - 前端購物車與收據動畫邏輯
> 'use strict';
> 
> let cart = JSON.parse(localStorage.getItem('myCart')) || [];
> 
> function saveCart() {
>     localStorage.setItem('myCart', JSON.stringify(cart));
>     updateCartBadge();
>     if (document.getElementById('cart-items-list')) {
>         renderCartDetails();
>     }
> }
> 
> // 更新小圖示徽章數量
> function updateCartBadge() {
>     const badge = document.getElementById('cart-badge');
>     if (badge) {
>         const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
>         badge.textContent = totalQuantity;
>     }
> }
> 
> // 【核心】監聽跨分頁 localStorage 變更廣播
> window.addEventListener('storage', (event) => {
>     if (event.key === 'myCart') {
>         // 當分頁 A 修改了購物車，分頁 B 自動同步資料並刷新 UI
>         cart = JSON.parse(event.newValue) || [];
>         updateCartBadge();
>         if (document.getElementById('cart-items-list')) {
>             renderCartDetails();
>         }
>     }
> });
> 
> // 自定義 Promise 延遲函數，用於打字機效果
> const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
> 
> // 模擬結帳異步收據打字機與 PAID 蓋章
> async function triggerCheckoutReceipt(receiptContentText) {
>     const receiptBox = document.getElementById('receipt-text');
>     const paidStamp = document.getElementById('paid-stamp');
>     
>     receiptBox.innerHTML = '';
>     paidStamp.classList.remove('show-stamp'); // 先隱藏蓋章
>     
>     // 逐字輸出打字機效果
>     for (let i = 0; i < receiptContentText.length; i++) {
>         const char = receiptContentText[i];
>         receiptBox.innerHTML += char === '\n' ? '<br>' : char;
>         await delay(25); // 控制打字速度 (每字 25ms)
>     }
>     
>     // 輸出完畢，延遲 400 毫秒，蓋上紅色 PAID 章
>     await delay(400);
>     paidStamp.classList.add('show-stamp');
> }
> 
> // 加入購物車方法
> function addToCart(id, name, price) {
>     const existItem = cart.find(item => item.id === id);
>     if (existItem) {
>         existItem.quantity += 1;
>     } else {
>         cart.push({ id, name, price, quantity: 1 });
>     }
>     saveCart();
> }
> 
> document.addEventListener('DOMContentLoaded', () => {
>     updateCartBadge();
> });
> ```
> 
> **前端蓋章 CSS 設計提示：**
> 為了做出真實的蓋章下落感，可以在 CSS 中為 `#paid-stamp` 設定 `transform: scale(3.5)` 與 `opacity: 0`。當加入 `.show-stamp` 類別時，改為 `transform: scale(1); opacity: 1;`，並配合 `cubic-bezier(0.175, 0.885, 0.32, 1.275)` 的回彈貝氏曲線過度效果，這樣蓋印章時就會有非常逼真的回彈撞擊視覺感。

---

## 學習心得

這次期中專案對我來說收穫巨大。以前只會用 Express 架站，完全不知道原來瀏覽器載入 CSS 時，後端如果不指定 `Content-Type: text/css` 會直接被瀏覽器拒絕解析。親手解決圖片 utf-8 讀取毀損與 Content-Type 的 Bug 讓我學到了真實的 HTTP 傳輸基礎。而利用 `path.relative` 來防範 Path Traversal 目錄越界，更是讓我第一次接觸到了後端資安防禦的實際編寫，這些底層知識是只用框架開發體會不到的。