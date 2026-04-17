// @ts-check

/**
 * @callback MathOperation
 * @param {number} operandA - 第一個數值運算元
 * @param {number} operandB - 第二個數值運算元
 * @returns {number} 數學運算後的結果
 */

/**
 * 執行高階數學運算，並進行嚴格的型別校驗 (Fail-Fast 哲學)
 * @param {number} val1 - 第一個數值
 * @param {number} val2 - 第二個數值
 * @param {MathOperation} operationCallback - 執行具體數學運算的回呼函數
 * @returns {number} 運算結果
 * @throws {TypeError} 當參數型別不符時拋出異常
 */
function executeMathOperation(val1, val2, operationCallback) {
    if (typeof val1 !== 'number' || isNaN(val1)) {
        throw new TypeError("第一個參數必須是有效的數字！");
    }
    if (typeof val2 !== 'number' || isNaN(val2)) {
        throw new TypeError("第二個參數必須是有效的數字！");
    }
    if (typeof operationCallback !== 'function') {
        throw new TypeError("第三個參數必須是有效的回呼函數！");
    }
    return operationCallback(val1, val2);
}

// 測試與調用 (使用箭頭函數進行運算定義)
/** @type {MathOperation} */
const addFunc = (a, b) => a + b;
/** @type {MathOperation} */
const subtractFunc = (a, b) => a - b;
/** @type {MathOperation} */
const multiplyFunc = (a, b) => a * b;

try {
    console.log("相加 (10, 5) ➔", executeMathOperation(10, 5, addFunc));
    console.log("相減 (10, 5) ➔", executeMathOperation(10, 5, subtractFunc));
    console.log("相乘 (10, 5) ➔", executeMathOperation(10, 5, multiplyFunc));
} catch (error) {
    console.error("執行出錯：", /** @type {Error} */ (error).message);
}
