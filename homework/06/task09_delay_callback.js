// @ts-check

/**
 * 待拼接的唯讀字串陣列
 * @type {readonly string[]}
 */
const wordsSequence = Object.freeze(["Task", "Completed"]);

console.log("非同步計時器啟動，等待 2 秒鐘...");

// 呼叫 setTimeout，傳入箭頭函數作為 Callback，設定延遲為 2000ms
// 此 Callback 透過閉包持有對 Heap 中 wordsSequence 的唯讀指標參照
setTimeout(() => {
    try {
        const concatenatedString = wordsSequence.join(" ");
        console.log(`➔ [2秒延遲輸出]：${concatenatedString}`);
    } catch (error) {
        console.error("非同步執行錯誤：", /** @type {Error} */ (error).message);
    }
}, 2000);