if (true) {
    console.log(typeof doSomething); // error 引用错误 TDZ
    let doSomething = function () {
        // ...
    }
    doSomething(); // block-level exist
}
// block end doSomething not exist

console.log(typeof doSomething); // undefined
// let doSomething = 'aaa';