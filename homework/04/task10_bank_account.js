// task10_bank_account.js
// 國立金門大學資工系 洪晨祐 (111410517)
// 練習 物件方法與 this 關鍵字：銀行帳戶提存物件

'use strict';

const bankAccount = {
    owner: "洪晨祐",
    balance: 5000,
    deposit: function(amount) {
        if (amount > 0) {
            this.balance += amount;
            console.log(`💰 成功存款 ${amount} 元。目前餘額: ${this.balance} 元`);
        }
    },
    withdraw: function(amount) {
        if (amount > 0 && this.balance >= amount) {
            this.balance -= amount;
            console.log(`💸 成功提款 ${amount} 元。目前餘額: ${this.balance} 元`);
            return true;
        }
        console.log(`❌ 提款 ${amount} 元失敗。餘額不足或金額無效。目前餘額: ${this.balance} 元`);
        return false;
    }
};

console.log(`=== 銀行帳戶測試 (帳戶持有人: ${bankAccount.owner}) ===`);
bankAccount.deposit(1500);
bankAccount.withdraw(2000);
bankAccount.withdraw(6000);
