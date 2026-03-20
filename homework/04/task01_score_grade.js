// task01_score_grade.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 if 判斷式與 function 的結合：學生成績等第評定

'use strict';

function getGrade(score) {
    if (score < 0 || score > 100) return "無效的分數";
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "F (不及格)";
}

console.log("成績評定 (85) ➔", getGrade(85));
console.log("成績評定 (95) ➔", getGrade(95));
console.log("成績評定 (105) ➔", getGrade(105));
