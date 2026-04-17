// @ts-check

/**
 * 演示在 Express / Node 中安全地進行 JSON.parse
 * 並在解析成功後進行強力的 Schema 屬性結構檢驗，防止伺服器因 Unhandled TypeError 崩潰
 */

const validJsonPayload = `{
    "courseName": "Advanced Web Design",
    "curriculumTopics": ["Edge Computing", "V8 VM Stack/Heap", "HMAC SHA256"]
}`;

const maliciousJsonPayload = `{ "courseName": "Prototype Pollution Attempt", "curriculumTopics": null }`;

/**
 * 安全解析並校驗課程 JSON 物件
 * @param {string} rawJsonStr - 待解析 JSON 字串
 * @returns {Object|null}
 */
function safelyParseAndValidateCourse(rawJsonStr) {
    if (typeof rawJsonStr !== 'string') return null;

    let parsedObject = null;
    try {
        parsedObject = JSON.parse(rawJsonStr);
    } catch (syntaxError) {
        console.warn("⚠️ [JSON 語法毀損] 解析失敗：", syntaxError.message);
        return null;
    }

    // 🌟 Schema 屬性存在校驗防線 (Defensive Validation)
    // 即使 JSON 語法正確，若欄位結構不符，存取深層屬性（如 parsedObject.curriculumTopics[1]）也會導致崩潰
    if (!parsedObject || typeof parsedObject !== 'object') {
        console.warn("⚠️ [Schema 校驗失敗] 解析後的資料非有效物件");
        return null;
    }

    const topics = parsedObject.curriculumTopics;
    if (!Array.isArray(topics) || topics.length < 2) {
        console.warn("⚠️ [Schema 校驗失敗] curriculumTopics 屬性缺失或長度不足");
        return null;
    }

    // 順利提取
    console.log(`[Schema Verified] Course: "${parsedObject.courseName}"`);
    console.log(`[Schema Verified] Second Topic: "${topics[1]}"`);
    return parsedObject;
}

// 正常測試
console.log("=== 1. 解析合法 JSON ===");
safelyParseAndValidateCourse(validJsonPayload);

// 異常測試 (防禦 parsedObject.curriculumTopics[1] 的 null 指針崩潰)
console.log("\n=== 2. 解析非法結構 JSON ===");
const result = safelyParseAndValidateCourse(maliciousJsonPayload);
console.log("返回結果 (已安全降級，未發生 Crash):", result);