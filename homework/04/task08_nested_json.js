// task08_nested_json.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 嵌套物件遍歷與成員提取：嵌套成員遍歷

'use strict';

function printNestedKeys(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            console.log(`物件層級: ${key}`);
            printNestedKeys(obj[key]);
        } else {
            console.log(`金鑰: ${key} -> 值: ${obj[key]}`);
        }
    }
}

console.log("=== 測試嵌套物件遍歷 ===");
printNestedKeys({ user: { profile: { name: "洪晨祐", id: "111410517" } } });
