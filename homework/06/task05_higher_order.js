// @ts-check

/**
 * 建立一個乘數產生器 (高階函數)，利用閉包 (Closure) 鎖定倍數因子
 * 經 V8 逃逸分析，scaleFactor 會被保存在 Heap 中的 Context 物件中
 * @param {number} scaleFactor - 倍數因子
 * @returns {(inputValue: number) => number} - 接收數字並回傳乘積的閉包函數
 * @throws {TypeError} 當 scaleFactor 不是有效數字時拋錯
 */
const createNumberMultiplier = (scaleFactor) => {
    if (typeof scaleFactor !== 'number' || isNaN(scaleFactor)) {
        throw new TypeError("倍數因子 scaleFactor 必須是有效數字！");
    }
    // 傳回的箭頭函數持續持有對 Heap 中 Context 物件裡 scaleFactor 的指標參照
    return (inputValue) => {
        if (typeof inputValue !== 'number' || isNaN(inputValue)) {
            throw new TypeError("輸入數值 inputValue 必須是有效數字！");
        }
        return inputValue * scaleFactor;
    };
};

// 測試：產生一個 2 倍的乘數器 (雙倍器)
const doubleMultiplier = createNumberMultiplier(2);
console.log("雙倍器測試 doubleMultiplier(10) ➔ 實際輸出：", doubleMultiplier(10));

// 測試：產生一個 5 倍的乘數器 (五倍器)
const quintupleMultiplier = createNumberMultiplier(5);
console.log("五倍器測試 quintupleMultiplier(8) ➔ 實際輸出：", quintupleMultiplier(8));