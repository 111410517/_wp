// @ts-check

/**
 * 演示以 ES6 解構賦值 (Destructuring Assignment) 從客戶端請求中安全提取參數
 * 實踐防禦性解構 (Defensive Destructuring)，避免 null/undefined 指針崩潰
 */

// 模擬 Express.js 請求 context 物件
const incomingClientRequest = {
    headers: { "Content-Type": "application/json" },
    body: {
        postTitle: "Mastering Cloudflare Workers",
        postContent: "Edge computing has completely revolutionized the web deployment model..."
    }
};

/**
 * 安全解析並解構提取請求體中的內容
 * @param {Object} reqContext - 請求上下文
 */
function extractRequestPayload(reqContext) {
    // Fail-Fast & 可選鏈 + 空值合併防禦：即使 body 缺失或為 null，也不會拋出 TypeError 崩潰
    const { postTitle = "Untitled Post", postContent = "" } = reqContext?.body ?? {};
    
    console.log(`[Destructuring Success] Title: "${postTitle}"`);
    console.log(`[Destructuring Success] Content Snippet: "${postContent.slice(0, 30)}..."`);
}

// 正常解析
console.log("=== 1. 正常請求解構 ===");
extractRequestPayload(incomingClientRequest);

// 異常防禦解析 (模擬 Express 中 req.body 缺失或未配置 middleware 的情況)
console.log("\n=== 2. 異常空體請求解構 (Fail-Safe 防禦) ===");
extractRequestPayload({ headers: {} }); // 應輸出預設值，無任何崩潰