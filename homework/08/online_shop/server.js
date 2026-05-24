/**
 * @file homework/08/online_shop/server.js
 * @description 瑞士包浩斯潮流外設商城 - 生產級安全 Static & API 原生 HTTP 伺服器
 * @student 洪晨祐 (111410517)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PRODUCTS_DB = [
    { id: 1, name: "Bauhaus 幾何真皮托特包", price: 2400, category: "質感配件", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "極簡啞光不鏽鋼保溫杯", price: 980, category: "生活美學", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "包浩斯紅黃藍撞色針織帽", price: 850, category: "潮流服飾", img: "https://images.unsplash.com/photo-1576871337622-98d48d4353c0?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "復古雙橋防藍光黑框眼鏡", price: 1800, category: "質感配件", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "瑞士網格機械式鍵盤 (紅軸)", price: 3600, category: "數碼周邊", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "幾何對稱皮質薄型直角長夾", price: 1950, category: "質感配件", img: "https://images.unsplash.com/photo-1627124718185-6ac245e49ad7?auto=format&fit=crop&w=600&q=80" },
    { id: 7, name: "啞光黑陶瓷包浩斯馬克杯", price: 550, category: "生活美學", img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80" },
    { id: 8, name: "純棉重磅直角裁剪白色短T", price: 790, category: "潮流服飾", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80" },
    { id: 9, name: "純棉重磅直角裁剪黑色短T", price: 790, category: "潮流服飾", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80" },
    { id: 10, name: "極簡鋁合金噴砂名片夾", price: 450, category: "質感配件", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80" },
    { id: 11, name: "水泥幾何桌上型靜音時鐘", price: 1200, category: "生活美學", img: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80" },
    { id: 12, name: "三原色幾何滑鼠墊 (大)", price: 600, category: "數碼周邊", img: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80" }
];

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png"
};

const BASE_DIR = path.resolve(__dirname);

const server = http.createServer((req, res) => {
    // 1. CORS 預檢攔截
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    console.log(`[HTTP Request] ${req.method} ${pathname}`);

    // 2. API 路由
    if (pathname === "/products") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(PRODUCTS_DB));
    }

    // 3. 靜態資源安全分發 (Stream + Path Traversal Defense)
    let safeRelativePath = pathname;
    if (pathname === "/" || pathname === "/index.html") {
        safeRelativePath = "/index.html";
    }

    // 圖片路徑適配
    let targetFilePath;
    if (safeRelativePath.startsWith("/images/")) {
        targetFilePath = path.resolve(path.join(BASE_DIR, "public", safeRelativePath));
    } else {
        targetFilePath = path.resolve(path.join(BASE_DIR, safeRelativePath));
    }

    // 🌟 鋼鐵防線：防止目錄越界路徑遍歷攻擊 (Path Traversal Defense)
    const relative = path.relative(BASE_DIR, targetFilePath);
    const isOut = relative.startsWith('..') || path.isAbsolute(relative);
    if (isOut) {
        console.warn(`🚨 [安全警報] 偵測到越界路徑遍歷攻擊! 請求路徑: ${pathname} -> 物理路徑: ${targetFilePath}`);
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("403 Forbidden: 拒絕存取越界路徑。");
    }

    // 4. 讀取檔案狀態並發送 Stream
    fs.stat(targetFilePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            return res.end("404 Not Found: 找不到請求的資源。");
        }

        const ext = path.extname(targetFilePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        res.writeHead(200, { "Content-Type": contentType });

        // 🌟 緩衝管道流分發，避免一次性讀入記憶體，杜絕 OOM 崩潰
        const stream = fs.createReadStream(targetFilePath);
        stream.on("error", (streamErr) => {
            console.error(`[Stream Error] 發送檔案失敗: ${targetFilePath}`, streamErr);
            if (!res.headersSent) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("500 Internal Server Error");
            }
        });
        stream.pipe(res);
    });
});

server.listen(3000, () => {
    console.log("🏪 晨祐潮流外設商店本地 HTTP 服務已啟動 ➔ http://localhost:3000");
});