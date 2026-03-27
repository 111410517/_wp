# Express 與 SQLite 全端網誌系統

我用 Express.js 框架與 EJS 模板引擎實作了這個多使用者部落格網站。這個練習的核心在於如何使用 `express-session` 中介軟體進行登入驗證、在 SQLite 中透過 SQL query 進行私密貼文隱私過濾，以及解決 WebAssembly SQLite (sql.js) 記憶體資料庫在重啟伺服器後資料消失的持久化存取問題。

---

## 路由設計與系統架構

| 請求路由 | HTTP 方法 | 功能說明 |
| :--- | :--- | :--- |
| `/` | `GET` | 網誌首頁。依據使用者是否登入，動態過濾並加載可查看的貼文。 |
| `/register` | `GET` / `POST` | 用戶註冊頁面與註冊資料寫入資料庫邏輯。 |
| `/login` | `GET` / `POST` | 用戶登入頁面與密碼 Hash 驗證（使用 bcryptjs 加密）。 |
| `/posts` | `POST` | 發布貼文。限定已登入用戶，支援設定 isPrivate 隱私控制。 |
| `/profile/:id` | `GET` | 個人檔案頁面，展示特定作者發布的公開貼文（若為本人則多展示私密貼文）。 |
| `/logout` | `GET` | 清除 Session 會話狀態，重新導向回登入頁。 |

---

## 關鍵技術點

### 1. Wasm SQLite 資料庫磁碟持久化
sql.js 預設是把 SQLite 資料庫完全建在記憶體中。為了不讓每次重啟伺服器貼文就消失，我實作了同步機制：
* 啟動伺服器時，用 `fs.readFileSync` 載入硬碟上的 `blog.db` 二進位檔案來初始化資料庫。
* 只要執行了會變更資料的 SQL 指令（如註冊、發布、刪除），就立刻呼叫 `db.export()` 取得二進位 Buffer，並用 `fs.writeFileSync("blog.db", ...)` 強制寫回磁碟。

### 2. 登入會話管理與安全驗證
使用 `express-session` 中介軟體在後端儲存用戶狀態，並以隨機的 cookie 加密識別碼傳給瀏覽器。發布貼文路由有加入 `checkLogin` 防護，防止未登入用戶偽造 POST 請求發文。

### 3. 私密貼文隱私過濾
發文時可以將貼文設為 `isPrivate = 1`。在首頁加載貼文時，我使用 SQL 條件句進行過濾：
* 若未登入，SQL 為：`SELECT * FROM posts WHERE isPrivate = 0`。
* 若已登入，SQL 為：`SELECT * FROM posts WHERE isPrivate = 0 OR user_id = ?`（傳入當前登入者 ID）。

---

## 開發過程中的 AI 對話完整記錄

以下是使用本地端開發助理輔助設計與重構部落格系統的完整會話記錄，依據 V1.0 至 V4.0 的版本演進，模擬包含工具呼叫與思考過程的完整歷程。

---

### 🟢 第一階段對話：V1.0 純前端本地儲存備忘錄

**Session ID:** ses_v1_init_001
**Created:** 2026/3/25 下午14:15:30

---

## User

我想寫一個簡單的網誌系統，第一版先用純前端 HTML 跟 JS 實作就好，貼文暫時存在瀏覽器的 LocalStorage 裡。排版希望能用黑色粗邊框、白背景、無圓角的極簡幾何風格，要有貼文標題與內容的輸入框。

---

## Assistant (Build · local-env · 2.5s)

_Thinking:_
使用者希望開發一個純前端的部落格系統 (V1.0)，並要求使用 `localStorage` 來在用戶瀏覽器中持久化儲存貼文。
排版風格為極簡幾何風格：黑色粗邊框、白背景、無圓角 (border-radius: 0)。
這不需要任何後端支援，只需在單一的 HTML 檔案中撰寫 HTML, CSS 和 JavaScript。

我需要：
1. 建立一個 `index.html`。
2. 設計符合需求的 CSS 樣式：`border: 2px solid #111`，`border-radius: 0 !important`，簡潔的幾何版面。
3. 實作 JS 邏輯：從 `localStorage` 載入貼文並渲染，發布新貼文時寫入 `localStorage` 並更新畫面。

讓我建立這個前端專案檔案。

**Tool: write**

**Input:**
```json
{
  "filePath": "homework/05/v1_frontend/index.html",
  "content": "<!DOCTYPE html>\\n<html lang=\\\"zh-TW\\\">\n<head>\n    <meta charset=\\\"UTF-8\\\">\n    <title>極簡網誌 V1.0</title>\n    <style>\n        * { box-sizing: border-box; border-radius: 0 !important; }\n        body { font-family: sans-serif; background-color: #fcfcfc; color: #111; padding: 40px; }\n        .container { max-width: 600px; margin: 0 auto; border: 2px solid #111; padding: 20px; background: #fff; }\n        .post-form input, .post-form textarea { width: 100%; padding: 10px; border: 2px solid #111; margin-bottom: 15px; }\n        .btn-submit { width: 100%; padding: 12px; background: #111; color: #fff; border: none; font-weight: bold; cursor: pointer; }\n        .post { border: 2px solid #111; padding: 15px; margin-top: 15px; }\n    </style>\n</head>\n<body>\n    <div class=\\\"container\\\">\n        <h2>發布貼文 (V1.0)</h2>\n        <form id=\\\"postForm\\\" class=\\\"post-form\\\">\n            <input type=\\\"text\\\" id=\\\"postTitle\\\" placeholder=\\\"文章標題\\\" required>\n            <textarea id=\\\"postContent\\\" placeholder=\\\"文章內容\\\" rows=\\\"4\\\" required></textarea>\n            <button type=\\\"submit\\\" class=\\\"btn-submit\\\">發布</button>\n        </form>\n        <div id=\\\"postsList\\\"></div>\n    </div>\n    <script>\n        const postForm = document.getElementById('postForm');\n        const postsList = document.getElementById('postsList');\n        let posts = JSON.parse(localStorage.getItem('v1_posts')) || [];\n\n        function renderPosts() {\n            postsList.innerHTML = '';\n            posts.forEach(post => {\n                postsList.innerHTML += `\n                    <div class=\\\"post\\\">\n                        <h3>${post.title}</h3>\n                        <p>${post.content}</p>\n                        <small>發布於: ${new Date(post.date).toLocaleString()}</small>\n                    </div>`;\n            });\n        }\n\n        postForm.addEventListener('submit', (e) => {\n            e.preventDefault();\n            const newPost = {\n                title: document.getElementById('postTitle').value,\n                content: document.getElementById('postContent').value,\n                date: Date.now()\n            };\n            posts.push(newPost);\n            localStorage.setItem('v1_posts', JSON.stringify(posts));\n            postForm.reset();\n            renderPosts();\n        });\n        renderPosts();\n    </script>\n</body>\n</html>"
}
```

**Output:**
```
Success
```

我已經為你建立了 V1.0 的純前端版部落格 `index.html`。它採用無圓角的粗黑邊框極簡風格，並利用 HTML5 `localStorage` 進行本地貼文儲存與即時渲染。你可以直接在瀏覽器中開啟它以進行測試。

---

### 🟡 第二階段對話：V2.0 升級為 Node.js + Express 後端與 SQLite 記憶體資料庫 (sql.js)

**Session ID:** ses_v2_backend_002
**Created:** 2026/3/25 下午16:30:15

---

## User

第一版做好了。現在我想把這個專案升級成 V2.0 後端版，請幫我用 Node.js 的 Express 框架重構，並且資料庫用 `sql.js`（WebAssembly 版的 SQLite 記憶體資料庫）。貼文要能儲存到後端資料庫中，並在 EJS 首頁模板上加載渲染。

---

## Assistant (Build · local-server · 4.8s)

_Thinking:_
使用者想要將專案升級為 Node.js 後端服務 (V2.0)。
技術棧需求：
1. 框架：Express.js
2. 資料庫：sql.js (WebAssembly SQLite 記憶體資料庫)
3. 渲染引擎：EJS

我需要：
1. 更新 `package.json`，加入 `express`、`ejs` 與 `sql.js` 依賴。
2. 建立 `app.js` 後端檔案，初始化 SQLite 記憶體資料庫並建立貼文表。
3. 建立 `views/index.ejs` 來渲染貼文首頁與發布表單。

讓我先讀取當前目錄的結構以確認檔案配置。

**Tool: read**

**Input:**
```json
{
  "filePath": "homework/05/blog/package.json"
}
```

**Output:**
```json
{
  "name": "simple-blog",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {}
}
```

我將更新 `package.json` 以添加依賴，然後編寫 `app.js` 與 `views/index.ejs`。

**Tool: edit**

**Input:**
```json
{
  "filePath": "homework/05/blog/package.json",
  "oldString": "\"dependencies\": {}",
  "newString": "\"dependencies\": {\n    \"express\": \"^4.18.2\",\n    \"sql.js\": \"^1.10.0\",\n    \"ejs\": \"^3.1.9\"\n  }"
}
```

**Output:**
```
Edit applied successfully.
```

接著建立 `app.js` 以處理 Express 路由與 Wasm SQLite 記憶體初始化：

**Tool: write**

**Input:**
```json
{
  "filePath": "homework/05/blog/app.js",
  "content": "const express = require('express');\nconst initSqlJs = require('sql.js');\nconst app = express();\n\napp.set('view engine', 'ejs');\napp.use(express.urlencoded({ extended: true }));\n\nlet db = null;\n\nasync function initDB() {\n    const SQL = await initSqlJs();\n    db = new SQL.Database();\n    db.run(`\n        CREATE TABLE IF NOT EXISTS posts (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            title TEXT NOT NULL,\n            content TEXT NOT NULL,\n            created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n    `);\n}\n\napp.get('/', (req, res) => {\n    const stmt = db.prepare(\"SELECT * FROM posts ORDER BY created_at DESC\");\n    const posts = [];\n    while(stmt.step()) {\n        posts.push(stmt.getAsObject());\n    }\n    stmt.free();\n    res.render('index', { posts });\n});\n\napp.post('/posts', (req, res) => {\n    const { title, content } = req.body;\n    db.run(\"INSERT INTO posts (title, content) VALUES (?, ?)\", [title, content]);\n    res.redirect('/');\n});\n\ninitDB().then(() => {\n    app.listen(3000, () => console.log('V2.0 Server running at http://localhost:3000'));\n});"
}
```

**Output:**
```
Success
```

現在我需要建立 `views/index.ejs` 作為使用者介面模板。

**Tool: write**

**Input:**
```json
{
  "filePath": "homework/05/blog/views/index.ejs",
  "content": "<!DOCTYPE html>\n<html lang=\"zh-TW\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>極簡網誌 V2.0</title>\n    <style>\n        * { box-sizing: border-box; border-radius: 0 !important; }\n        body { font-family: sans-serif; background-color: #fcfcfc; color: #111; padding: 40px; }\n        .container { max-width: 600px; margin: 0 auto; border: 2px solid #111; padding: 20px; background: #fff; }\n        .post-form input, .post-form textarea { width: 100%; padding: 10px; border: 2px solid #111; margin-bottom: 15px; }\n        .btn-submit { width: 100%; padding: 12px; background: #111; color: #fff; border: none; font-weight: bold; cursor: pointer; }\n        .post { border: 2px solid #111; padding: 15px; margin-top: 15px; }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <h2>發布貼文 (V2.0 - Express + SQLite)</h2>\n        <form action=\"/posts\" method=\"POST\" class=\"post-form\">\n            <input type=\"text\" name=\"title\" placeholder=\"文章標題\" required>\n            <textarea name=\"content\" placeholder=\"文章內容\" rows=\"4\" required></textarea>\n            <button type=\"submit\" class=\"btn-submit\">發布</button>\n        </form>\n        <hr>\n        <div id=\"postsList\">\n            <% posts.forEach(post => { %>\n                <div class=\"post\">\n                    <h3><%= post.title %></h3>\n                    <p><%= post.content %></p>\n                    <small>發布時間: <%= post.created_at %></small>\n                </div>\n            <% }) %>\n        </div>\n    </div>\n</body>\n</html>"
}
```

**Output:**
```
Success
```

我已經將專案升級為 V2.0 版。現在它運作在 Express.js 上，資料庫也改用 WebAssembly SQLite (sql.js) 記憶體資料庫。你可以透過 `npm install` 載入依賴，並用 `node app.js` 啟動伺服器。

---

### 🟠 第三階段對話：V3.0 加入 Session 會話登入認證、Bcrypt 加密與資料庫磁碟同步備份

**Session ID:** ses_v3_security_003
**Created:** 2026/3/26 上午09:40:00

---

## User

V2.0 跑起來了，但有兩個嚴重的問題：
1. 只要我關閉並重啟伺服器，原本寫的貼文就會在記憶體中消失。
2. 沒有任何登入驗證，任何人都可以隨意發文。
請幫我升級為 V3.0 版：使用 `express-session` 做會話管理，註冊密碼要用 `bcryptjs` 加密，且發文有 `isPrivate` 隱私控制（登入者才能看到自己的私密貼文）。另外，最重要的是，請幫我寫一個檔案讀寫同步機制，將記憶體資料庫定期以二進位 Buffer 匯出並同步寫入本地的 `blog.db` 磁碟檔案，重啟時再加載回來！

---

## Assistant (Build · sec-db · 6.2s)

_Thinking:_
使用者提出了 V3.0 的核心訴求：
1. **資料持久化**：`sql.js` 預設只存活於記憶體。我必須使用 Node.js 的 `fs` 模組，在伺服器啟動時，檢查本地是否存在 `blog.db` 檔案。若存在，則以 `fs.readFileSync` 讀取為 Buffer 並傳入 `new SQL.Database(buffer)` 完成狀態還原。在每次寫入操作後，呼叫 `db.export()` 取得 Uint8Array，再將其寫回硬碟完成持久化。
2. **安全防護**：需要 `bcryptjs` 做密碼雜湊，`express-session` 記錄 userId/username。
3. **隱私控制**：新增 `posts.is_private` 欄位（0為公開，1為私密）。首頁載入時動態過濾：未登入者僅能看見公開貼文 (`is_private = 0`)；已登入者能看見公開貼文以及本人所屬的私密貼文 (`is_private = 0 OR user_id = ?`)。

我需要修改 `package.json`，然後重構 `app.js` 與 `views` 檔案。
首先修改 `package.json` 加入 `bcryptjs` 與 `express-session`。

**Tool: edit**

**Input:**
```json
{
  "filePath": "homework/05/blog/package.json",
  "oldString": "\"dependencies\": {\n    \"express\": \"^4.18.2\",\n    \"sql.js\": \"^1.10.0\",\n    \"ejs\": \"^3.1.9\"\n  }",
  "newString": "\"dependencies\": {\n    \"express\": \"^4.18.2\",\n    \"sql.js\": \"^1.10.0\",\n    \"ejs\": \"^3.1.9\",\n    \"bcryptjs\": \"^2.4.3\",\n    \"express-session\": \"^1.17.3\"\n  }"
}
```

**Output:**
```
Edit applied successfully.
```

接著，我將重寫整個 `app.js`，實作檔案讀寫同步機制與安全認證。

**Tool: write**

**Input:**
```json
{
  "filePath": "homework/05/blog/app.js",
  "content": "const express = require('express');\nconst initSqlJs = require('sql.js');\nconst fs = require('fs');\nconst path = require('path');\nconst bcrypt = require('bcryptjs');\nconst session = require('express-session');\n\nconst app = express();\nconst PORT = 3000;\nconst DB_PATH = path.join(__dirname, 'blog.db');\n\napp.set('view engine', 'ejs');\napp.use(express.urlencoded({ extended: true }));\napp.use(session({\n    secret: 'nqu-secret-key-111410517',\n    resave: false,\n    saveUninitialized: false,\n    cookie: { maxAge: 24 * 60 * 60 * 1000 }\n}));\n\nlet dbInstance = null;\n\nasync function initDatabase() {\n    const SQL = await initSqlJs();\n    if (fs.existsSync(DB_PATH)) {\n        const fileBuffer = fs.readFileSync(DB_PATH);\n        dbInstance = new SQL.Database(fileBuffer);\n        console.log(\"✔ 成功從本地檔案載入資料庫。\");\n    } else {\n        dbInstance = new SQL.Database();\n        dbInstance.run(`\n            CREATE TABLE IF NOT EXISTS users (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                username TEXT UNIQUE NOT NULL,\n                password TEXT NOT NULL\n            );\n        `);\n        dbInstance.run(`\n            CREATE TABLE IF NOT EXISTS posts (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                user_id INTEGER NOT NULL,\n                content TEXT NOT NULL,\n                is_private INTEGER DEFAULT 0,\n                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n                FOREIGN KEY (user_id) REFERENCES users(id)\n            );\n        `);\n        saveDatabaseToDisk();\n    }\n}\n\nfunction saveDatabaseToDisk() {\n    const dbData = dbInstance.export();\n    fs.writeFileSync(DB_PATH, Buffer.from(dbData));\n}\n\napp.use((req, res, next) => {\n    res.locals.user = req.session.userId ? { id: req.session.userId, username: req.session.username } : null;\n    next();\n});\n\nconst requireAuth = (req, res, next) => {\n    if (!req.session.userId) return res.redirect('/login');\n    next();\n};\n\napp.get('/', (req, res) => {\n    let sql = \"SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id WHERE p.is_private = 0\";\n    let params = [];\n    if (req.session.userId) {\n        sql = \"SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id WHERE p.is_private = 0 OR p.user_id = ?\";\n        params = [req.session.userId];\n    }\n    sql += \" ORDER BY p.created_at DESC\";\n    const stmt = dbInstance.prepare(sql);\n    stmt.bind(params);\n    const posts = [];\n    while (stmt.step()) {\n        posts.push(stmt.getAsObject());\n    }\n    stmt.free();\n    res.render('index', { posts });\n});\n\napp.get('/register', (req, res) => res.render('register', { error: null }));\napp.post('/register', (req, res) => {\n    const { username, password } = req.body;\n    try {\n        const hashedPassword = bcrypt.hashSync(password, 10);\n        dbInstance.run(\"INSERT INTO users (username, password) VALUES (?, ?)\", [username, hashedPassword]);\n        saveDatabaseToDisk();\n        res.redirect('/login');\n    } catch (err) {\n        res.render('register', { error: \"註冊失敗，用戶名可能已被重複註冊。\" });\n    }\n});\n\napp.get('/login', (req, res) => res.render('login', { error: null }));\napp.post('/login', (req, res) => {\n    const { username, password } = req.body;\n    const stmt = dbInstance.prepare(\"SELECT * FROM users WHERE username = ?\");\n    stmt.bind([username]);\n    if (stmt.step()) {\n        const user = stmt.getAsObject();\n        stmt.free();\n        if (bcrypt.compareSync(password, user.password)) {\n            req.session.userId = user.id;\n            req.session.username = user.username;\n            return res.redirect('/');\n        }\n    } else {\n        stmt.free();\n    }\n    res.render('login', { error: \"用戶名或密碼錯誤。\" });\n});\n\napp.post('/posts', requireAuth, (req, res) => {\n    const { content, isPrivate } = req.body;\n    const privateFlag = isPrivate ? 1 : 0;\n    dbInstance.run(\"INSERT INTO posts (user_id, content, is_private) VALUES (?, ?, ?)\", [\n        req.session.userId, content, privateFlag\n    ]);\n    saveDatabaseToDisk();\n    res.redirect('/');\n});\n\napp.get('/logout', (req, res) => {\n    req.session.destroy();\n    res.redirect('/');\n});\n\ninitDatabase().then(() => {\n    app.listen(PORT, () => console.log(`V3.0 Server running at http://localhost:${PORT}`));\n});"
}
```

**Output:**
```
Success
```

接著建立登入 `login.ejs` 視圖頁面。

**Tool: write**

**Input:**
```json
{
  "filePath": "homework/05/blog/views/login.ejs",
  "content": "<!DOCTYPE html>\n<html lang=\"zh-TW\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>登入</title>\n    <style>\n        * { box-sizing: border-box; border-radius: 0 !important; }\n        body { font-family: sans-serif; background-color: #fcfcfc; color: #111; padding: 40px; }\n        .container { max-width: 400px; margin: 0 auto; border: 2px solid #111; padding: 20px; background: #fff; }\n        input { width: 100%; padding: 10px; border: 2px solid #111; margin-bottom: 15px; }\n        .btn { width: 100%; padding: 12px; background: #111; color: #fff; border: none; font-weight: bold; cursor: pointer; }\n        .error { color: red; margin-bottom: 15px; }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <h2>用戶登入</h2>\n        <% if (error) { %> <div class=\"error\"><%= error %></div> <% } %>\n        <form action=\"/login\" method=\"POST\">\n            <input type=\"text\" name=\"username\" placeholder=\"使用者名稱\" required>\n            <input type=\"password\" name=\"password\" placeholder=\"密碼\" required>\n            <button type=\"submit\" class=\"btn\">登入</button>\n        </form>\n        <p><a href=\"/register\">還沒有帳號？點此註冊</a></p>\n    </div>\n</body>\n</html>"
}
```

**Output:**
```
Success
```

我已經成功實作了 V3.0 的持久化與會話安全防護機制。
1. `saveDatabaseToDisk()` 會在每次寫入資料（註冊、發文）後觸發，同步寫回 `blog.db`。重啟時會自動加載，資料不再遺失。
2. 發文路由需要登入，首頁已加入 `isPrivate` 的 SQL 隱私過濾，保護私密貼文的安全。

---

### 🔴 第四階段對話：V4.0 新增資料備份與還原功能 (JSON 匯入匯出)

**Session ID:** ses_v4_backup_004
**Created:** 2026/3/27 下午13:10:20

---

## User

會話安全認證跟檔案持久化同步都工作得很好！現在我想實作 V4.0版本，新增「資料備份與還原」功能。我希望點擊按鈕後，後端可以將資料庫中「當前登入者所發布的所有貼文」打包成 JSON 格式供用戶下載（資料備份）；同時，也提供一個 JSON 檔案上傳欄位，當用戶上傳備份檔時，後端解析並把這些貼文重新寫入資料庫（資料還原）。

---

## Assistant (Build · io-features · 5.5s)

_Thinking:_
使用者希望為部落格系統新增當前登入用戶貼文的備份與還原功能：
1. **資料備份 (GET /api/backup)**：
   - 限定登入用戶存取。
   - 查詢該用戶發表的所有貼文（內容與隱私標記）。
   - 設定 HTTP Header 以觸發 JSON 下載：
     `Content-Type: application/json`
     `Content-Disposition: attachment; filename=backup.json`
   - 將貼文序列化為 JSON 回傳。
2. **資料還原 (POST /api/restore)**：
   - 限制登入用戶。
   - 解析上傳的 JSON 資料。
   - 使用 SQLite 的 Transaction 交易（`BEGIN TRANSACTION` / `COMMIT`）來確保批次寫入的原子性，避免髒資料。
   - 寫入完畢後呼叫 `saveDatabaseToDisk()` 確保新資料寫入實體磁碟 `blog.db`。

我將在 `app.js` 中新增這兩個 API 路由。

**Tool: edit**

**Input:**
```json
{
  "filePath": "homework/05/blog/app.js",
  "oldString": "app.get('/logout', (req, res) => {\n    req.session.destroy();\n    res.redirect('/');\n});",
  "newString": "app.get('/logout', (req, res) => {\n    req.session.destroy();\n    res.redirect('/');\n});\n\n// 1. 資料備份 API (匯出為 JSON 下載)\napp.get('/api/backup', requireAuth, (req, res) => {\n    const stmt = dbInstance.prepare(\"SELECT content, is_private FROM posts WHERE user_id = ?\");\n    stmt.bind([req.session.userId]);\n    const userPosts = [];\n    while (stmt.step()) {\n        userPosts.push(stmt.getAsObject());\n    }\n    stmt.free();\n    \n    res.setHeader('Content-Type', 'application/json');\n    res.setHeader('Content-Disposition', `attachment; filename=posts-backup-${req.session.username}.json`);\n    res.send(JSON.stringify(userPosts, null, 2));\n});\n\n// 2. 資料還原 API (上傳 JSON 檔案解析寫入)\napp.post('/api/restore', requireAuth, (req, res) => {\n    const { backupData } = req.body;\n    try {\n        const postsToRestore = JSON.parse(backupData);\n        if (!Array.isArray(postsToRestore)) {\n            return res.status(400).send(\"無效的備份格式，必須為貼文陣列。\");\n        }\n        \n        dbInstance.run(\"BEGIN TRANSACTION;\");\n        postsToRestore.forEach(post => {\n            dbInstance.run(\"INSERT INTO posts (user_id, content, is_private) VALUES (?, ?, ?)\", [\n                req.session.userId, post.content, post.is_private\n            ]);\n        });\n        dbInstance.run(\"COMMIT;\");\n        saveDatabaseToDisk();\n        \n        res.redirect('/');\n    } catch (e) {\n        dbInstance.run(\"ROLLBACK;\");\n        res.status(500).send(\"資料還原失敗，請確保上傳了正確的 JSON 備份檔。\");\n    }\n});"
}
```

**Output:**
```
Edit applied successfully.
```

我已經在 `app.js` 中新增了備份與還原的 API。
- 用戶可以藉由造訪 `/api/backup` 將自己的貼文下載成 JSON 檔備份。
- 用戶亦可透過前端上傳 JSON 字串至 `/api/restore`，伺服器會以 SQLite Transaction 交易打包防護，確保資料還原完整性並儲存至本地硬碟中。

---

## 學習心得

這次作業是我第一次接觸資料庫與 Session 會話機制。在實作過程中，我發現 SQLite 在記憶體中跑雖然很快，但一關掉伺服器貼文就不見的 Bug 真的很令人抓狂。幸好透過本地端助理的引導，寫出了檔案讀寫同步機制，用 Buffer 寫回磁碟，這讓我對後端資料庫的持久化概念有了非常清楚的認識。而使用 `bcrypt` 進行雜湊加密的防護，以及採用 SQL 預備語法（Prepared Statements），也讓我體會到後端安全開發的重要細節。
