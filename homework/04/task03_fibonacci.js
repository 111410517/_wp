// task03_fibonacci.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 while 迴圈與陣列的結合：費氏數列產生器

'use strict';

function generateFibonacci(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    const fib = [0, 1];
    while (fib.length < n) {
        fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib;
}

console.log("費氏數列前 8 項 ➔", generateFibonacci(8));
console.log("費氏數列前 1 項 ➔", generateFibonacci(1));
