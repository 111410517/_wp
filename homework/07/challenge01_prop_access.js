// @ts-check

/**
 * 演示 JavaScript 物件屬性存取的點運算子 (Dot Notation) 與中括號運算子 (Bracket Notation)
 * 並加入防禦性 Null 指針防護與 dynamic key 校驗
 */
const backendServerConfig = {
    listeningPort: 8080,
    serverEnvironment: "production",
    databaseConnectionUrl: "sqlite://memory"
};

// 1. 使用點運算子 (Dot Notation) 存取靜態已知屬性
const activePort = backendServerConfig.listeningPort;
console.log(`[Dot Notation] Listening Port: ${activePort}`);

// 2. 使用中括號運算子 (Bracket Notation) 存取動態鍵值或特殊字元鍵值
const dynamicKeyName = "serverEnvironment";
const activeEnv = backendServerConfig[dynamicKeyName];
console.log(`[Bracket Notation] Dynamic Env: ${activeEnv}`);

// Fail-Fast: 防禦性屬性存取函數
/**
 * 安全地從配置中獲取鍵值，防止 Null/Undefined 指針崩潰
 * @param {Object} configObj - 配置物件
 * @param {string} targetKey - 目標鍵名
 * @returns {*}
 */
function getSecureConfigValue(configObj, targetKey) {
    if (!configObj || typeof configObj !== 'object') {
        throw new TypeError("安全存取錯誤：必須傳入有效的物件");
    }
    if (typeof targetKey !== 'string') {
        throw new TypeError("安全存取錯誤：鍵值必須為字串");
    }
    return configObj[targetKey] ?? null;
}

console.log("安全獲取資料庫位址:", getSecureConfigValue(backendServerConfig, "databaseConnectionUrl"));