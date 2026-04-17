// @ts-check

/**
 * 原始價格數據，採用 ReadonlyArray 進行不可變性限制
 * @type {readonly number[]}
 */
const originalItemPrices = Object.freeze([100, 200, 300, 400]);

/**
 * 使用 map 結合單行箭頭函數進行 8 折 (20% off) 的非破壞性轉換
 * @type {readonly number[]}
 */
const memberSpecialPrices = originalItemPrices.map(price => {
    if (typeof price !== 'number' || isNaN(price)) {
        throw new TypeError("陣列內包含無效的價格數據");
    }
    return price * 0.8;
});

// 格式化輸出，以展示專業度
console.log("原始價格陣列 (唯讀) ➔", originalItemPrices);
console.log("八折特惠價格 (全新) ➔", memberSpecialPrices);