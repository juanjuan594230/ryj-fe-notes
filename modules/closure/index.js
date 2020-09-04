// function createFunctions() {
//   var result = new Array();
//   for (let i = 0; i < 10; i++) {
//     result[i] = function() {
//       return i;
//     }
//   }
//   return result;
// }

// const funcArr = createFunctions();
// let i = 0;
// while (i < 10) {
//   console.log(funcArr[i]());
//   i++;
// }

// for (var i = 0; i < 5; i++) {
//   setTimeout(() => {
//     console.log(i);
//   }, 1000);
// }

// for (var i = 0; i < 5; i++) {
//   (function (i) {
//     setTimeout(() => {
//       console.log(i);
//     }, 1000);
//   })(i);
// }

// if ( 'a' in window ) {
//   var a = 'hello js';
// }
// console.log( a );

// var name = 'window';
// const person1 = {
//   name: 'person1',
//   sayName: () => {
//     console.log(this.name);
//   }
// }
// console.log(person1);
// console.log(window);
// person1.sayName();

// var name = 'window';
// const person1 = {
//   name: 'person1',
//   sayName: function () {
//     console.log(this);
//     console.log(this.name);
//   }
// }

// person1.sayName();

// var name = "global";
// function Person(name) {
//     this.name = name;
//     this.sayName = () => {
//         console.log(this.name)
//     }
// }
// const personA = new Person('aaa');
// const personB = new Person('bbb');

// personA.sayName(); // aaa
// personB.sayName(); // bbb

// var a = 'globalA';
// var obj = {
//   a: 'objA',
//   test
// }
// function test() {
//   console.log(this.a)
// }
// obj.test();

// var a = 'globalA';
// var obj = {
//   a: 'objA',
//   test
// }
// function test() {
//   console.log(this.a)
// }
// const globalTest = obj.test;
// globalTest();

var a = 'globalA';
var obj = {
  a: 'objA',
  test
}
function test() {
  console.log(this.a)
}

function test1(fn) {
  fn();
}

test1(obj.test);

代码大全
重构


