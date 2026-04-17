// @ts-check

/**
 * 演示遍歷數值陣列，並使用樣板字串 (Template Literals) 動態且安全地渲染 HTML 列表
 * 融入防禦性過濾與防 XSS 字元安全 Sanitization 實踐
 */

const blogPostsDataset = [
    { title: "Introduction to V8 Engine", author: "admin" },
    { title: "Building API Gateway with Express", author: "HongChenYou" },
    { title: "CORS preflight request standard", author: "HongChenYou" }
];

/**
 * 簡單的 HTML 實體轉義函數 (XSS Defensive Sanitization)
 * @param {string} rawString - 原始可能包含惡意載荷的字串
 * @returns {string} 安全的 HTML 轉義字串
 */
function sanitizeHtmlString(rawString) {
    if (typeof rawString !== 'string') return "";
    return rawString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * 將貼文數據編譯為 HTML 字串
 * @param {Array<Object>} posts - 貼文陣列
 * @returns {string} 渲染後的 HTML 列表
 */
function renderPostsHtmlList(posts) {
    if (!Array.isArray(posts)) {
        throw new TypeError("渲染錯誤：必須提供貼文陣列");
    }

    let accumulatedHtml = '<ul class="post-feed-list">\n';

    // 遍歷並拼接
    posts.forEach((post, index) => {
        const cleanTitle = sanitizeHtmlString(post?.title ?? "Untitled");
        const cleanAuthor = sanitizeHtmlString(post?.author ?? "Anonymous");
        accumulatedHtml += `  <li id="post-item-${index}">\n    <h3 class="post-title">${cleanTitle}</h3>\n    <span class="post-author">By: ${cleanAuthor}</span>\n  </li>\n`;
    });

    accumulatedHtml += '</ul>';
    return accumulatedHtml;
}

// 輸出 HTML 渲染結果
console.log("=== 渲染生成的安全 HTML 列表 ===");
console.log(renderPostsHtmlList(blogPostsDataset));