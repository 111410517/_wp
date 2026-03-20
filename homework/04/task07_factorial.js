// task07_factorial.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 遞迴調用與階乘計算：遞迴階乘計算

'use strict';

function factorial(n) {
    if (n < 0) return -1;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

console.log("階乘 5! ➔", factorial(5));
console.log("階乘 0! ➔", factorial(0));
console.log("階乘負數 -5 ➔", factorial(-5));
