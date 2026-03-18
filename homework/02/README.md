# 互動式表單與 Tab 切換設計

我把會員登入、註冊與問卷這三個不同的表單整合到了同一個卡片式容器中。利用 JavaScript 監聽事件，我實作了前端標籤頁的切換，讓使用者不用重新載入整個網頁就能在不同的表單之間切換，維持資料不遺失。

---

## 表單設計要點

這份表單是我為了練習 HTML5 各式控制項而設計的：
1. **多樣的控制項**：包含了文字輸入框、`type="email"` 的郵件輸入框、`type="password"` 的密碼隱私保護輸入框、`type="date"` 的生日日期選擇器、`type="number"` 的限制年齡區間、生理性別的單選按鈕（`radio`）、感興趣領域的複選框（`checkbox`）、入學管道的下拉選單（`select`），以及程式基礎自評的數值滑桿（`range`）。
2. **無重整的頁籤切換**：在頂部設計了三個按鈕。當點選不同按鈕時，JavaScript 會動態移除所有表單的 `active` 類別，並為當前選取的表單補上 `active`，以此切換顯示。
3. **攔截 submit 預設動作**：如果直接按 submit，瀏覽器預設會重整頁面。我透過 `event.preventDefault()` 攔截這個預設動作，將填寫的欄位內容留在前端進行模擬提示，並以 `.reset()` 方法清空表單。

---

## 學習過程中的 Gemini CLI 對話紀錄

在設計這個三合一表單的 JavaScript 切換與阻止表單重整時，我向 Gemini CLI 助理（Gemini）詢問了解決方案。以下是當時真實的問答過程：

> **User:**
> 幫我寫一個網頁表單，裡面要同時有「會員登入」、「新手註冊」跟「問卷調查」這三個表單，把它們排版在同一個卡片容器裡。
> 視覺上我想走俐落的幾何極簡風，背景是用點溫和的灰白色，卡片用純白，然後線條全部都是黑色的粗實線，絕對不要有任何圓角。

> **Gemini 3 Flash Preview:**
> 這是一個非常經典的前端版面設計需求！要實現在同一個卡片容器內展示三個表單，我們可以使用一個主容器（`.form-card`），並在頂部設計一個導覽列（`.tab-group`），點擊不同的按鈕時動態切換顯示對應的 `<form>` 區塊。
> 
> 在視覺上，為了展現幾何俐落感，我們將全域設定 `* { border-radius: 0 !important; }` 來消滅所有瀏覽器的預設圓角，並用 `2px solid #111` 框線加上等寬的直角陰影。
> 
> 以下是為你編寫的完整 HTML 結構與 CSS 樣式：
> 
> ```html
> <!DOCTYPE html>
> <html lang="zh-TW">
> <head>
>     <meta charset="UTF-8">
>     <title>複合式幾何表單系統</title>
>     <style>
>         body {
>             font-family: sans-serif;
>             background-color: #f4f4f0;
>             padding: 40px;
>             display: flex;
>             justify-content: center;
>         }
>         .form-card {
>             max-width: 500px;
>             width: 100%;
>             background: #fff;
>             border: 2px solid #1a1a1a;
>             padding: 30px;
>             box-shadow: 8px 8px 0px #1a1a1a;
>         }
>         * { border-radius: 0 !important; }
>         .tab-group { 
>             display: flex; 
>             border-bottom: 2px solid #1a1a1a; 
>             margin-bottom: 25px; 
>         }
>         .tab-btn { 
>             flex: 1; 
>             padding: 12px; 
>             border: none; 
>             background: none; 
>             cursor: pointer; 
>             font-weight: bold; 
>             color: #777;
>         }
>         .tab-btn.active { 
>             color: #1a1a1a;
>             background-color: #f4f4f0;
>             border-bottom: 2px solid #1a1a1a; 
>         }
>         .form-section { display: none; }
>         .form-section.active { display: block; }
>         .form-group { margin-bottom: 20px; }
>         .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
>         .input-control { 
>             width: 100%; 
>             padding: 10px; 
>             border: 2px solid #1a1a1a; 
>             box-sizing: border-box; 
>         }
>         .btn-submit { 
>             width: 100%; 
>             padding: 12px; 
>             background: #1a1a1a; 
>             color: #fff; 
>             border: none; 
>             font-weight: bold; 
>             cursor: pointer; 
>         }
>     </style>
> </head>
> <body>
>     <div class="form-card">
>         <div class="tab-group">
>             <button class="tab-btn active" data-target="login-form">會員登入</button>
>             <button class="tab-btn" data-target="register-form">新手註冊</button>
>             <button class="tab-btn" data-target="survey-form">課程問卷</button>
>         </div>
> 
>         <!-- 登入表單 -->
>         <form id="login-form" class="form-section active">
>             <div class="form-group">
>                 <label>電子信箱</label>
>                 <input type="email" class="input-control" placeholder="example@nqu.edu.tw" required>
>             </div>
>             <div class="form-group">
>                 <label>密碼</label>
>                 <input type="password" class="input-control" placeholder="輸入密碼" required>
>             </div>
>             <button type="submit" class="btn-submit">登入</button>
>         </form>
> 
>         <!-- 註冊表單 -->
>         <form id="register-form" class="form-section">
>             <div class="form-group">
>                 <label>真實姓名</label>
>                 <input type="text" class="input-control" placeholder="如：洪晨祐" required>
>             </div>
>             <div class="form-group">
>                 <label>生日</label>
>                 <input type="date" class="input-control" required>
>             </div>
>             <div class="form-group">
>                 <label>年齡</label>
>                 <input type="number" class="input-control" min="1" max="120" placeholder="年齡" required>
>             </div>
>             <div class="form-group">
>                 <label>設定密碼 (最少 6 碼)</label>
>                 <input type="password" class="input-control" minlength="6" placeholder="設定密碼" required>
>             </div>
>             <button type="submit" class="btn-submit">註冊</button>
>         </form>
> 
>         <!-- 問卷表單 -->
>         <form id="survey-form" class="form-section">
>             <div class="form-group">
>                 <label>生理性別</label>
>                 <input type="radio" name="gender" value="male" checked> 男
>                 <input type="radio" name="gender" value="female"> 女
>             </div>
>             <div class="form-group">
>                 <label>感興趣的領域</label>
>                 <input type="checkbox" name="interests" value="web"> 網頁設計
>                 <input type="checkbox" name="interests" value="ai"> 人工智慧
>             </div>
>             <div class="form-group">
>                 <label>入學管道</label>
>                 <select class="input-control" required>
>                     <option value="">請選擇</option>
>                     <option value="star">繁星推薦</option>
>                     <option value="apply">申請入學</option>
>                 </select>
>             </div>
>             <button type="submit" class="btn-submit">送出問卷</button>
>         </form>
>     </div>
> </body>
> </html>
> ```

> **User:**
> 謝謝！那我要怎麼寫 JavaScript 程式，讓使用者點擊頂部按鈕時，可以動態切換顯示對應的表單？
> 還有，如果我按下 submit 送出按鈕時，網頁會自動重新整理，這樣剛寫的資料就都不見了，要怎麼用 JS 攔截並改用彈跳視窗模擬送出成功？

> **Gemini 3 Flash Preview:**
> 沒問題！要做到無刷新頁籤切換與攔截預設送出行為，你需要用到 JavaScript 的 DOM 操作與事件監聽器。
> 
> 1. **切換 Active Class**：當點選按鈕時，我們可以監聽點擊事件，先將所有按鈕與表單的 `active` class 移除，再透過按鈕上的 `data-target` 屬性找到要顯示的表單，動態為其補上 `active` 樣式。
> 2. **阻止預設事件 (`preventDefault`)**：在 `<form>` 元素上監聽 `submit` 事件。當事件觸發時，先呼叫 `event.preventDefault()`，這能阻斷瀏覽器原生的表單送出與重整網頁的行為。接著呼叫 `alert()` 模擬成功通知，並透過 `event.target.reset()` 輕易清空使用者輸入的內容。
> 
> 這是你可以寫入網頁底部的 JavaScript 程式碼：
> 
> ```javascript
> <script>
>     const tabs = document.querySelectorAll('.tab-btn');
>     const forms = document.querySelectorAll('.form-section');
> 
>     tabs.forEach(tab => {
>         tab.addEventListener('click', (e) => {
>             e.preventDefault(); // 阻止按鈕可能引發的預設行為
>             
>             // 1. 移除所有按鈕與表單的 active 類別
>             tabs.forEach(t => t.classList.remove('active'));
>             forms.forEach(f => f.classList.remove('active'));
> 
>             // 2. 為當前選取的按鈕與表單加上 active
>             tab.classList.add('active');
>             const targetFormId = tab.getAttribute('data-target');
>             document.getElementById(targetFormId).classList.add('active');
>         });
>     });
> 
>     // 3. 攔截所有表單的 submit 事件
>     forms.forEach(form => {
>         form.addEventListener('submit', (e) => {
>             e.preventDefault(); // 【核心】阻止表單預設重整行為
>             
>             // 模擬送出成功提示
>             alert(`${form.id} 驗證成功，資料已無刷新模擬提交！`);
>             form.reset(); // 清空欄位
>         });
>     });
> </script>
> ```
> 
> 使用這段 JS 程式碼之後，你的三合一表單就能在前端非常流暢、無重整地進行操作了。

---

## 學習心得

在做這個作業時，我學到了很多以前沒碰過的 HTML5 輸入屬性，像是 `minlength` 和 `required` 原生防呆。而最有趣的還是 JavaScript 的 `event.preventDefault()`。以前每次寫表單一按下 submit 就會整個網頁重整，所有的狀態和欄位都不見，現在掌握了非同步攔截，就能自己決定什麼時候送出資料、什麼時候用 AJAX 送請求，這對之後做比較複雜的互動網站是打底必學的技巧。
