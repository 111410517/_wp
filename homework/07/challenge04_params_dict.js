// @ts-check

/**
 * 演示字典 (Map / Key-Value Dict) 應用，模擬 Express.js 處理 URL 路由參數 (/users/:userId)
 * 進行強型別校驗與防禦性 key 存在確認
 */

// 模擬 Express 路由參數字典 `req.params`
const incomingRequestParams = {
    userId: "111410517",
    requestId: "uuid_87bf31d3395b4bf7aad"
};

/**
 * 從字典中獲取對應參數，進行類型轉換與 Fail-Fast 防護
 * @param {Object} paramsDict - 參數字典物件
 * @param {string} targetKey - 目標鍵名
 * @returns {number} 轉換為數字的主鍵 ID
 * @throws {TypeError} 型別不符時拋出
 * @throws {RangeError} ID 無效時拋出
 */
function extractRouteNumericId(paramsDict, targetKey) {
    if (!paramsDict || typeof paramsDict !== 'object') {
        throw new TypeError("參數字典錯誤：無效的字典輸入");
    }
    
    // 原型鏈污染防範
    if (!Object.prototype.hasOwnProperty.call(paramsDict, targetKey)) {
        throw new RangeError(`路由參數缺失：未在 params 中找到指定的鍵值 "${targetKey}"`);
    }

    const rawValue = paramsDict[targetKey];
    const parsedNumber = parseInt(rawValue, 10);

    if (Number.isNaN(parsedNumber) || parsedNumber <= 0) {
        throw new RangeError(`路由參數無效：鍵值 "${targetKey}" 的數值 "${rawValue}" 無法轉為有效正整數`);
    }

    return parsedNumber;
}

// 正常測試
try {
    const userId = extractRouteNumericId(incomingRequestParams, "userId");
    console.log(`[Params Parser] Parsed User ID Successfully: ${userId} (${typeof userId})`);
} catch (e) {
    console.error("解析失敗:", e.message);
}