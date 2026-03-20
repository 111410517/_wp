// task05_json_convert.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 JSON 序列化與安全解析：JSON 字串轉換防護

'use strict';

function safeParseJSON(jsonStr) {
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.warn("JSON 解析失敗:", e.message);
        return null;
    }
}

console.log("有效 JSON 解析結果 ➔", safeParseJSON('{"name":"祐", "id":"111410517"}'));
console.log("無效 JSON 解析結果 ➔", safeParseJSON('{"invalid_json"'));
