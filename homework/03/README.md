# Node.js 執行環境與 hello.js

這是我開始學習後端開發的第一個練習。透過在 Node.js 環境下跑獨立的 `hello.js` 檔案，我了解了後端 JavaScript 執行環境與前端瀏覽器的核心差異，並學會了如何使用命令列進行操作。

---

## 網頁瀏覽器與 Node.js 的核心差異

雖然它們使用的程式語言都是 JavaScript，但在架構和權限上有很大的不同：

1. **執行載體**：
   * **瀏覽器**：主要是在沙盒（Sandbox）內跑 JavaScript，提供網頁畫面渲染與使用者操作（例如 DOM 的控制）。
   * **Node.js**：是把 Chrome 瀏覽器的 V8 引擎抽出來，用 C++ 包裝，讓它可以在作業系統上直接跑，變成一個通用的腳本執行環境。
2. **全域物件**：
   * **瀏覽器**：有 `window` 物件和 `document` 物件，所以我們能用 `window.alert()`。
   * **Node.js**：因為沒有瀏覽器視窗，所以不存在 `window` 或 `document`。它用的是 `global` 全域物件，以及用來存取執行參數的 `process` 物件。
3. **系統存取權限**：
   * **瀏覽器**：基於安全，瀏覽器被嚴格限制不能存取你電腦上的硬碟檔案。
   * **Node.js**：擁用跟一般桌上型程式一樣的作業系統權限，可以直接用 `fs` 模組讀寫檔案、`os` 模組看硬體資訊、或是 `http` 模組監聽 port 來架設網站。

---

## 學習過程中的 Gemini CLI 對話紀錄

在安裝完 Node.js 準備測試執行時，我向 Gemini CLI 助理（Gemini）詢問了 Node.js 的運作原理與基礎測試程式碼的撰寫。以下是當時真實的問答過程：

> **User:**
> 幫我解釋 Node.js 執行環境到底是什麼？
> 還有，幫我寫一個最簡單的 `hello.js` 程式碼，除了印出 `hello, world!` 之外，還要能印出我的學籍資料（金門大學資工系一年級、姓名：洪晨祐、學號：111410517）。

> **Gemini 3 Flash Preview:**
> 這是一個非常棒的開始！歡迎來到 JavaScript 的後端世界。
> 
> 簡單來說，以前 JavaScript 只能在瀏覽器裡面跑，因為只有瀏覽器內建了解析 JS 的引擎（像是 Chrome 的 V8）。但後來工程師們想：「如果我們把 V8 引擎單獨抽出來，用 C++ 寫一個封裝，讓它能在我們的作業系統中直接點擊或在終端機裡執行，那不是就能像 Python 或 C++ 一樣當作一般程式語言來用了嗎？」這就是 **Node.js**。它不是一個新的語言，而是一個讓 JavaScript 可以在瀏覽器以外（伺服器、個人電腦、樹莓派等）運行的**執行環境 (Runtime)**。
> 
> 為了幫你進行環境測試，我寫了一個結構化且乾淨的 `hello.js` 程式碼。你可以直接建立一個檔案並把這段程式碼貼進去：
> 
> ```javascript
> /**
>  * hello.js - 測試 Node.js 環境執行
>  */
> 'use strict';
> 
> function printWelcomeInfo(studentInfo) {
>     const line = "========================================";
>     console.log(line);
>     console.log("🚀 hello, world!");
>     console.log(`🏫 學校科系: ${studentInfo.school} ${studentInfo.department} ${studentInfo.grade}`);
>     console.log(`👤 學生姓名: ${studentInfo.name} (${studentInfo.id})`);
>     console.log("📝 狀態: 成功在本地端 Node.js 環境中順利跑起 JS 檔案！");
>     console.log(line);
> }
> 
> // 你的學籍基本資料
> const myProfile = {
>     school: "國立金門大學",
>     department: "資訊工程學系",
>     grade: "一年級",
>     name: "洪晨祐",
>     id: "111410517"
> };
> 
> printWelcomeInfo(myProfile);
> ```
> 
> **要如何執行它呢？**
> 1. 開啟你的命令列工具（Windows 用 PowerShell 或 CMD，macOS 用 Terminal）。
> 2. 使用 `cd` 指令切換到存放該檔案的資料夾，例如：
>    ```bash
>    cd D:\develop\Projects\MyProject\NQU\1_wp\homework\03
>    ```
> 3. 輸入以下指令並按 Enter：
>    ```bash
>    node hello.js
>    ```
> 
> 如果一切安裝正常，你就會在終端機視窗中看到我們用 `console.log` 印出來的漂亮卡片格式。這代表你的 Node.js 開發環境已經順利打通了！

---

## 學習心得

這次練習雖然代碼很短，但讓我真正搞清楚了前端與後端的環境差異。以前一直以為 JS 只能在網頁裡運作，現在知道原來裝了 Node.js 之後，它就變成了跟 Python 類似的通用程式語言，這讓我對後面的伺服器端 Express 架站作業充滿期待。
