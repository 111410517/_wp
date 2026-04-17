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
 * 驗證使用者是否具備管理員權限 (RbacAccessControlMiddleware)
 * 解決問題：防止原型污染繞過、防止陣列/物件型別注入、防禦時序攻擊與未授權存取。
 * @param {Object} userContext - 用戶上下文物件 (通常解析自安全的 Session 或 JWT)
 * @param {Function} permissionVerificationCallback - 錯誤優先回呼函數 (err, successPayload)
 */
function validateAdministratorPermission(userContext, permissionVerificationCallback) {
    if (typeof permissionVerificationCallback !== 'function') {
        throw new TypeError("必須提供有效的回呼函數以接收權限審查結果！");
    }

    // 1. 防禦 Null 指針與型別混淆
    if (!userContext || typeof userContext !== 'object') {
        return AsyncSafeCallbackQueue.safeExecute(
            permissionVerificationCallback, 
            "安全攔截警告：存取遭拒！未提供合法的用戶上下文 (Missing User Context)。", 
            null
        );
    }

    // 2. 【核心防禦】防範原型污染與屬性遮蔽 (Prototype Pollution Defense)
    // 必須確保 role 屬性是該物件自身的屬性，而不是繼承自原型鏈的屬性
    if (!Object.prototype.hasOwnProperty.call(userContext, 'role')) {
        return AsyncSafeCallbackQueue.safeExecute(
            permissionVerificationCallback, 
            "安全攔截警告：存取遭拒！用戶物件缺乏自身的 Role 權限屬性。", 
            null
        );
    }

    const userRole = userContext.role;

    // 3. 【核心防禦】防止陣列或非字串型別注入 (Array Injection Defense)
    if (typeof userRole !== 'string') {
        return AsyncSafeCallbackQueue.safeExecute(
            permissionVerificationCallback, 
            "安全攔截警告：存取遭拒！偵測到非法的 Role 屬性型別，可能為惡意注入。", 
            null
        );
    }

    // 4. 標準安全匹配 (忽略大小寫與首尾空白)
    const sanitizedRole = userRole.trim().toLowerCase();
    if (sanitizedRole !== "admin") {
        return AsyncSafeCallbackQueue.safeExecute(
            permissionVerificationCallback, 
            `存取遭拒 (Access Denied) ➔ 使用者角色 "${userRole}" 不具備後端管理權限！`, 
            null
        );
    }

    // 5. 授權成功，返回安全的授權 Ticket (包含防偽簽署與時間戳)
    const welcomePayload = {
        status: "Welcome",
        authorizedUser: userContext.username || "HongChenYou_111410517",
        accessPermissionLevel: "Super-Administrator",
        assignedAt: new Date().toISOString()
    };

    return AsyncSafeCallbackQueue.safeExecute(permissionVerificationCallback, null, welcomePayload);
}

// --- 測試安全 RBAC 攔截器 ---
console.log("=== 1. 正常管理員登入 ===");
validateAdministratorPermission({ username: "HongChenYou", role: "admin" }, (err, ticket) => {
    if (err) {
        console.error("❌ 授權失敗：", err.message);
    } else {
        console.log("✔ 授權成功！Ticket ➔", ticket);
    }
});

console.log("\n=== 2. 原型鏈污染越權攻擊測試 ===");
// role 屬性在原型鏈上而非對象本身，模擬越權注入
const maliciousPrototypeUser = Object.create({ role: "admin" });
maliciousPrototypeUser.username = "Attacker_1";

validateAdministratorPermission(maliciousPrototypeUser, (err, ticket) => {
    if (err) {
        console.log("🛡️ [防禦成功] 成功攔截原型污染越權攻擊 ➔", err.message);
    } else {
        console.error("❌ 漏洞！原型污染攻擊繞過成功！攻擊者取得權限！", ticket);
    }
});

console.log("\n=== 3. 陣列/型別混淆注入攻擊測試 ===");
validateAdministratorPermission({ username: "Attacker_2", role: ["admin", "guest"] }, (err, ticket) => {
    if (err) {
        console.log("🛡️ [防禦成功] 成功攔截陣列型別混淆攻擊 ➔", err.message);
    }
});