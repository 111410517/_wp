/**
 * @file homework/03/hello.js
 * @description 國立金門大學資訊工程學系一年級首個 JavaScript 程式 - 優雅動態自我介紹生成器
 * @student 洪晨祐 (111410517)
 */

'use strict';

/**
 * 格式化輸出自我介紹資訊
 * @param {Object} info - 學生基本資訊物件
 * @param {string} info.school - 學校名稱
 * @param {string} info.department - 系所名稱
 * @param {string} info.grade - 年級
 * @param {string} info.name - 姓名
 * @param {string} info.id - 學號
 * @throws {TypeError} 當參數缺失或型態不符時拋出
 */
function printWelcomeMessage(info) {
    if (!info || typeof info !== 'object') {
        throw new TypeError("必須傳入有效的資訊物件");
    }
    
    const { school, department, grade, name, id } = info;
    if (!school || !department || !grade || !name || !id) {
        throw new TypeError("資訊物件欄位不完整");
    }

    const divider = "=".repeat(50);
    console.log(divider);
    console.log(`🚀 hello, world!`);
    console.log(`🏫 學校系所：${school} ${department} ${grade}`);
    console.log(`👤 學生姓名：${name} (${id})`);
    console.log(`📝 備註資訊：這是我的第一個 JavaScript 程式輸出！`);
    console.log(divider);
}

// 執行與測試
try {
    printWelcomeMessage({
        school: "國立金門大學",
        department: "資訊工程學系",
        grade: "一年級",
        name: "洪晨祐",
        id: "111410517"
    });
} catch (error) {
    console.error("初始化失敗:", error.message);
}
