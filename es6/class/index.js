'use strict';

function Person(name) {
    this.name = name;
}
Person.prototype.sayName = function() {
    console.log(this.name);
}
const RYJ = new Person('renyujuan');
RYJ.sayName(); // renyujuan
console.log(RYJ instanceof Person); // true
console.log(RYJ instanceof Object); // true