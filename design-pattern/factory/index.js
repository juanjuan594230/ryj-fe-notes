'use strict';

// code A

/**
 * 员工系统员工类构造函数 构造器模式
 * 共性：每个员工的属性
 * 个性：每个员工对应的属性值
 * @param {*} name
 * @param {*} age
 * @param {*} career
 */
function User(name, age, career) {
    this.name = name;
    this.age = age;
    this.career = career;
}

// 系统升级，需要根据career字段，定义员工的工作内容 work=['...', '...']

// 于是 。。。

function Coder(name, age) {
    this.name = name;
    this.age = age;
    this.career = 'coder'; // 共性抽离
    this.work = ['coding', 'bugFix']; // 共性抽离
}

function ProductManager(name, age) {
    this.name = name;
    this.age = age;
    this.career = 'productManager'; // 共性抽离
    this.work = ['PRD1', 'PRD2']; // 共性抽离
}

function Factory(name, age, career) {
    switch(career) {
        case 'coder':
            return new Coder(name, age);
            break;
        case 'productManager':
            return new ProductManager(name, age);
            break;
        // ...
    }
}