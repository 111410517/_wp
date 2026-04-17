// @ts-check

/**
 * 演示在樣板字串 (Template Literals) 中嵌入三元條件邏輯 (Ternary Operator)
 * 並進行 XSS 轉義防禦 (Sanitization)，實現安全的前端 UI 渲染
 */

const visitorsRegistryList = [
    { username: "HongChenYou", isVipMember: true },
    { username: "Guest_User_99", isVipMember: false },
    { username: "<script>alert('XSS!')</script>", isVipMember: false }
];

/**
 * 安全 HTML Entity 轉義
 * @param {string} rawText 
 * @returns {string}
 */
function secureHtmlSanitizer(rawText) {
    if (typeof rawText !== 'string') return "";
    return rawText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * 動態渲染訪客迎賓詞
 * @param {Object} visitor 
 * @returns {string}
 */
function compileVisitorWelcomeBanner(visitor) {
    const cleanName = secureHtmlSanitizer(visitor?.username ?? "Anonymous Geek");
    const isVip = !!visitor?.isVipMember;

    // 🌟 在樣板字串中動態內嵌三元運算元，判定其 VIP 等級與徽章
    return `[WELCOME BANNER] ➔ Welcome, ${cleanName}! ${isVip ? "★ PREMIUM VIP ACCESS GRANTED ★" : "// Standard Tier Account"}`;
}

// 遍歷渲染
console.log("=== 訪客迎賓看板動態渲染 (XSS 防禦驗證) ===");
visitorsRegistryList.forEach(visitor => {
    console.log(compileVisitorWelcomeBanner(visitor));
});