// @ts-check

/**
 * 演示以 Array.prototype.sort 與 slice 進行排序，並安全生成文章摘要 (Excerpt)
 * 融入強型別與防溢出防線
 */

const articlesList = [
    { title: "Edge computing in 2026", viewCount: 950, content: "Edge computing has evolved rapidly over the past few years..." },
    { title: "V8 Escape Analysis Deep Dive", viewCount: 2400, content: "TurboFan compiler performs escape analysis to optimize memory allocation..." },
    { title: "Callback Event Queue Isolation", viewCount: 1500, content: "Unhandled callback exceptions can crash the entire Node.js main thread..." }
];

/**
 * 安全排序並截取熱門文章摘要
 * @param {Array<Object>} articles - 文章陣列
 * @param {number} topLimit - 熱門截取數量
 * @returns {Array<Object>}
 */
function getTopArticlesExcerpts(articles, topLimit = 2) {
    // Fail-Fast: 參數校驗
    if (!Array.isArray(articles)) {
        throw new TypeError("參數錯誤：文章必須為陣列");
    }
    if (typeof topLimit !== 'number' || Number.isNaN(topLimit) || topLimit <= 0) {
        throw new RangeError("參數錯誤：截取數量必須為正整數");
    }

    // 🌟 不可變性實踐 (Immutability)：使用 slice() 深拷貝陣列，避免破壞原始資料順序
    const sortedCopy = articles.slice().sort((a, b) => {
        const viewA = a?.viewCount ?? 0;
        const viewB = b?.viewCount ?? 0;
        return viewB - viewA; // 降序排序
    });

    // 截取前 N 筆並生成安全摘要
    return sortedCopy.slice(0, topLimit).map(art => {
        const rawContent = art?.content ?? "";
        // 限制摘要長度為 30 字元，並安全處理空內容
        const excerpt = rawContent.length > 30 ? `${rawContent.slice(0, 30)}...` : rawContent;
        return {
            title: art?.title ?? "Untitled",
            views: art?.viewCount ?? 0,
            excerpt: excerpt
        };
    });
}

// 執行與測試
try {
    console.log("=== 熱門文章摘要 (Top 2) ===");
    console.log(JSON.stringify(getTopArticlesExcerpts(articlesList, 2), null, 4));
} catch (e) {
    console.error("生成摘要失敗:", e.message);
}