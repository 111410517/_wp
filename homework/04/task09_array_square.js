// task09_array_square.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 陣列 map 映射與平方計算：陣列平方映射

'use strict';

function squareArrayElements(arr) {
    return arr.map(val => val * val);
}

console.log("陣列平方映射 [1, 2, 3] ➔", squareArrayElements([1, 2, 3]));
console.log("陣列平方映射 [5, 10, 15] ➔", squareArrayElements([5, 10, 15]));
