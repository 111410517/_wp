// @ts-check

/** @type {number[]} */
const dataSequenceAlpha = [1, 2];
/** @type {number[]} */
const dataSequenceBeta = [3, 4];

/**
 * 處理函數：演示傳址 (Reference) 的修改與重新賦值差異
 * @param {number[]} sequenceA - 傳入的陣列 A (將對其進行 In-place Mutation)
 * @param {number[]} sequenceB - 傳入的陣列 B (將對其進行局部指標 Reassignment)
 * @returns {void}
 * @throws {TypeError} 參數校驗
 */
function processDataSequences(sequenceA, sequenceB) {
    if (!Array.isArray(sequenceA) || !Array.isArray(sequenceB)) {
        throw new TypeError("傳入的參數 sequenceA 與 sequenceB 必須是陣列！");
    }

    // 1. 修改操作：直接改變 sequenceA 所指向的原始記憶體陣列內容 (就地修改)
    //    這會改變該 JSArray 對應的 FixedArray 內容，影響外部實參。
    sequenceA.push(99);

    // 2. 重新賦值操作：將 sequenceB 的本地參數指標指向一個全新的陣列 [100]
    //    這僅改變了當前 Activation Frame (棧幀) 內局部變數的指向，不干擾外部。
    sequenceB = [100];
}

console.log("=== 執行 process 前 ===");
console.log("dataSequenceAlpha ➔", dataSequenceAlpha); // [1, 2]
console.log("dataSequenceBeta  ➔", dataSequenceBeta);  // [3, 4]

// 執行處理
try {
    processDataSequences(dataSequenceAlpha, dataSequenceBeta);
} catch (error) {
    console.error("執行失敗：", /** @type {Error} */ (error).message);
}

console.log("\n=== 執行 process 後 ===");
console.log("dataSequenceAlpha ➔", dataSequenceAlpha); // 變為 [1, 2, 99] ➔ 原始陣列被破壞性修改
console.log("dataSequenceBeta  ➔", dataSequenceBeta);  // 保持 [3, 4]     ➔ 原始陣列未受影響
