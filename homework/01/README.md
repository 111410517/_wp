# 個人自我介紹網頁

這是我為網頁設計課程寫的第一個自我介紹網頁。在視覺上，我沒有使用常見的圓角或漸層，而是採用了絕對直角、粗黑線條（2px solid #111827）以及紙張白背景的極簡幾何風格，讓畫面看起來比較乾淨俐落。

---

## 設計與排版規劃

整個網頁的排版是使用 CSS Grid 來切分：
* **雙欄佈局**：在電腦螢幕上，主體會切分成左右兩欄。左邊區塊寬度佔 1fr，用來放我的大頭貼框、姓名、學號（111410517）與就讀科系；右邊區塊寬度佔 2fr，用來放自傳與技能徽章。
* **頭像呼吸燈動畫**：我為大頭貼的外框設計了一個呼吸發光的藍色陰影。使用 CSS 的 `@keyframes neon-pulse` 定義陰影的擴散範圍，並搭配 `animation: neon-pulse 1.5s infinite alternate` 讓它在深藍與亮藍之間平滑過度，產生規律的呼吸律動。
* **Iframe 無縫融入機制**：為了之後能把這個網頁用 iframe 嵌入到期末 Portal 主頁中，我寫了一段 JS 檢查 `window.self !== window.top`。只要偵測到自己被 iframe 嵌入，就會動態在 html 加上 `iframe-mode`，自動隱藏頁尾並將 padding 設為 0，這樣就不會出現重複的頁尾或奇怪的邊距。

---

## 學習過程中的 Gemini CLI 對話紀錄

在設計網頁的排版與適配 iframe 的時候，我遇到了 CSS 關鍵影格與 JavaScript 視窗檢測的問題。以下是我與 Gemini CLI 助手（Gemini）討論的完整對話過程：

> **User:**
> 幫我寫一個個人自我介紹網頁，我想用在網頁程式設計的作業上。
> 我的名字是洪晨祐，學號 111410517，就讀金門大學資工系一年級。
> 風格希望能用非常俐落的幾何極簡風格，白背景、黑邊框，而且不要有任何圓角。
> 排版我想用 CSS Grid 將網頁對半分或左右兩邊，左邊放我的照片跟學籍基本資料，右邊放自我介紹跟專業技能。

> **Gemini 3 Flash Preview:**
> 沒問題！這是一個非常適合資工系學生的個人 Profile 設計概念。幾何極簡風格（Neo-brutalist / Solid Border）在現代網頁設計中非常流行，它的特點是使用絕對直角、粗邊框（例如 2px solid #111827）和高對比度的排版，給人一種乾淨且專業的感覺。
> 
> 為了達到你的要求，我們可以使用 **CSS Grid** 來實現左右雙欄版面。在桌面端（寬度大於 768px）我們將寬度比例設為 `1fr` 和 `2fr`，讓自我介紹有更寬裕的閱讀空間；而在行動端則自動退化為單欄垂直排版，確保響應式適配。
> 
> 以下是為你編寫的 HTML 結構與 CSS 樣式：
> 
> ```html
> <!DOCTYPE html>
> <html lang="zh-TW">
> <head>
>     <meta charset="UTF-8">
>     <meta name="viewport" content="width=device-width, initial-scale=1.0">
>     <title>洪晨祐的個人自我介紹</title>
>     <style>
>         :root {
>             --bg-color: #fcfcfc;
>             --card-bg: #ffffff;
>             --border-main: #111827;
>             --text-main: #111827;
>             --text-muted: #4b5563;
>         }
>         * {
>             margin: 0;
>             padding: 0;
>             box-sizing: border-box;
>             border-radius: 0 !important; /* 強制所有元件為直角 */
>         }
>         body {
>             font-family: sans-serif;
>             background-color: var(--bg-color);
>             color: var(--text-main);
>             min-height: 100vh;
>             display: flex;
>             justify-content: center;
>             align-items: center;
>             padding: 2rem 1rem;
>         }
>         .container {
>             width: 100%;
>             max-width: 800px;
>             background-color: var(--card-bg);
>             border: 2px solid var(--border-main);
>             padding: 3rem;
>             box-shadow: 8px 8px 0px rgba(17, 24, 39, 0.05);
>         }
>         .header {
>             display: flex;
>             align-items: center;
>             gap: 2rem;
>             margin-bottom: 2rem;
>             border-bottom: 1px solid #e5e7eb;
>             padding-bottom: 1.5rem;
>         }
>         .avatar {
>             width: 80px;
>             height: 80px;
>             background: var(--border-main);
>             color: #fff;
>             display: flex;
>             justify-content: center;
>             align-items: center;
>             font-size: 2rem;
>             font-weight: 800;
>         }
>         .profile-grid {
>             display: grid;
>             grid-template-columns: 1fr 2fr;
>             gap: 1.5rem;
>         }
>         .section-box {
>             border: 1px solid #e5e7eb;
>             padding: 1.2rem;
>         }
>         @media (max-width: 768px) {
>             .profile-grid {
>                 grid-template-columns: 1fr;
>             }
>         }
>     </style>
> </head>
> <body>
>     <div class="container">
>         <div class="header">
>             <div class="avatar"><span>祐</span></div>
>             <div>
>                 <h1>洪晨祐</h1>
>                 <p style="color: #2563eb; font-weight: 700;">金門大學 資訊工程學系</p>
>             </div>
>         </div>
>         <div class="profile-grid">
>             <div class="section-box">
>                 <h3>基本資料</h3>
>                 <p>學號：111410517</p>
>                 <p>年級：一年級</p>
>             </div>
>             <div class="section-box">
>                 <h3>自我介紹</h3>
>                 <p>我是洪晨祐，就讀金門大學資工系一年級。我對網頁開發及後端系統架構有很大的興趣，希望能在這學期掌握全棧開發的技能。</p>
>             </div>
>         </div>
>     </div>
> </body>
> </html>
> ```

> **User:**
> 謝謝！這個排版很俐落。我希望能在左邊頭像框加上一點藍色霓虹發光的效果，而且要有呼吸燈的動態呼吸感。
> 另外，這個網頁如果之後被 iframe 嵌入到其他主頁面的時候，會不會顯得頁尾跟邊距重複？有沒有辦法在偵測到被 iframe 嵌入時，自動隱藏頁尾並把邊距設為 0？

> **Gemini 3 Flash Preview:**
> 這個點子很好！在極簡風格中加入微量的霓虹元素（Neon Accent），能起到畫龍點睛的視覺效果。
> 
> 1. **霓虹呼吸燈效果**：我們可以使用 CSS 的 `box-shadow` 屬性，並搭配 `@keyframes` 關鍵影格動畫。藉由將 `animation-direction` 設定為 `alternate`，可以讓陰影在深藍與亮藍之間平滑過度，產生自然的呼吸律動。
> 2. **Iframe 無縫適配**：我們可以在 HTML 頂部加入一段簡單的 JavaScript 來檢查 `window.self !== window.top`。如果這個條件成立，說明網頁目前正處於 iframe 沙盒中。此時我們可以在 `<html>` 元素上動態掛載一個 `iframe-mode` 的 class，並在 CSS 中針對該 class 寫入覆蓋樣式（例如隱藏 footer、將 padding 設為 0、背景設為透明），這樣它就能完美融入主門戶網頁中。
> 
> 以下是更新後的 CSS 與 JS 程式碼：
> 
> ```html
> <script>
>     // 偵測是否被 iframe 嵌入以啟用適配樣式
>     if (window.self !== window.top) {
>         document.documentElement.classList.add('iframe-mode');
>     }
> </script>
> 
> <style>
>     /* 大頭貼框加入呼吸發光效果 */
>     .avatar-glow {
>         width: 80px;
>         height: 80px;
>         background: var(--border-main);
>         display: flex;
>         justify-content: center;
>         align-items: center;
>         border: 2px solid #2563eb;
>         animation: neon-pulse 1.5s infinite alternate; /* 動態呼吸燈 */
>     }
> 
>     @keyframes neon-pulse {
>         from {
>             box-shadow: 0 0 5px #2563eb, 0 0 10px #2563eb;
>         }
>         to {
>             box-shadow: 0 0 15px #3b82f6, 0 0 30px #3b82f6;
>         }
>     }
> 
>     /* 當處於 iframe 嵌入模式時的適配樣式 */
>     .iframe-mode body {
>         padding: 10px;
>         background: transparent; /* 背景透明融入父網頁 */
>         align-items: flex-start;
>     }
>     .iframe-mode .container {
>         max-width: 100%;
>         border: none;
>         box-shadow: none;
>         padding: 0;
>         background: transparent;
>     }
>     .iframe-mode .footer {
>         display: none; /* 隱藏重複的頁尾 */
>     }
> </style>
> ```
> 
> 這樣修改後，你的網頁不論是獨立載入還是被嵌入到 Portal 中，都能擁有非常完美的呈現效果。

---

## 學習心得

這次作業讓我學會了如何使用 CSS Grid 進行網頁區塊的排版。跟以前用 float 相比，Grid 在對齊跟配置比例上簡單太多了。另外，透過頭像發光的設計，我也學會了利用 keyframes 動態更改 `box-shadow` 來製作呼吸燈動畫。最後，寫 JS 偵測 `window.self !== window.top` 的適配技巧非常實用，解決了之後網頁嵌入 Portal 時樣式打架的 bug。
