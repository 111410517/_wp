// @ts-check

/**
 * @callback DiscountCalculator
 * @param {number} subtotal - 購物車小計金額
 * @returns {number} 折扣後的最終應付金額
 */

/**
 * 計算購物車總金額並套用非同步或自定義折扣計算
 * @param {readonly number[]} shoppingCartPrices - 唯讀商品價格陣列
 * @param {DiscountCalculator} applyDiscountCallback - 折扣計算回呼函數
 * @returns {number} 扣除折扣後最終應付總額
 * @throws {TypeError} 輸入無效時拋錯
 * @throws {RangeError} 當折扣計算結果為負數時拋錯
 */
function evaluateCartGrandTotal(shoppingCartPrices, applyDiscountCallback) {
    // Fail-Fast 強健校驗
    if (!Array.isArray(shoppingCartPrices)) {
        throw new TypeError("第一個參數 shoppingCartPrices 必須為有效的數字陣列！");
    }
    if (typeof applyDiscountCallback !== 'function') {
        throw new TypeError("第二個參數 applyDiscountCallback 必須為有效的折扣計算函數！");
    }

    // 利用 Array.prototype.reduce 累加購物車內所有商品的價格，預設初始值為 0
    const rawSubtotal = shoppingCartPrices.reduce((accumulator, currentPrice) => {
        if (typeof currentPrice !== 'number' || isNaN(currentPrice)) {
            throw new TypeError("購物車內包含無效的非數字商品價格！");
        }
        return accumulator + currentPrice;
    }, 0);

    console.log(`[計算日誌] 購物車原始小計 ➔ ${rawSubtotal} 元`);

    // 進行折扣運算
    const finalTotal = applyDiscountCallback(rawSubtotal);

    if (typeof finalTotal !== 'number' || isNaN(finalTotal)) {
        throw new TypeError("折扣計算函數必須返回有效的數值！");
    }
    if (finalTotal < 0) {
        throw new RangeError("折抵後的最終結帳金額不能為負數！");
    }

    return finalTotal;
}

// 測試用商品價格唯讀陣列
/** @type {readonly number[]} */
const myTempCartItems = Object.freeze([100, 200, 300]);

try {
    // 執行計算，傳入匿名箭頭函數扣除 50 元折扣
    const finalCheckoutAmount = evaluateCartGrandTotal(myTempCartItems, (subtotalSum) => {
        // 防抵扣為負值，若總額大於 50 元則折抵 50 元，否則免單
        return subtotalSum > 50 ? subtotalSum - 50 : 0;
    });
    console.log(`➔ 折扣後最終結帳金額 ➔ ${finalCheckoutAmount} 元 (已折抵 50 元)`);
} catch (error) {
    console.error("結帳失敗：", /** @type {Error} */ (error).message);
}