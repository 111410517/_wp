// task04_student_object.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 JavaScript 物件宣告與讀取：學生資料物件

'use strict';

const student = {
    name: "洪晨祐",
    id: "111410517",
    department: "資訊工程學系",
    printInfo: function() {
        console.log(`學生: ${this.name}, 學號: ${this.id}, 科系: ${this.department}`);
    }
};

student.printInfo();
