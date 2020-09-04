'use strict';

// var hoisting

function getVal(condition) {
    if (condition) {
        var value = 'A';
        return value;
    } else {
        return null;
    }
}

// same as
function getVal(condition) {
    var value; // 定义但未初始化
    if (condition) {
        value = 'A';
        return value;
    } else {
        // value undefined
        return null;
    }
    // value undefined
}

// console.log(value); // ReferenceError: value is not define
// console.log(getVal(true)); // A

// block level

// const for-in loop no-error
const fns = [];
const obj = {
    a: true,
    b: true,
    c: true
}
for (const key in obj) {
    fns.push(function() {
        console.log(key);
    })
}
// fns.forEach(fn => { fn() }); // a b c

const fns2 = [];
const nums = [1,2,3];
for (const num of nums) {
    fns2.push(function() {
        console.log(num);
    })
}
// fns2.forEach(fn => { fn() }) // 1 2 3


const nums2 = [1,2,3,4];
for(let i in nums2) { // 0 1 2 3
    console.log(i);
    i *= 2;
}

// for(const i in nums2) { // 0 TypeError: Assignment to constant variable
//     console.log(i);
//     i *= 2;
// }