// 'use strict';

// set trap
// const target = {};

// const handler = {
//     // 修改赋值操作的默认行为
//     set(targetObj, key, value, receiver) {
//         // validate
//         if (typeof value !== 'number') {
//             throw new Error('属性值必须为数值');
//         }
//         Reflect.set(targetObj, key, value, receiver);
//     }
// }

// const proxy = new Proxy(target, handler);

// proxy.first = 1;
// console.log(proxy.first); // 1
// proxy.second = '1'; // throw error

// get trap
// const target = {
//     name: 'renyujuan',
//     sex: 'women'
// };
// const proxy = new Proxy(target, {
//     get(targetObj, key, receiver) {
//         // if (!targetObj.hasOwnProperty(key)) {
//         //     throw new Error('该对象上不存在此属性');
//         // }
//         if (!(key in receiver)) {
//             throw new Error('该对象上不存在此属性');
//         }
//         return Reflect.get(targetObj, key, receiver);
//     }
// });
// console.log(proxy.name);
// console.log(proxy.age);


// has trap

// const target = {
//     name: 'renyujuan'
// };
// console.log('name' in target);
// console.log('toString' in target);

// const target = {
//     name: 'target',
//     value: 42,
// };
// const proxy = new Proxy(target, {
//     has(targetObj, key) {
//         if (key === 'value') {
//             return false;
//         }
//         return Reflect.has(targetObj, key);
//     }
// });
// console.log('value' in proxy);
// console.log('name' in proxy);



// deleteProperty trap

// const target = {
//     name: 'target',
//     value: 42
// };
// Object.defineProperty(target, 'value', {
//     configurable: false
// });
// const result1 = delete target.name;
// console.log('name' in target); // false
// console.log(result1); // true
// const result2 = delete target.value; // error
// console.log('value' in target);
// console.log(result2);


// const target = {
//     name: 'target',
//     value: 42
// };
// const proxy = new Proxy(target, {
//    deleteProperty(targetObj, key) {
//        if (key === 'value') {
//             return false;
//        }
//        return Reflect.deleteProperty(targetObj, key);
//    }
// });
// const resultDeleteValue = delete proxy.value;
// console.log(resultDeleteValue); // false
// console.log('value' in proxy); // true
// const resultDeleteName = delete proxy.name;
// console.log(resultDeleteName); // true
// console.log('name' in proxy); // false


// prototype proxy trap

// const target = {};
// const proxy = new Proxy(target, {
//     getPrototypeOf(trapTarget) {
//         return null; // 隐藏原型对象
//     },
//     setPrototypeOf(trapTarget, proto) {
//         return false; // 限制不能修改原型对象
//     }
// })
// const targetPtoto = Object.getPrototypeOf(target);
// const proxyProto = Object.getPrototypeOf(proxy);
// console.log(targetPtoto);
// console.log(proxyProto);

// const result = Object.getPrototypeOf(1);
// console.log(result);
// Reflect.getPrototypeOf(1);


// 对象可扩展的陷阱

// const target = {};
// const proxy = new Proxy(target, {
//     preventExtensions(trapTarget) {
//         return Reflect.preventExtensions(trapTarget);
//     },
//     isExtensible(trapTarget) {
//         console.log(trapTarget === target);
//         return Reflect.isExtensible(trapTarget);
//     }
// });
// console.log(Object.isExtensible(proxy));
// console.log(Object.isExtensible(target));

// Object.preventExtensions(proxy);
// console.log(Object.isExtensible(proxy));
// console.log(Object.isExtensible(target));

// console.log(Object.isExtensible(1));
// console.log(Reflect.isExtensible(1));

// ownKeys trap

// 以下划线开头的属性

// const proxy = new Proxy({}, {
//     ownKeys(trapTarget) {
//         return Reflect.ownKeys(trapTarget).filter(key => {
//             return !(typeof key === 'string' && key[0] === '_');
//             // return typeof key !== "string" || key[0] !== "_"; // 过滤string，且以_开头的属性
//         });
//         // return Reflect.ownKeys(trapTarget) // default behavior
//     }
// })

// let nameSymbol = Symbol("name");

// proxy.name = "proxy";
// proxy._name = "private";
// proxy[nameSymbol] = "symbol";

// let names = Object.getOwnPropertyNames(proxy), // string type props
//     keys = Object.keys(proxy); // string type props
//     symbols = Object.getOwnPropertySymbols(proxy);

// // ownKeys trap
// console.log('names', names); // names [ 'name' ]
// console.log('_name', keys); // _name [ 'name' ]
// console.log('symbols', symbols); // symbols [ Symbol(name) ]
// // default behavior
// // console.log('names', names); // ['name', '_name'] default behavior
// // console.log('_name', keys); // ['name', '_name'] default behavior
// // console.log('symbols', symbols); // symbols [ Symbol(name) ] default behavior

// for (let prop in proxy) {
//     console.log('prop', prop); // only name prop
// }


// apply constructor trap

// default
// const target = function() {
//     return 'target';
// }
// const proxy = new Proxy(target, {
//     apply(trapTarget, thisArg, argumentList) {
//         return Reflect.apply(trapTarget, thisArg, argumentList);
//     },
//     construct(trapTarget, argumentList, newTarget) {
//         return Reflect.construct(trapTarget, argumentList, newTarget);
//     }
// })

// console.log(typeof proxy); // function
// console.log(proxy()); // target

// const instance = new proxy();
// console.log(instance instanceof target); // true
// console.log(instance instanceof proxy); // true

// 验证所有的参数是一个特定类型
/**
 * 使用apply trap确保所有的参数都是数值类型
 * @param  {...any} values
 */
// function sum(...values) {
//     console.log('values', values);
//     return values.reduce((previous, current) => previous + current, 0);
// }

// const proxy = new Proxy(sum, {
//     apply(trapTarget, thisArg, argumentList) {
//         console.log('argumentList', argumentList);
//         for (const argument of argumentList) {
//             if (typeof argument !== 'number') {
//                 throw new Error('参数必须为数值类型');
//             }
//         }
//         return Reflect.apply(trapTarget, thisArg, argumentList);
//     },
//     // 确保函数不可以使用new操作符
//     construct: function(trapTarget, argumentList) {
//         throw new TypeError("This function can't be called with new.");
//     }
// });

// console.log(proxy(1,2,3,4)); // 10
// console.log(proxy(1,2,3,'4')); // error

/**
 * 函数必须使用new操作符调用，且参数必须都为Number类型
 * @param  {...any} values
 */
// function Numbers(...values) {
//     console.log('values', values);
//     this.values = values;
// }

// const NumbersProxy = new Proxy(Numbers, {
//     apply(trapTarget, thisArg, argumentList) {
//         throw new Error('只能使用new操作符调用');
//     },
//     construct(trapTarget, argumentList) {
//         console.log(argumentList);
//         for (const argument of argumentList) {
//             if (typeof argument !== 'number') {
//                 throw new Error('参数必须为数值类型');
//             }
//         }
//         return Reflect.construct(trapTarget, argumentList);
//     }
// })

// let instance = new NumbersProxy(1, 2, 3, 4);
// console.log(instance.values);               // [1,2,3,4]

// throws error
// NumbersProxy(1, 2, 3, 4);

// 不使用new操作符调用构造函数

// 可以通过new.target来判断函数是否通过new操作符

// function Numbers2(...values) {
//     if (new.target === undefined) {
//         throw new Error('只能通过new来调用');
//     }
//     this.values = values;
// }

// // 不是特别懂
// // The NumbersProxy function allows you to call Numbers without using new and have it behave as if new were used. To do so,
// // the apply trap calls Reflect.construct() with the arguments passed into apply.
// // The new.target inside of Numbers is equal to Numbers itself, and no error is thrown.
// // While this is a simple example of modifying new.target, you can also do so more directly.
// Numbers2(1,2,3,4); // Error: 只能通过new来调用

// function Numbers(...values) {

//     if (typeof new.target === "undefined") {
//         throw new TypeError("This function must be called with new.");
//     }

//     this.values = values;
// }


// let NumbersProxy = new Proxy(Numbers, {
//         apply: function(trapTarget, thisArg, argumentsList) {
//             return Reflect.construct(trapTarget, argumentsList);
//         }
//     });


// let instance = NumbersProxy(1, 2, 3, 4);
// console.log(instance.values); // [1,2,3,4]



// 重写抽象基类构造函数

// class AbstractNumbers {

//     constructor(...values) {
//         if (new.target === AbstractNumbers) {
//             throw new TypeError("This function must be inherited from.");
//         }

//         this.values = values;
//     }
// }

// // class Numbers extends AbstractNumbers {}

// // let instance = new Numbers(1, 2, 3, 4);
// // console.log(instance.values);           // [1,2,3,4]

// // // throws error
// // new AbstractNumbers(1, 2, 3, 4);

// const abstractNumbersProxy = new Proxy(AbstractNumbers, {
//     construct(trapTarget, argumentList) {
//         return Reflect.construct(trapTarget, argumentList, function() {}); // new.target不会再等于AbstractNumbers
//     }
// })
// let instance = new AbstractNumbersProxy(1, 2, 3, 4); // new.target不会再等于AbstractNumbers，直接new调用不会报错
// console.log(instance.values); // [1,2,3,4]


// 可调用构造函数

class Person {
    // 默认必须使用new操作符调用
    constructor(name) {
        this.name = name;
    }
}

// Person('AAA'); // TypeError: Class constructor Person cannot be invoked without 'new'

const PersonProxy = new Proxy(Person, {
    apply(trapTarget, thisArg, argumentList) {
        return new trapTarget(...argumentList);
        // return Reflect.construct(trapTarget, argumentList);
    }
})

const instance = PersonProxy('AAA');
console.log(instance.name); // AAA

Person('BBBB'); // error again Creating callable class constructors is something that is only possible using proxies.
