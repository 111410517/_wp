// @ts-check

/**
 * @template T
 * @callback FilterPredicate
 * @param {T} element - 當前處理的元素
 * @param {number} index - 當前元素的索引
 * @param {readonly T[]} array - 呼叫此方法的唯讀陣列本身
 * @returns {boolean} 是否保留此元素
 */

/**
 * 嚴格遵循 ECMAScript 規範的自定義陣列篩選器 (Fail-Fast + Generics)
 * @template T
 * @param {readonly T[]} targetList - 待篩選的唯讀陣列
 * @param {FilterPredicate<T>} criteriaCallback - 決定元素是否保留的判定函數
 * @returns {T[]} 篩選後產生的全新陣列
 * @throws {TypeError} 當參數型別不符時拋出異常
 */
function customArrayFilter(targetList, criteriaCallback) {
    if (!Array.isArray(targetList)) {
        throw new TypeError("第一個參數 targetList 必須是陣列！");
    }
    if (typeof criteriaCallback !== 'function') {
        throw new TypeError("第二個參數 criteriaCallback 必須是函數！");
    }

    /** @type {T[]} */
    const filteredResultList = [];

    // 遍歷陣列元素，嚴格傳遞 (element, index, array) 三參數
    for (let index = 0; index < targetList.length; index++) {
        const currentItem = targetList[index];
        if (criteriaCallback(currentItem, index, targetList)) {
            filteredResultList.push(currentItem);
        }
    }

    return filteredResultList;
}

// 測試數據
/** @type {readonly number[]} */
const sampleNumberList = Object.freeze([1, 5, 8, 12]);

// 使用自製篩選器，過濾出大於 7 的數字
const itemsGreaterThanSeven = customArrayFilter(sampleNumberList, (number) => number > 7);

console.log("原始陣列 ➔", sampleNumberList);
console.log("篩選結果 (大於 7) ➔", itemsGreaterThanSeven);