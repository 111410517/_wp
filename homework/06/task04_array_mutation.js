// @ts-check

/**
 * 破壞性地修改傳入的陣列：移除末尾元素，並在首部新增指定標籤
 * @template T
 * @param {T[]} targetArray - 待處理的泛型陣列
 * @param {T} prefixTag - 要插入在首部的元素
 * @returns {void}
 * @throws {TypeError} 當傳入參數非陣列時立即拋錯
 */
function mutateAndCleanDataset(targetArray, prefixTag) {
    // Fail-Fast 安全防護
    if (!Array.isArray(targetArray)) {
        throw new TypeError("傳入的參數 targetArray 必須是一個陣列！");
    }
    
    // 進行破壞性修改 (In-place Mutation)
    if (targetArray.length > 0) {
        targetArray.pop(); // 移除最後一個元素
    }
    targetArray.unshift(prefixTag); // 在首部插入新元素
}

// 宣告測試用的資料陣列
/** @type {any[]} */
const initialRecords = [1, 2, 3];

console.log("修改前陣列內容 ➔", initialRecords);

// 執行破壞性資料清洗
mutateAndCleanDataset(initialRecords, "Start");

// 觀察原始陣列已被直接變更，展現 Pass by Reference 傳址特性
console.log("修改後陣列內容 ➔", initialRecords);