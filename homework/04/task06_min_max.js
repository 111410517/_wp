// task06_min_max.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 陣列走訪與極值尋找：陣列極值分析

'use strict';

function findMinMax(arr) {
    if (!arr || arr.length === 0) return null;
    let min = arr[0], max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }
    return { min, max };
}

console.log("極值分析 [3, 7, 1, 9, 2] ➔", findMinMax([3, 7, 1, 9, 2]));
console.log("極值分析空陣列 ➔", findMinMax([]));
