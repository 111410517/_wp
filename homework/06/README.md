# JavaScript 進階函式與傳址陷阱練習

我寫了這十個程式碼檔案來深入練習 JavaScript 進階的函數特性。重點包括 Callback 回呼函數、立即執行函數（IIFE）的作用域隔離、閉包的變數鎖定，以及物件和陣列在記憶體中的傳址修改（Mutation）與重新指派（Reassignment）行為。

---

## 練習題目與核心概念對照

| 檔案名稱 | 核心概念 | 程式功能 |
| :--- | :--- | :--- |
| `task01_callback.js` | Callback | 將運算邏輯（例如相加或相減）以回呼函數傳入主計算工具。 |
| `task02_iife.js` | IIFE | 使用立即執行函數建立封閉的作用域，避免全域變數污染。 |
| `task03_arrow_map.js` | map 轉換 | 用 `map` 與箭頭函數將產品價格進行折價映射。 |
| `task04_array_mutation.js` | 傳址修改 | 實驗直接修改陣列內部元素（Mutation）對外部陣列的影響。 |
| `task05_higher_order.js` | 閉包 (Closure) | 設計高階函數作為倍數產生器，用閉包將乘數鎖定在內部。 |
| `task06_custom_filter.js` | 手寫 filter | 不使用內建方法，手寫一個過濾陣列的 Filter 函數。 |
| `task07_object_filter.js` | 條件篩選 | 使用 `filter` 方法篩選出符合年齡門檻的物件陣列。 |
| `task08_reference_trap.js` | 傳參陷阱 | 實驗將變數作為參數傳入函數時，傳址與重新賦值的差別。 |
| `task08_explanation.md` | 記憶體分析 | 以文字寫出變數在 Stack 與 Heap 記憶體中的指標指向變化。 |
| `task09_delay_callback.js` | 非同步處理 | 利用 `setTimeout` 延遲任務的執行。 |
| `task10_total_price.js` | reduce 累加 | 用 `reduce` 計算購物車總金額，並以 Callback 計算滿千折百。 |

---

## 關鍵進階觀念彙整

### 1. 立即執行函數 (IIFE)
使用 `(function() { ... })()` 的寫法，宣告後不需要另外呼叫，會立刻在原處執行。最主要的用途是建立一個區域作用域，將臨時變數隔離在內，不讓它們跑到外部去污染全域變數。

### 2. 閉包 (Closure)
當內層函數存取了外層函數中的變數，且該內層函數被當作回傳值傳遞到外部執行時，就形成了閉包。即使外層函數已經執行完畢，內層函數依然會「記住」並鎖定那些外部變數的存取權限。

### 3. 傳址修改 (Mutation) 與 重新指派 (Reassignment)
* **傳址修改**：如呼叫 `arr.push(99)`，是直接改動變數所指向的同一個 Heap 陣列內容，因此外部變數的值會跟著改變。
* **重新指派**：如執行 `arr = [1, 2]`，是建立一個新陣列，並把本地指標指過去，外部變數指向的原陣列內容完全不受影響。

---

## 學習過程中的 Gemini CLI 對話紀錄

在做進階函數練習時，我被 callback 以及 JavaScript 的記憶體傳址陷阱搞得有點頭大，於是我向 Gemini CLI 助理（Gemini）尋求了詳細的解釋。以下是當時真實的問答過程：

> **User:**
> 幫我用 JavaScript 寫 10 題進階練習題。
> 題目需要包含：
> 1. Callback 實作一個簡易計算工具。
> 2. IIFE 隔離作用域。
> 3. map() 轉換商品價格。
> 4. 傳址修改（Mutation）實驗。
> 5. 用閉包（Closure）與高階函數做倍數產生器。
> 6. 不用內建方法，手寫 filter 函數。
> 7. 用 filter() 篩選符合年齡的使用者。
> 8. 傳參時「屬性修改」與「重新指派」的記憶體指針陷阱實驗。
> 9. 用 setTimeout 做非同步延遲。
> 10. 用 reduce() 算總價再傳入 Callback 折抵。
> 註解請用繁體中文。

> **Gemini 3 Flash Preview:**
> 沒問題！JavaScript 的進階函數概念（如閉包、IIFE、高階函數、傳參陷阱）是很多初學者容易卡關的地方，因為這些觀念與底層的記憶體模型息息相關。
> 
> 這裡為你設計這 10 題的完整實作。你可以把它們分別儲存為對應的 `.js` 檔案，用 Node.js 來執行測試。代碼中附有詳細的繁體中文註解說明：
> 
> ```javascript
> // 1. Callback 實作 (task01_callback.js)
> // 將運算邏輯當成參數傳入，實現程式解耦
> function calculate(num1, num2, operationCallback) {
>     return operationCallback(num1, num2);
> }
> console.log("Callback 測試 (10 + 5):", calculate(10, 5, (a, b) => a + b)); // 輸出: 15
> 
> // 2. IIFE 隔離作用域 (task02_iife.js)
> // 立即執行函數可以把變數隔離在內，不讓全域變數打架
> (function() {
>     const tempCounter = 999;
>     console.log("IIFE 內部變數:", tempCounter);
> })();
> // 在此處若寫 console.log(tempCounter) 會噴 ReferenceError，因為變數在外層不存在
> 
> // 3. Array.map() 轉換價格 (task03_arrow_map.js)
> const basePrices = [100, 200, 300, 400];
> const finalPrices = basePrices.map(price => price * 0.8);
> console.log("八折後的價格陣列:", finalPrices); // 輸出: [80, 160, 240, 320]
> 
> // 4. 傳址修改實驗 (task04_array_mutation.js)
> // 傳入陣列位址，直接操作會改動到外部的陣列
> function removeLastAndAddHeader(arr) {
>     arr.pop();
>     arr.unshift("Start");
> }
> const numbersList = [1, 2, 3];
> removeLastAndAddHeader(numbersList);
> console.log("外部受影響的陣列:", numbersList); // 輸出: ['Start', 1, 2]
> 
> // 5. 高階函數與閉包 (task05_higher_order.js)
> // multiplier 會回傳一個函數，並鎖定傳入的 factor 乘數
> function multiplier(factor) {
>     return function(num) {
>         return num * factor;
>     };
> }
> const triple = multiplier(3); // triple 是一個閉包，鎖定了 factor = 3
> console.log("閉包測試 (5 * 3):", triple(5)); // 輸出: 15
> 
> // 6. 自訂 filter 函數 (task06_custom_filter.js)
> // 手寫過濾器，幫助理解 Array.prototype.filter 的底層 for 迴圈原理
> function customFilter(array, testConditionFunc) {
>     const filteredResults = [];
>     for (let i = 0; i < array.length; i++) {
>         if (testConditionFunc(array[i])) {
>             filteredResults.push(array[i]);
>         }
>     }
>     return filteredResults;
> }
> console.log("手寫 Filter 測試:", customFilter([1, 2, 3, 4], x => x > 2)); // 輸出: [3, 4]
> 
> // 7. filter 過濾物件陣列 (task07_object_filter.js)
> const members = [
>     { name: "Alice", age: 25 },
>     { name: "Bob", age: 16 },
>     { name: "Charlie", age: 19 }
> ];
> const eligibleMembers = members.filter(member => member.age >= 18);
> console.log("已成年會員:", eligibleMembers);
> 
> // 8. 傳參重新賦值與傳址修改實驗 (task08_reference_trap.js)
> // 比對 Mutation 與 Reassignment 在傳參時的本質差別
> function referenceTrapExperiment(a, b) {
>     a.push(999); // 1. 傳址屬性修改 (會影響外部)
>     b = [100];   // 2. 重新指派 (只會影響函數內部的局部參數指標)
> }
> let arrayA = [1, 2];
> let arrayB = [3, 4];
> referenceTrapExperiment(arrayA, arrayB);
> console.log("陣列 A 狀態:", arrayA); // 輸出: [1, 2, 999] (外部被改動)
> console.log("陣列 B 狀態:", arrayB); // 輸出: [3, 4]      (外部不受影響)
> 
> // 9. setTimeout 延遲非同步 (task09_delay_callback.js)
> console.log("1. 任務已排程");
> setTimeout(() => {
>     console.log("3. 非同步延遲 2 秒任務執行完畢");
> }, 2000);
> console.log("2. 同步程式碼執行中...");
> 
> // 10. reduce 累加折扣 (task10_total_price.js)
> // 用 reduce 累加購物車商品價格，再透過 Callback 執行最終滿額折扣
> function calculateFinalPrice(cart, discountCallback) {
>     const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
>     return discountCallback(subtotal);
> }
> const myCart = [{ price: 100, quantity: 2 }, { price: 250, quantity: 1 }];
> const checkoutPrice = calculateFinalPrice(myCart, total => total >= 400 ? total - 50 : total);
> console.log("最終結帳價格:", checkoutPrice); // 輸出: 400 (200 + 250 = 450 -> 450 - 50 = 400)
> ```
> 
> 這是這 10 題完整的程式架構，每一題都針對特定的進階函數機制進行了實作。你可以直接執行這些程式碼。如果在測試某個題目時有疑問，隨時可以告訴我！

---

## 學習心得

這次作業讓我對 JavaScript 進階的變數行為有了非常清晰的認識。在實作 `task08` 傳址陷阱時，我特意寫了 Stack 與 Heap 的記憶體指針變化，終於搞懂了為什麼 `push` 會影響外部變數，而用 `=` 重新指派卻不會，這解決了我之前寫 JS 時常會遇到的隱蔽 Bug。另外，高階函數搭配閉包的寫法雖然一開始有點抽象，但一旦理解了它能將狀態鎖定在記憶體裡的特性，就能感覺到這種設計模式的強大與簡潔。
