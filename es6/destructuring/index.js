// const { name } = undefined;

// const person = {
//     name: 'renyujuan'
// }
// const { name: fullName } = person;
// console.log(fullName); // renyujuan


// 嵌套对象解构赋值
// const person = {
//     name: {
//         firstName: 'ren',
//         lastName: 'yujuan',
//         fullName: 'renyujuan'
//     }
// }

// const { name : { firstName, lastName, fullName } } = person; // 嵌套的花括号标明需要查找的属性为person.name.firstName\lastName\fullName
// // console.log('name', name); // error
// console.log('firstName', firstName); // ren

// const colors = ['red', 'green', 'blue'];
// const [ firstColor, secondColor ] = colors;
// const [ fc, , tc ] = colors;
// console.log('firstColor', firstColor); // red
// console.log('secondColor', secondColor); // green
// console.log('fc', fc); // red
// console.log('tc', tc); // blue

// swap
// let a = 1;
// let b = 2;
// [ a, b ] = [ b, a ];
// console.log('a', a);
// console.log('b', b);

// const [ firstcolor, [ secondfirstcolor ]] = [ 'red', ['pink', 'grey']];
// console.log('firstcolor', firstcolor); // red
// console.log('secondfirstcolor', secondfirstcolor); // pink

const nums = [1, 2, 3, 4, 5];
const [ firstNum, ...subNums ] = nums;
const [ ...subNums1 ] = nums;
subNums1[0] = 0;
// console.log('firstNum', firstNum); // 1
// console.log('subNums', subNums); // [2,3,4,5]
// console.log('nums', nums); // [1,2,3,4,5]
// console.log('subNums1', subNums1); // [0,2,3,4,5]

const objs = [
    {
        name: 'obj1'
    },
    {
        name: 'obj2'
    }
]
const [...objCopy] = objs;
objCopy[0].name = 'obj0';
console.log('objs', objs); // [{ name: obj0}, { name: obj2}]
console.log('objCopy', objCopy); // [{ name: obj0}, { name: obj2}]