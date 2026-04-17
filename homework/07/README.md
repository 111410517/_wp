# Node.js 後端非同步與錯誤處理練習

我寫了這十道練習題來熟悉 Node.js 核心的非同步錯誤處理機制。主要是學習並實作 Node.js 業界標準的 Error-First Callback 寫法，並模擬後端資料庫查詢失敗、系統權限安全攔截等常見的伺服器開發邏輯。

---

## 練習題目與核心概念對照

| 檔案名稱 | 核心概念 | 程式功能 |
| :--- | :--- | :--- |
| `challenge01_prop_access.js` | 屬性讀取 | 比對使用點（`.`）與中括號（`[]`）動態讀取物件屬性的語意差別。 |
| `challenge02_destructuring.js` | 解構賦值 | 從模擬的 Request Body 中快速提取所需的物件屬性。 |
| `challenge03_foreach_template.js` | 樣板字串 | 用 `forEach` 遍歷陣列，使用 ES6 樣板字串組裝 HTML 元素。 |
| `challenge04_params_dict.js` | 動態屬性 | 使用中括號語法將動態變數作為 Key 寫入物件。 |
| `challenge05_error_first.js` | 錯誤優先回呼 | 實作基礎的 Error-First Callback 函數。 |
| `challenge06_json_parse.js` | JSON 防護 | 以 `try-catch` 包裹 `JSON.parse` 進行防呆解析。 |
| `challenge07_fake_db.js` | 模擬資料庫 | 模擬異步資料庫查詢，若 ID 查無資料則回傳預設 Error 物件。 |
| `challenge08_template_logic.js` | 條件表示式 | 在樣板字串中寫入三元運算子，進行狀態渲染。 |
| `challenge09_sort_slice.js` | 陣列裁切 | 用 `map` 走訪字串陣列，使用 `slice` 截斷過長字串並加上省略號。 |
| `challenge10_admin_check.js` | 權限攔截 | 檢查使用者角色是否為管理員，非 admin 則回傳拒絕錯誤。 |

---

## 關鍵後端技術概念

### 什麼是 Error-First Callback？
在 Node.js 後端中，許多涉及 I/O 的操作（像是讀寫檔案、向資料庫下 query、打外部 API 等）都是非同步（Asynchronous）運行的。因為是非同步，我們沒辦法直接用傳統的 `try-catch` 包裹主程式來抓錯，因為主程式的執行緒在非同步操作完成前，早就已經往下跑完了。

為了解決這個問題，Node.js 社群約定了一套 Callback 設計規範：
1. 回呼函數的**第一個參數**固定保留給錯誤物件（通常命名為 `err`）。如果操作成功，第一個參數就帶入 `null` 或 `undefined`。
2. 回呼函數的**第二個參數**之後，才用來存放成功時回傳的資料。
3. 呼叫端拿到回呼後，必須**優先判斷 `if (err)`**，有錯就提早 return 處理，確保後續業務邏輯是在無錯的情況下進行，防止伺服器因未預期的崩潰而中斷。

---

## 學習過程中的 Gemini CLI 對話紀錄

在實作非同步回呼與模擬資料庫防禦時，我向 Gemini CLI 助理（Gemini）尋求了完整的後端練習題庫設計。以下是我們當時真實的對答過程：

> **User:**
> 幫我寫 10 題 Node.js 後端非同步與屬性存取的練習題。
> 題目要涵蓋：點與中括號讀取屬性、解構賦值、forEach 搭配樣板字串拼接、動態屬性字典寫入、Error-First Callback 實作、安全 JSON 解析、模擬資料庫查詢報錯、樣板字串內寫三元運算子、陣列 slice 擷取並用 map 截斷字串，以及管理員身分檢查。
> 請用繁體中文寫詳細的註解說明，程式碼使用 let 和 const。

> **Gemini 3 Flash Preview:**
> 這是一組設計得非常全面的後端 JavaScript 練習題！特別是 Error-First Callback 的概念，它是 Node.js 異步處理的根基，也是掌握 Promise 和 async/await 之前必須要打好的基本功。
> 
> 我將這 10 道題目與測試案例整理在底下的程式碼區塊中。你可以把每一題分別複製到對應的 `.js` 檔案中，在終端機直接用 Node.js 執行：
> 
> ```javascript
> // 1. 屬性讀取 (challenge01_prop_access.js)
> // 比較點（.）和中括號（[]）在動態存取時的差異
> const dbConfig = { port: 3000, dbName: "blog" };
> console.log("Port (點存取):", dbConfig.port);
> console.log("DB Name (中括號存取):", dbConfig["dbName"]);
> 
> // 2. 解構賦值 (challenge02_destructuring.js)
> // 從請求物件中快速提取 username 與 email
> const req = { body: { username: "洪晨祐", email: "s111410517@student.nqu.edu.tw" } };
> const { username, email } = req.body;
> console.log("解構變數:", username, "|", email);
> 
> // 3. 樣板字串拼接 (challenge03_foreach_template.js)
> const posts = [{ id: 1, title: "HTML5入門" }, { id: 2, title: "Node.js指南" }];
> posts.forEach(post => {
>     console.log(`<li>ID: ${post.id} - Title: ${post.title}</li>`);
> });
> 
> // 4. 動態屬性字典 (challenge04_params_dict.js)
> // 當屬性名稱來自於一個變數時，必須使用中括號寫入
> const queryParams = {};
> const dynamicKey = "studentId";
> queryParams[dynamicKey] = "111410517";
> console.log("動態寫入的物件:", queryParams); // { studentId: '111410517' }
> 
> // 5. 錯誤優先回呼實作 (challenge05_error_first.js)
> function simulateFetch(id, callback) {
>     setTimeout(() => {
>         const fakeUser = { id: id, status: "active" };
>         // 成功時，第一個引數傳 null，代表無錯誤
>         callback(null, fakeUser);
>     }, 100);
> }
> simulateFetch(99, (err, data) => {
>     if (err) {
>         console.error("發生錯誤:", err);
>         return;
>     }
>     console.log("成功取得用戶資料:", data);
> });
> 
> // 6. JSON 安全解析 (challenge06_json_parse.js)
> // 使用 try-catch 包裹解析，防止傳入無效 JSON 導致伺服器直接掛掉
> function safeJsonParse(jsonString, callback) {
>     try {
>         const parsedObject = JSON.parse(jsonString);
>         callback(null, parsedObject);
>     } catch (parseError) {
>         // 發生錯誤，將錯誤物件傳給 callback 的第一個參數
>         callback(parseError, null);
>     }
> }
> safeJsonParse('{"list":[1,2,3]}', (err, result) => {
>     if (err) {
>         console.error("JSON 解析出錯:", err.message);
>     } else {
>         console.log("JSON 解析成功，資料長度:", result.list.length);
>     }
> });
> 
> // 7. 模擬資料庫查詢報錯 (challenge07_fake_db.js)
> function fakeDatabaseQuery(id, callback) {
>     setTimeout(() => {
>         // 模擬 ID 不存在時拋出錯誤
>         if (id !== 1) {
>             callback(new Error("資料庫查詢失敗：找不到該筆資料"), null);
>         } else {
>             callback(null, { id: 1, title: "原生 Node.js 開發" });
>         }
>     }, 300);
> }
> fakeDatabaseQuery(2, (err, row) => {
>     if (err) {
>         console.log(`[查詢失敗] 如預期攔截到 Error: ${err.message}`);
>     } else {
>         console.log("[查詢成功] 資料:", row);
>     }
> });
> 
> // 8. 三元運算子渲染 (challenge08_template_logic.js)
> const sessionState = { isUserLoggedIn: true, userName: "晨祐" };
> console.log(`狀態看板: ${sessionState.isUserLoggedIn ? `Hello, ${sessionState.userName}` : "訪客，請登入"}`);
> 
> // 9. 陣列 slice 與 map 裁切 (challenge09_sort_slice.js)
> // 將長字串截斷並加上省略號，短字串則保持原樣
> const blogTitles = ["這是一篇非常長長長長長的文章標題", "短標題"];
> const truncatedTitles = blogTitles.map(title => 
>     title.length > 10 ? title.slice(0, 10) + "..." : title
> );
> console.log("裁切後的標題:", truncatedTitles);
> 
> // 10. 管理員身分檢查 (challenge10_admin_check.js)
> function restrictToAdmin(role, callback) {
>     if (role !== "admin") {
>         callback(new Error("Access Denied: 您沒有管理員權限"), null);
>     } else {
>         callback(null, "Welcome Admin! 權限驗證通過");
>     }
> }
> restrictToAdmin("guest", (err, successMessage) => {
>     if (err) {
>         console.log(`[安全性攔截] 驗證失敗: ${err.message}`);
>     } else {
>         console.log(successMessage);
>     }
> });
> ```
> 
> **設計心法提醒：**
> - **為什麼要用 `return`**：在題 10 中，如果觸發了 `callback(new Error(...))`，後面必須緊跟著 `return`（或者寫在 `else` 中）。如果不 return，函數的執行流會繼續往下跑，甚至執行到成功的 callback，導致一個請求回傳了兩次結果，這在實際後端網站開發中會導致 `Headers already sent` 的致命錯誤。
> 
> 如果有任何一題的邏輯需要做更深入的拆解，例如 setTimeout 的事件循環（Event Loop）執行順序，可以隨時告訴我！

---

## 學習心得

這次後端挑戰讓我搞懂了 Error-First Callback 的設計思維。以前總覺得把 `err` 放在第一個參數很多此一舉，但在實作了模擬資料庫報錯（題 7）和管理員攔截（題 10）後，我才明白在異步的世界中，因為沒辦法用 try-catch 包裹，這樣做是保證系統不因報錯而當機的唯一防禦性寫法。這對我之後理解 Express 的 Error-Handling 中間件打下了很好的底子。
