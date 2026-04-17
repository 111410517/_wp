// @ts-check

// 引用上一題定義的 AsyncSafeCallbackQueue 進行 Zalgo 釋放與異常隔離
class AsyncSafeCallbackQueue {
    static safeExecute(callback, err, data) {
        if (typeof callback !== 'function') return;
        setImmediate(() => {
            try {
                const normalizedError = (err && typeof err === 'string') ? new Error(err) : err;
                callback(normalizedError, data);
            } catch (callbackInternalError) {
                console.error("🚨 [Callback Event Queue 異常隔離防護] Callback 內部崩潰:", callbackInternalError.stack);
            }
        });
    }
}

/**
 * 安全模擬資料庫查詢單筆 Row
 * @param {string} sqlQueryString - SQL 語句
 * @param {Array} queryBindings - 替換占位符的參數陣列
 * @param {Function} resultCallback - 錯誤優先回呼函數 (err, row)
 */
function simulateDatabaseQuerySingle(sqlQueryString, queryBindings, resultCallback) {
    // 頂層強防禦
    if (typeof resultCallback !== 'function') {
        throw new TypeError("必須提供有效的回呼函數以接收資料庫查詢結果！");
    }

    if (typeof sqlQueryString !== 'string' || sqlQueryString.trim() === '') {
        return AsyncSafeCallbackQueue.safeExecute(resultCallback, "資料庫異常：SQL 語句必須為非空字串！", null);
    }

    if (!Array.isArray(queryBindings)) {
        return AsyncSafeCallbackQueue.safeExecute(resultCallback, "資料庫異常：SQL 綁定參數必須以陣列格式提供！", null);
    }

    // 1. 語法安全檢驗：匹配佔位符 `?` 數量與綁定參數數量是否嚴格一致
    const placeholderCount = (sqlQueryString.match(/\?/g) || []).length;
    if (placeholderCount !== queryBindings.length) {
        return AsyncSafeCallbackQueue.safeExecute(
            resultCallback, 
            `資料庫異常：SQL 參數綁定數量不匹配！預期 ${placeholderCount} 個，實際收到 ${queryBindings.length} 個。`, 
            null
        );
    }

    try {
        // 2. 參數 Sanitization：對每一個綁定參數進行型別檢驗，防止複雜型別（如物件原型注入）
        const sanitizedParams = queryBindings.map((param, index) => {
            if (param === null || param === undefined) return null;
            
            // 拒絕傳入 Object 或 Function，防止型別混淆攻擊
            if (typeof param === 'object' || typeof param === 'function') {
                throw new TypeError(`SQL 綁定參數位置 [${index}] 偵測到不安全型別: ${typeof param}`);
            }
            return param;
        });

        // 3. 安全取得主鍵 ID (假定第一個為查詢 ID)
        const targetId = sanitizedParams[0];
        if (typeof targetId !== 'number' || isNaN(targetId) || targetId <= 0) {
            return AsyncSafeCallbackQueue.safeExecute(resultCallback, "資料庫異常：查詢 ID 必須為大於 0 的有效數字！", null);
        }

        // 4. 模擬從資料庫讀取 Row (回傳深拷貝物件，防止外部修改影響 DB 狀態)
        const simulatedRecordRow = {
            id: targetId,
            articleHeadline: "Unveiling Edge Computing with Cloudflare Workers",
            articleAuthor: "HongChenYou_111410517",
            articleBody: "Serverless Workers allow us to deploy JavaScript directly..."
        };

        return AsyncSafeCallbackQueue.safeExecute(resultCallback, null, JSON.parse(JSON.stringify(simulatedRecordRow)));

    } catch (sanitizationError) {
        return AsyncSafeCallbackQueue.safeExecute(resultCallback, `資料庫 Sanitization 失敗: ${sanitizationError.message}`, null);
    }
}

// --- 測試安全 Fake DB 查詢 ---
console.log("=== 正常資料庫查詢 ===");
const secureSql = "SELECT * FROM articles WHERE id = ? LIMIT 1";
simulateDatabaseQuerySingle(secureSql, [111410517], (err, row) => {
    if (err) {
        console.error("❌ 查詢失敗:", err.message);
    } else {
        console.log("✔ 查詢成功! 文章標題 ➔", row.articleHeadline);
    }
});

console.log("\n=== 惡意 SQL 參數型別注入攔截 ===");
simulateDatabaseQuerySingle(secureSql, [{ malicious: "UNION SELECT..." }], (err, row) => {
    if (err) {
        console.log("🛡️ [防禦成功] 成功攔截不安全參數 ➔", err.message);
    }
});