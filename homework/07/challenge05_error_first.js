// @ts-check

/**
 * 1. 異步安全回呼隊列 (AsyncSafeCallbackQueue)
 * 解決問題：防止 "Zalgo" (同步非同步混淆)，確保 Callback 永遠在下一個 Tick 執行，並隔離 Callback 內部崩潰。
 */
class AsyncSafeCallbackQueue {
    /**
     * 以異步且安全的方式執行 Error-First Callback
     * @param {Function} callback - 回呼函數
     * @param {Error|string|null} err - 錯誤物件或錯誤訊息
     * @param {*} data - 回傳的數據 Payload
     */
    static safeExecute(callback, err, data) {
        if (typeof callback !== 'function') {
            // 靜默防止非函數傳入導致的主執行緒崩潰
            return;
        }

        // 強制推遲到下一個 Event Loop Tick 執行 (釋放 Zalgo)
        setImmediate(() => {
            try {
                // 將字串錯誤標準化為 Error 物件，保留 Stack Trace
                const normalizedError = (err && typeof err === 'string') ? new Error(err) : err;
                callback(normalizedError, data);
            } catch (callbackInternalError) {
                // 【異常隔離】即使 Callback 內部代碼拋出未捕獲異常，也僅在此被捕獲隔離，絕不拖垮伺服器主行程
                console.error("🚨 [Callback Event Queue 異常隔離防護啟動] 偵測到 Callback 內部未捕獲異常:", callbackInternalError.stack);
            }
        });
    }
}

/**
 * 模擬從後端伺服器獲取用戶貼文資料 (Error-First Callback 範式)
 * @param {number} userId - 用戶學號 ID
 * @param {Function} resultCallback - 錯誤優先回呼函數 (error, payload)
 */
function simulateServerDataFetch(userId, resultCallback) {
    if (typeof resultCallback !== 'function') {
        throw new TypeError("必須提供有效的回呼函數");
    }

    if (typeof userId !== 'number' || Number.isNaN(userId) || userId <= 0) {
        // 同步偵測到錯誤，但仍以非同步方式 safeExecute 返回，確保 API 語意 100% 異步 (阻斷 Zalgo)
        return AsyncSafeCallbackQueue.safeExecute(resultCallback, "錯誤：userId 必須為正整數！", null);
    }

    // 模擬網路延遲與隨機成功/失敗
    setTimeout(() => {
        try {
            const isSuccess = Math.random() > 0.15; // 85% 成功率
            if (isSuccess) {
                const mockedData = {
                    retrievedAt: new Date().toISOString(),
                    payload: [
                        { id: 101, text: "Unveiling Edge Computing with Workers" },
                        { id: 102, text: "V8 memory space逃逸分析" }
                    ]
                };
                AsyncSafeCallbackQueue.safeExecute(resultCallback, null, mockedData);
            } else {
                AsyncSafeCallbackQueue.safeExecute(resultCallback, "網路連線超時：邊緣端節點無回應", null);
            }
        } catch (e) {
            AsyncSafeCallbackQueue.safeExecute(resultCallback, e, null);
        }
    }, 100);
}

// --- 測試安全異步執行 ---
console.log("=== 1. 啟動異步獲取貼文 (Zalgo 阻斷驗證) ===");
simulateServerDataFetch(111410517, (err, result) => {
    if (err) {
        console.error("❌ 獲取貼文失敗:", err.message);
    } else {
        console.log("✔ 獲取貼文成功! 資料時間:", result.retrievedAt);
        console.log("資料內容:", result.payload);
    }
});
console.log("👉 這是同步運算行。這行程式應在 Callback 之前印出，證實 100% 釋放了 Zalgo！");