// task02_odd_sum.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 for 迴圈與 function 的結合：奇數累加器

'use strict';

function sumOdds(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        if (i % 2 !== 0) sum += i;
    }
    return sum;
}

console.log("1 到 10 的奇數和 ➔", sumOdds(10));
console.log("1 到 100 的奇數和 ➔", sumOdds(100));
