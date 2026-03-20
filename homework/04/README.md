# JavaScript 基礎練習十題

這些檔案是我為了熟悉 JavaScript 基礎語法而寫的十題練習。內容涵蓋了變數宣告（`let`, `const`）、邏輯分支（`if/else`）、迴圈（`for`, `while`）、陣列映射（`map`）、遞迴階乘演算法，以及如何在物件的方法中正確使用 `this` 指標。

---

## 練習題目與使用語法對照

| 檔案名稱 | 核心概念 | 說明 |
| :--- | :--- | :--- |
| `task01_score_grade.js` | 條件分支 | 傳入分數，判定等第（A+ 到 F），並做超出範圍的防呆處理。 |
| `task02_odd_sum.js` | 迴圈累加 | 傳入數值 N，計算 1 到 N 之間所有奇數的加總。 |
| `task03_fibonacci.js` | 陣列操作 | 使用 while 迴圈動態將費氏數列推入（`push`）陣列中。 |
| `task04_student_object.js` | 物件宣告 | 建立學生物件以儲存基本資料，並練習屬性的讀取。 |
| `task05_json_convert.js` | JSON 序列化 | 使用 `JSON.stringify` 將物件轉換為可傳輸的 JSON 字串，並包含 try-catch 解析防護。 |
| `task06_min_max.js` | 陣列走訪 | 僅使用一次迴圈，同時找出陣列中最大值與最小值。 |
| `task07_factorial.js` | 遞迴調用 | 以遞迴（Recursion）思維實作階乘運算。 |
| `task08_nested_json.js` | 巢狀成員讀取 | 練習對多層嵌套物件屬性的精準提取與遍歷。 |
| `task09_array_square.js` | 陣列 map 映射 | 使用陣列的 map 方法配合箭頭函數，完成陣列元素的平方映射。 |
| `task10_bank_account.js` | `this` 關鍵字 | 實作銀行帳戶物件，在方法內部使用 `this` 修改餘額狀態。 |

---

## 學習過程中的 Gemini CLI 對話紀錄

在剛開始練習 JavaScript 基本語法時，我對物件的 `this` 用法以及數列的 `while` 寫法有一些疑問，於是向 Gemini CLI 助理（Gemini）尋求解答。以下是我們當時真實的對答過程：

> **User:**
> 幫我設計 10 題 JavaScript 的基礎練習題。
> 題目要包含：分數分級（if-else）、算奇數和（for）、費氏數列（while+陣列）、建立學生物件、物件轉 JSON、找出陣列最大與最小值、遞迴算階乘、讀取多層巢狀 JSON、用 map 映射陣列平方，以及一個有存款與提款方法的銀行帳戶物件。
> 請用 let 和 const 宣告變數，並附上繁體中文註解說明。

> **Gemini 3 Flash Preview:**
> 沒問題！這 10 題非常適合拿來練習 JavaScript 的基本控制流程、資料結構操作與物件概念。
> 
> 這裡為你設計了 10 個獨立的練習題，我把所有核心邏輯、測試資料和執行輸出寫在同一個程式碼區塊中。你可以把這些程式碼拆分成不同的 `.js` 檔案，在本地端使用 Node.js 執行它們：
> 
> ```javascript
> // 1. 分數等第判斷 (01_if_function.js)
> // 傳入 0~100 的分數，回傳對應的等第，並加入範圍防呆
> function getGrade(score) {
>     if (score < 0 || score > 100) {
>         return "無效的分數";
>     } else if (score >= 90) {
>         return "A+";
>     } else if (score >= 80) {
>         return "A";
>     } else if (score >= 70) {
>         return "B";
>     } else if (score >= 60) {
>         return "C";
>     } else {
>         return "F (不及格)";
>     }
> }
> console.log("等第測試 (85分):", getGrade(85)); // 輸出: A
> 
> // 2. 範圍內奇數和 (02_for_function.js)
> // 利用 for 迴圈與模數運算，計算 1 到 max 的奇數累加和
> function sumOdds(max) {
>     let sum = 0;
>     for (let i = 1; i <= max; i++) {
>         if (i % 2 !== 0) {
>             sum += i;
>         }
>     }
>     return sum;
> }
> console.log("奇數和測試 (10以內):", sumOdds(10)); // 輸出: 25
> 
> // 3. 費氏數列生成 (03_while_array.js)
> // 用 while 迴圈遞增數列，並推入陣列中
> function generateFibonacci(n) {
>     if (n <= 0) return [];
>     if (n === 1) return [0];
>     const fibArray = [0, 1];
>     while (fibArray.length < n) {
>         const currentLength = fibArray.length;
>         // 將前兩項相加，推入陣列尾端
>         fibArray.push(fibArray[currentLength - 1] + fibArray[currentLength - 2]);
>     }
>     return fibArray;
> }
> console.log("費氏數列測試 (長度7):", generateFibonacci(7)); // 輸出: [0, 1, 1, 2, 3, 5, 8]
> 
> // 4. 學生物件宣告與讀取 (04_object.js)
> const student = {
>     name: "洪晨祐",
>     id: "111410517",
>     major: "資訊工程學系"
> };
> console.log("讀取學生屬性 - 姓名:", student.name);
> 
> // 5. 物件轉 JSON 字串 (05_json_object.js)
> // 使用 JSON.stringify 將物件轉為字串格式
> const studentJson = JSON.stringify(student);
> console.log("序列化 JSON 字串:", studentJson);
> 
> // 6. 尋找陣列極大極小值 (06_array_for_if.js)
> // 用單次迴圈走訪陣列，比較並更新極值
> function findMinMax(numbers) {
>     if (!numbers || numbers.length === 0) return null;
>     let min = numbers[0];
>     let max = numbers[0];
>     for (let i = 1; i < numbers.length; i++) {
>         if (numbers[i] < min) min = numbers[i];
>         if (numbers[i] > max) max = numbers[i];
>     }
>     return { min, max };
> }
> console.log("極值測試:", findMinMax([10, 5, 8, 23, 1])); // 輸出: { min: 1, max: 23 }
> 
> // 7. 遞迴階乘運算 (07_function.js)
> // 遞迴終止條件: n 等於 0 或 1 時回傳 1
> function getFactorial(n) {
>     if (n < 0) return -1; // 簡單錯誤控制
>     if (n === 0 || n === 1) return 1;
>     return n * getFactorial(n - 1);
> }
> console.log("階乘測試 (5!):", getFactorial(5)); // 輸出: 120
> 
> // 8. 讀取巢狀 JSON 屬性 (08_json.js)
> const nestedData = {
>     user: {
>         profile: {
>             age: 20
>         }
>     }
> };
> console.log("讀取嵌套年齡:", nestedData.user.profile.age); // 輸出: 20
> 
> // 9. 陣列平方映射 (09_array_for.js)
> // map 會對每個元素進行函數運算，傳回新陣列，原陣列保持不變
> const baseNumbers = [1, 2, 3, 4, 5];
> const squares = baseNumbers.map(num => num * num);
> console.log("平方映射結果:", squares); // 輸出: [1, 4, 9, 16, 25]
> 
> // 10. 銀行帳戶提存物件 (10_object.js)
> // 在方法中使用 this 來讀寫物件本身的屬性
> const bankAccount = {
>     owner: "洪晨祐",
>     balance: 5000,
>     
>     deposit(amount) {
>         if (amount > 0) {
>             this.balance += amount;
>             console.log(`[存款成功] 存入 $${amount}，目前餘額: $${this.balance}`);
>         }
>     },
>     
>     withdraw(amount) {
>         if (amount > this.balance) {
>             console.log(`[提款失敗] 餘額不足。目前餘額: $${this.balance}`);
>         } else if (amount > 0) {
>             this.balance -= amount;
>             console.log(`[提款成功] 取出 $${amount}，目前餘額: $${this.balance}`);
>         }
>     }
> };
> bankAccount.deposit(1000);  // 餘額變為 6000
> bankAccount.withdraw(2000); // 餘額變為 4000
> ```
> 
> **關鍵語法細節說明：**
> - **`map` 與陣列不變性 (Immutability)**：題 9 中使用 `map` 方法時，JavaScript 會傳回一個全新的陣列，而不是修改原本的 `baseNumbers`。這在開發複雜系統時非常重要，能避免不必要的附帶效能與邏輯 Bug。
> - **物件中的 `this`**：在題 10 中，`deposit` 與 `withdraw` 方法中必須寫成 `this.balance`。如果只寫 `balance`，JavaScript 會把它當作全域變數或區域變數，導致存取不到物件內部的屬性。
> 
> 你可以先在終端機中用 `node <檔案名稱>.js` 跑跑看，如果有任何邏輯不清楚的地方，我隨時可以為你詳細拆解！

---

## 學習心得

這次寫的 10 道基本語法題，讓我把 JavaScript 常見的語意和特性都練習了一遍。最容易寫錯的地方就是物件方法裡的 `this`。我在寫提款存款時，一開始漏掉了 `this`，導致程式狂噴 `balance is not defined` 的錯，查了才知道 JS 物件方法存取內部屬性必須寫 `this`。另外，用 `map` 取代 `for` 迴圈來映射陣列非常清爽，程式碼字數變少，邏輯也更直覺。
