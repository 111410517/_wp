/**
 * @file script.js
 * @description 瑞士包浩斯全棧門戶 - Three.js WebGL 3D 幾何磁吸視差系統、資料驅動通用沙盒與邊緣 API 連動主控邏輯
 * @student 洪晨祐 (111410517)
 */

'use strict';

// ------------------------------------------
// 🎨 第一部分：Three.js WebGL 3D 包浩斯幾何共振磁吸系統
// ------------------------------------------
let scene, camera, renderer;
let geometricObjects = [];
let gridLines;

const mouseCoordinates = { x: 0, y: 0 };
const mousePhysicalTarget = { x: 0, y: 0 };

function initializeWebGLBackground() {
    const canvas = document.getElementById("webgl-canvas");
    if (!canvas) return;

    // 1. 初始化場景與相機
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfc); // 精美的紙張白

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 120;

    // 2. 初始化渲染器
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 3. 添加包浩斯幾何實體 (Geometries)
    // 實體 A：紅色包浩斯巨球 (Spherical Element)
    const redSphereGeom = new THREE.SphereGeometry(18, 32, 32);
    const redSphereMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, wireframe: false, transparent: true, opacity: 0.88 });
    const redSphere = new THREE.Mesh(redSphereGeom, redSphereMat);
    redSphere.position.set(-45, 20, 0);
    scene.add(redSphere);
    geometricObjects.push({ mesh: redSphere, basePos: new THREE.Vector3(-45, 20, 0), speed: 0.005, factor: 0.15 });

    // 實體 B：炭黑包浩斯立方體 (Cuboid Element)
    const blackCubeGeom = new THREE.BoxGeometry(22, 22, 22);
    const blackCubeMat = new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: false });
    const blackCube = new THREE.Mesh(blackCubeGeom, blackCubeMat);
    blackCube.position.set(45, -20, -10);
    scene.add(blackCube);
    geometricObjects.push({ mesh: blackCube, basePos: new THREE.Vector3(45, -20, -10), speed: 0.008, factor: 0.18 });

    // 實體 C：黃色三角錐線框 (Wireframe Tetrahedron)
    const yellowConeGeom = new THREE.ConeGeometry(15, 26, 4);
    const yellowConeMat = new THREE.MeshBasicMaterial({ color: 0xeab308, wireframe: true });
    const yellowCone = new THREE.Mesh(yellowConeGeom, yellowConeMat);
    yellowCone.position.set(0, 5, 10);
    scene.add(yellowCone);
    geometricObjects.push({ mesh: yellowCone, basePos: new THREE.Vector3(0, 5, 10), speed: 0.004, factor: 0.22 });

    // 4. 幾何共振網格線 (Hard Grid Lines)
    const gridGeometry = new THREE.BufferGeometry();
    const gridPoints = [];
    const step = 20;
    const size = 160;
    for (let i = -size; i <= size; i += step) {
        gridPoints.push(i, -size, -40, i, size, -40);
        gridPoints.push(-size, i, -40, size, i, -40);
    }
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3));
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0xe5e7eb, linewidth: 1 });
    gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    scene.add(gridLines);

    // 5. 事件監聽
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("mousemove", handleMouseMove);

    // 啟動動畫迴圈
    animateWebGL();
}

function handleMouseMove(e) {
    // 映射至 -1 到 1 的標準化設備坐標 (NDC)
    mousePhysicalTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePhysicalTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateWebGL() {
    requestAnimationFrame(animateWebGL);

    // 🌟 滑鼠物理平滑彈性阻尼插值 (LERP, Linear Interpolation)
    mouseCoordinates.x += (mousePhysicalTarget.x - mouseCoordinates.x) * 0.05; // 0.05 阻尼感
    mouseCoordinates.y += (mousePhysicalTarget.y - mouseCoordinates.y) * 0.05;

    // 1. 微粒相機視差擺動 (Parallax Camera swing)
    camera.position.x = mouseCoordinates.x * 20;
    camera.position.y = mouseCoordinates.y * 15;
    camera.lookAt(0, 0, 0);

    // 2. 幾何實體獨立漂浮、自轉與引力磁吸
    geometricObjects.forEach(obj => {
        // 自轉
        obj.mesh.rotation.x += obj.speed;
        obj.mesh.rotation.y += obj.speed * 1.5;

        // 計算滑鼠引力引起的平滑阻尼偏離量
        const targetX = obj.basePos.x + (mouseCoordinates.x * 40 * obj.factor);
        const targetY = obj.basePos.y + (mouseCoordinates.y * 30 * obj.factor);

        // LERP 平滑回彈至基底位置
        obj.mesh.position.x += (targetX - obj.mesh.position.x) * 0.08;
        obj.mesh.position.y += (targetY - obj.mesh.position.y) * 0.08;
    });

    // 3. 網格線隨滑鼠產生微妙的傾斜
    if (gridLines) {
        gridLines.rotation.y = mouseCoordinates.x * 0.05;
        gridLines.rotation.x = -mouseCoordinates.y * 0.05;
    }

    renderer.render(scene, camera);
}

// ------------------------------------------
// 📂 第二部分：資料驅動通用沙盒控制邏輯 (DRY 原則)
// ------------------------------------------
const sandboxConfigs = {
    jssandbox: {
        num: "03 / 09",
        title: "[習題 3, 4] 基礎 JavaScript 在線終端沙盒",
        badges: ["INTERACTIVE RUNNER", "ALGORITHMS", "CONSOLE EMULATOR"],
        dir: "homework/04",
        options: [
            { value: "hello.js", text: "hello.js ➔ 基礎控制台輸出", overrideUrl: "homework/03/hello.js" },
            { value: "task01_score_grade.js", text: "1. 分數與等級轉換 (task01_score_grade.js)" },
            { value: "task02_odd_sum.js", text: "2. 指定範圍奇數求和 (task02_odd_sum.js)" },
            { value: "task03_fibonacci.js", text: "3. 費氏數列生成陣列 (task03_fibonacci.js)" },
            { value: "task04_student_object.js", text: "4. 學生資料物件與方法 (task04_student_object.js)" },
            { value: "task05_json_convert.js", text: "5. JSON 字串安全轉換與檢驗 (task05_json_convert.js)" },
            { value: "task06_min_max.js", text: "6. 陣列極值分析與尋找 (task06_min_max.js)" },
            { value: "task07_factorial.js", text: "7. 遞迴階乘運算計算 (task07_factorial.js)" },
            { value: "task08_nested_json.js", text: "8. 巢狀 JSON 成員結構遍歷 (task08_nested_json.js)" },
            { value: "task09_array_square.js", text: "9. 陣列元素平方映射處理 (task09_array_square.js)" },
            { value: "task10_bank_account.js", text: "10. 銀行帳戶提存防溢物件 (task10_bank_account.js)" }
        ]
    },
    jsadvanced: {
        num: "06 / 09",
        title: "[習題 6] 進階 JavaScript 函數與記憶體指針分析",
        badges: ["HIGHER-ORDER FUNCTIONS", "CLOSURE", "STACK & HEAP MEMORY"],
        dir: "homework/06",
        options: [
            { value: "task01_callback.js", text: "1. Callback 基礎實作數學工具" },
            { value: "task02_iife.js", text: "2. 匿名立即執行函數 IIFE 命名防護" },
            { value: "task03_arrow_map.js", text: "3. 箭頭函數與價格陣列非破壞性轉換" },
            { value: "task04_array_mutation.js", text: "4. 陣列參數 In-place 破壞性修改" },
            { value: "task05_higher_order.js", text: "5. 函數回傳函數之倍數因子閉包產生器" },
            { value: "task06_custom_filter.js", text: "6. 手手實作自定義 criteria filter" },
            { value: "task07_object_filter.js", text: "7. 篩選物件陣列中的成年人 (>= 18)" },
            { value: "task08_reference_trap.js", text: "8. 參數傳址陷阱：修改 vs 重新賦值" },
            { value: "task09_delay_callback.js", text: "9. Event Loop/Callback Queue 非同步計時" },
            { value: "task10_total_price.js", text: "10. 購物車 reduce 累加折扣綜合應用" }
        ]
    },
    jsbackend: {
        num: "07 / 09",
        title: "[習題 7] 後端挑戰 (Error-First Callback & 數據庫模擬)",
        badges: ["BACKEND PARADIGM", "ERROR-FIRST CALLBACKS", "DB ACCESS SIMULATOR"],
        dir: "homework/07",
        options: [
            { value: "challenge01_prop_access.js", text: "1. 物件屬性存取 (Dot vs Bracket Notation)" },
            { value: "challenge02_destructuring.js", text: "2. 一行代碼解構 req.body 物件常數" },
            { value: "challenge03_foreach_template.js", text: "3. 遍歷並用樣板字串動態生成 HTML" },
            { value: "challenge04_params_dict.js", text: "4. 字典與 Express req.params 動態鍵值對寫入" },
            { value: "challenge05_error_first.js", text: "5. 模擬 Error-First 錯誤優先回呼函數" },
            { value: "challenge06_json_parse.js", text: "6. 請求 JSON 字串解析與 try-catch 安全防護" },
            { value: "challenge07_fake_db.js", text: "7. 模擬 db.get 資料庫單行查詢與綁定" },
            { value: "challenge08_template_logic.js", text: "8. 反引號樣板字串內嵌三元條件邏輯" },
            { value: "challenge09_sort_slice.js", text: "9. 文章摘要截取 Excerpt 生成函數" },
            { value: "challenge10_admin_check.js", text: "10. 攔截器 Middleware 角色權限安全檢驗" }
        ]
    }
};

let currentSandboxTab = "jssandbox";
let currentlyLoadedCode = "";

// 展覽館切換邏輯
function navigateExhibition(tabName, clickedBtn) {
    // 1. 隱藏所有的展覽內容
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    
    // 2. 移除所有的選單項目 active 樣式
    document.querySelectorAll(".index-item").forEach(el => el.classList.remove("active"));

    // 3. 判斷是否屬於沙盒標籤
    if (sandboxConfigs[tabName]) {
        currentSandboxTab = tabName;
        activateSandboxUi(tabName);
        tabName = "jssandbox"; // 指向通用沙盒 HTML 容器
    }

    // 4. 激活內容
    const targetContent = document.getElementById(`content-${tabName}`);
    if (targetContent) targetContent.classList.add("active");
    if (clickedBtn) clickedBtn.classList.add("active");

    // 5. 確保 iframe 自適應高度
    const iframeMap = {
        aboutme: "iframe-aboutme",
        form: "iframe-form",
        shop: "iframe-shop",
        report: "iframe-report"
    };
    if (iframeMap[tabName]) {
        setTimeout(() => {
            const iframe = document.getElementById(iframeMap[tabName]);
            if (iframe) {
                iframe.style.height = `${iframe.parentElement.clientHeight}px`;
            }
        }, 100);
    }
}

function activateSandboxUi(tabKey) {
    const config = sandboxConfigs[tabKey];
    if (!config) return;

    // 動態變更標題、展覽編碼與技術勳章
    document.getElementById("sandbox-exhibition-num").innerText = config.num;
    document.getElementById("sandbox-title").innerText = config.title;
    document.getElementById("sandbox-badges").innerHTML = config.badges.map(b => `<span class="tech-tag">${b}</span>`).join("");

    // 動態填充 Selector Options
    const selector = document.getElementById("universal-js-select");
    selector.innerHTML = config.options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join("");

    // 初始化加載第一個代碼
    handleSandboxScriptChange();
}

function handleSandboxScriptChange() {
    const config = sandboxConfigs[currentSandboxTab];
    const selector = document.getElementById("universal-js-select");
    const fileName = selector.value;
    const optionObj = config.options.find(o => o.value === fileName);

    const display = document.getElementById("universal-code-display");
    display.textContent = `⏳ 正在讀取 ${fileName} 檔案原始碼...`;

    document.getElementById("sandbox-academic-box").style.display = "none";

    // 支援 override 優先 url
    const fetchUrl = optionObj.overrideUrl || `${config.dir}/${fileName}`;

    fetch(fetchUrl)
        .then(res => {
            if (!res.ok) throw new Error("讀取檔案失敗");
            return res.text();
        })
        .then(codeText => {
            currentlyLoadedCode = codeText;
            display.textContent = codeText;

            // 特殊學術剖析處理 (當為習題 6 且選擇 task08 傳址時)
            if (currentSandboxTab === "jsadvanced" && fileName === "task08_reference_trap.js") {
                loadAcademicReport();
            }
        })
        .catch(err => {
            display.textContent = `❌ 載入原始碼失敗: ${err.message}`;
        });
}

function loadAcademicReport() {
    const academicBox = document.getElementById("sandbox-academic-box");
    const reportDisplay = document.getElementById("sandbox-report-display");
    if (academicBox && reportDisplay) {
        academicBox.style.display = "block";
        reportDisplay.textContent = "⏳ LOADING ACADEMIC V8 MEMORY REPORT...";
        fetch("homework/06/task08_explanation.md")
            .then(res => res.text())
            .then(txt => {
                reportDisplay.textContent = txt;
            })
            .catch(err => {
                reportDisplay.textContent = `Error loading report: ${err.message}`;
            });
    }
}

// 🌟 通用沙盒 Web Worker 隔離執行引擎 ( console.log 緩衝攔截與死鎖超時機制 )
function runUniversalSandboxCode() {
    const outputConsole = document.getElementById("universal-terminal-output");
    if (!outputConsole) return;

    outputConsole.innerHTML = `<span class="terminal-prompt">$</span> sandbox run --execute\n`;
    outputConsole.innerHTML += `⏳ SPINNING UP ISOLATED WEB WORKER THREAD...\n`;

    // 1. 過濾 Node.js 特有的 require 依賴引用 (防沙盒崩潰)
    let executableJsCode = currentlyLoadedCode.replace(/const\s+\w+\s*=\s*require\([^)]+\);?/g, "");
    executableJsCode = executableJsCode.replace(/import\s+.*\s+from\s+.*;?/g, "");

    // 2. 封裝 Web Worker 原始碼字串
    const workerCode = `
    self.onmessage = function(e) {
        const codeToRun = e.data;
        const logBuffer = [];
        
        const customLog = (...args) => logBuffer.push("➔ " + args.join(" "));
        const customError = (...args) => logBuffer.push("🚨 [ERROR] " + args.join(" "));
        const customWarn = (...args) => logBuffer.push("⚠️ [WARN] " + args.join(" "));
        
        const sandboxEnv = {
            console: {
                log: customLog,
                error: customError,
                warn: customWarn
            }
        };
        
        try {
            const executeInSandbox = new Function("console", "log", "error", "warn", codeToRun);
            executeInSandbox(sandboxEnv.console, customLog, customError, customWarn);
            self.postMessage({ success: true, logs: logBuffer });
        } catch (err) {
            self.postMessage({ success: false, error: err.name + ": " + err.message, logs: logBuffer });
        }
    };
    `;

    try {
        // 3. 利用 Blob 實現本地 file:// 協定無縫適配 (Object URL 降級方案)
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const workerUrl = URL.createObjectURL(blob);
        const sandboxWorker = new Worker(workerUrl);

        // 4. 2秒超時死鎖強行終止機制 (防禦 while(true) 等死迴圈鎖死主執行緒)
        const timeoutLock = setTimeout(() => {
            sandboxWorker.terminate();
            URL.revokeObjectURL(workerUrl);
            outputConsole.innerHTML += `🚨 [TIMEOUT CRASH] 執行逾時被強制中斷（檢測到 CPU 執行緒死鎖）！\n`;
            outputConsole.innerHTML += `<span class="terminal-prompt">$</span> 異常中斷。`;
            outputConsole.scrollTop = outputConsole.scrollHeight;
        }, 2000);

        sandboxWorker.onmessage = function(e) {
            clearTimeout(timeoutLock);
            URL.revokeObjectURL(workerUrl);
            
            const { success, logs, error } = e.data;
            
            if (logs && logs.length > 0) {
                outputConsole.innerHTML += logs.join("\n") + "\n";
            }
            
            if (success) {
                if (!logs || logs.length === 0) {
                    outputConsole.innerHTML += `➔ 程式執行成功，但無任何控制台輸出。\n`;
                }
            } else {
                outputConsole.innerHTML += `🚨 [RUN-TIME CRASH] 執行異常拋錯:\n   ${error}\n`;
            }
            
            outputConsole.innerHTML += `\n<span class="terminal-prompt">$</span> 執行結束。`;
            outputConsole.scrollTop = outputConsole.scrollHeight;
        };

        sandboxWorker.onerror = function(err) {
            clearTimeout(timeoutLock);
            URL.revokeObjectURL(workerUrl);
            outputConsole.innerHTML += `🚨 [THREAD ERROR] 隔離執行緒崩潰:\n   ${err.message}\n`;
            outputConsole.innerHTML += `\n<span class="terminal-prompt">$</span> 異常中斷。`;
            outputConsole.scrollTop = outputConsole.scrollHeight;
        };

        // 啟動隔離執行緒
        sandboxWorker.postMessage(executableJsCode);

    } catch (e) {
        outputConsole.innerHTML += `🚨 [SANDBOX ERROR] 無法創建沙盒環境: ${e.message}\n`;
        outputConsole.scrollTop = outputConsole.scrollHeight;
    }
}

// ------------------------------------------
// ☁️ 第三部分：Serverless Blog 邊緣 APIs 連動邏輯
// ------------------------------------------
let currentUserSessionToken = localStorage.getItem("blog_session_token") || null;
let currentActiveUsername = localStorage.getItem("blog_active_username") || null;

function fetchBlogPosts() {
    const feed = document.getElementById("blog-posts-feed");
    if (!feed) return;

    feed.innerHTML = `<div style="grid-column: 1/-1; padding: 50px; text-align: center; font-family: var(--font-mono); font-size: 0.85rem;">⏳ SYNCING FROM EDGE KV DATABASE...</div>`;

    const headers = {};
    if (currentUserSessionToken) {
        headers["Authorization"] = `Bearer ${currentUserSessionToken}`;
    }

    fetch("/api/posts", { method: "GET", headers })
        .then(res => {
            if (!res.ok) throw new Error("無法同步 KV 貼文串");
            return res.json();
        })
        .then(data => {
            feed.innerHTML = "";
            const posts = data.posts || [];
            if (posts.length === 0) {
                feed.innerHTML = `<div style="grid-column: 1/-1; padding: 50px; text-align: center; font-family: var(--font-mono); font-size: 0.85rem;">NO ARTICLES IN BLOG KEY-VALUE RECORD.</div>`;
                return;
            }

            posts.forEach(post => {
                const card = document.createElement("div");
                card.className = "post-card";
                
                const formattedDate = new Date(post.createdAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
                const isPrivateBadge = post.isPrivate ? ` <span style="color:var(--accent-red); font-weight:700;">[🔒 PRIVATE]</span>` : "";

                card.innerHTML = `
                    <div>
                        <div class="post-meta-row">
                            <span class="author">@${post.authorName}${isPrivateBadge}</span>
                            <span class="time">${formattedDate}</span>
                        </div>
                        <p class="post-content">${post.content}</p>
                    </div>
                    <div class="post-action-bar">
                        <span class="likes-count">♥ ${post.likes || 0} LIKES</span>
                    </div>
                `;
                feed.appendChild(card);
            });
        })
        .catch(err => {
            feed.innerHTML = `<div style="grid-column: 1/-1; padding: 50px; text-align: center; color: red;">❌ KV SYNC ERROR: ${err.message}</div>`;
        });
}

function executeBlogAuth(actionType) {
    const userField = document.getElementById("blog-username");
    const passField = document.getElementById("blog-password");
    if (!userField || !passField) return;

    const username = userField.value.trim();
    const password = passField.value.trim();

    if (!username || !password) {
        alert("登入提示：請輸入完整的用戶名與密碼！");
        return;
    }

    fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType, username, password })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(d => { throw new Error(d.error || "驗證失敗"); });
        }
        return res.json();
    })
    .then(data => {
        if (actionType === "register") {
            alert(`🎉 註冊成功！請直接登入。`);
            passField.value = "";
        } else {
            currentUserSessionToken = data.token;
            currentActiveUsername = data.user.username;
            localStorage.setItem("blog_session_token", data.token);
            localStorage.setItem("blog_active_username", data.user.username);
            
            updateBlogSessionUi();
            fetchBlogPosts();
        }
    })
    .catch(err => {
        alert(`❌ 驗證異常: ${err.message}`);
    });
}

function executeBlogLogout() {
    currentUserSessionToken = null;
    currentActiveUsername = null;
    localStorage.removeItem("blog_session_token");
    localStorage.removeItem("blog_active_username");
    updateBlogSessionUi();
    fetchBlogPosts();
}

function updateBlogSessionUi() {
    const authBox = document.getElementById("blog-auth-section");
    const profileBox = document.getElementById("blog-user-profile");
    
    if (currentUserSessionToken) {
        if (authBox) authBox.style.display = "none";
        if (profileBox) {
            profileBox.style.display = "block";
            document.getElementById("session-username").innerText = currentActiveUsername;
        }
    } else {
        if (authBox) authBox.style.display = "block";
        if (profileBox) profileBox.style.display = "none";
    }
}

function executePublishPost() {
    const contentText = document.getElementById("blog-content");
    if (!contentText) return;

    const content = contentText.value.trim();
    const isPrivate = document.getElementById("blog-is-private")?.checked || false;

    if (!content) {
        alert("發佈提示：貼文內容不可為空！");
        return;
    }

    if (!currentUserSessionToken) {
        alert("授權提示：請先在右側登入系統再行發文！");
        return;
    }

    fetch("/api/posts", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentUserSessionToken}`
        },
        body: JSON.stringify({ content, isPrivate })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(d => { throw new Error(d.error || "發文失敗"); });
        }
        return res.json();
    })
    .then(() => {
        contentText.value = "";
        const privateCheck = document.getElementById("blog-is-private");
        if (privateCheck) privateCheck.checked = false;
        
        // 🌟 鋼鐵防避：樂觀 UI 更新 (Optimistic Update)
        // 直接在前端即時無延遲插入，規避 KV 資料庫最終一致性全球廣播的同步延遲缺陷
        const feed = document.getElementById("blog-posts-feed");
        if (feed) {
            if (feed.innerHTML.includes("NO ARTICLES IN BLOG KEY-VALUE RECORD.")) {
                feed.innerHTML = "";
            }
            
            const card = document.createElement("div");
            card.className = "post-card optimistic-post";
            
            const now = new Date();
            const formattedDate = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
            const isPrivateBadge = isPrivate ? ` <span style="color:var(--accent-red); font-weight:700;">[🔒 PRIVATE]</span>` : "";

            card.innerHTML = `
                <div>
                    <div class="post-meta-row">
                        <span class="author">@${currentActiveUsername}${isPrivateBadge}</span>
                        <span class="time">${formattedDate} (剛剛)</span>
                    </div>
                    <p class="post-content">${content}</p>
                </div>
                <div class="post-action-bar">
                    <span class="likes-count">♥ 0 LIKES</span>
                </div>
            `;
            
            // 將樂觀貼文滑動滑入最上方
            feed.insertBefore(card, feed.firstChild);
            
            card.style.opacity = "0";
            card.style.transform = "translateY(-10px)";
            card.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 50);
        }
    })
    .catch(err => {
        alert(`❌ 發文異常: ${err.message}`);
    });
}

// ------------------------------------------
// 🚀 全系統入口引導初始化
// ------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initializeWebGLBackground();
    activateSandboxUi("jssandbox");
    
    // 初始化 Blog Session
    updateBlogSessionUi();
    fetchBlogPosts();
});
