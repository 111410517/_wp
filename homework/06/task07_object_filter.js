// @ts-check

/**
 * @typedef {Object} Member
 * @property {string} name - 成員姓名
 * @property {number} age - 成員年齡
 */

/**
 * 成員名冊唯讀陣列，使用 Object.freeze 深層凍結
 * @type {readonly Member[]}
 */
const memberRegistryList = Object.freeze([
    Object.freeze({ name: "Alice", age: 25 }),
    Object.freeze({ name: "Bob", age: 17 })
]);

// 使用 Array.prototype.filter 搭配強型別箭頭函數篩選年滿 18 歲的成年人
const matureAdultMembers = memberRegistryList.filter(
    /** @param {Member} member */
    (member) => {
        if (typeof member.age !== 'number' || isNaN(member.age)) {
            throw new TypeError("偵測到成員物件中包含無效的年齡欄位！");
        }
        return member.age >= 18;
    }
);

console.log("全體成員名冊 ➔", memberRegistryList);
console.log("年滿 18 歲名單 ➔", matureAdultMembers);