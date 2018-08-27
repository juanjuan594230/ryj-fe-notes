/*  */

/* function Animal() {
  this.catgorys = ['单细胞动物','卵生动物','哺乳动物'];
}

Animal.prototype.move = function() {
  console.log('i can move');
}

function Cat(name, age) {
  this.name = name;
  this.age = age;
}

Cat.prototype = new Animal();

Cat.prototype.sayName = function() {
  console.log(this.name);
}

const cat1 = new Cat('mimi', 1);
const cat2 = new Cat('miaomiao', 2);
cat1.sayName();
cat1.move();
cat1.catgorys.push('爬行动物');

console.log(cat2.catgorys); */

/* function Animal(catgory) {
  this.catgory = catgory;
}

Animal.prototype.walk = function() {
  console.log('walk');
}

function Cat(name, age) {
  Animal.call(this, 'cat');
  this.name = name;
  this.age = age;
}

Cat.prototype.sayName = function() {
  console.log(this.name);
}

const cat3 = new Cat('mm', 1);
console.log(cat3.catgory);  // cat
cat3.sayName();  // mm
// cat3.walk();  // referenceError */

/* zuhejicheng */
/* function Animal(catgory) {
  this.catgory = catgory;
  this.patrs = ['eyes', 'ears', 'mouse'];
}

Animal.prototype.walk = function() {
  console.log('walk');
}

function Cat(name, age) {
  Animal.call(this, 'cat');
}

Cat.prototype = new Animal();

Cat.prototype.constructor = Cat;
Cat.prototype.sayName = function() {
  console.log(this.name);
}

const cat4 = new Cat('44', 4);
const cat5 = new Cat('55', 1);
cat4.walk();  // walk
cat4.patrs.push('yellow hair');
console.log(cat4.patrs); // [ 'eyes', 'ears', 'mouse', 'yellow hair' ]
console.log(cat5.patrs); // [ 'eyes', 'ears', 'mouse' ] */


/* yuanxingshijicheng */
/* function object(o) {
  function F() {};
  F.prototype = o;
  return new F();
}

var renyujuan = {
  name: "Nicholas",
  friends: [
    "Shelby",
    "Court",
    "Van"
  ],
  smile() {
    console.log('smile');
  }
};

var _renyujuan = object(renyujuan);
_renyujuan.name = '_renyujuan';
_renyujuan.friends.push('liuyiqiang');
_renyujuan.smile();  // smile
console.log(_renyujuan.name);  // _renyujuan
console.log(_renyujuan.friends);  // [ 'Shelby', 'Court', 'Van', 'liuyiqiang' ]
console.log(renyujuan.name);  // Nicholas
console.log(renyujuan.friends); // [ 'Shelby', 'Court', 'Van', 'liuyiqiang' ] */

/* jishengshijicheng */

/* function object(o) {
  function F() {};
  F.prototype = o;
  return new F();
}

function create(origin) {
  const clone = object(origin);
  // 只是有一个对对象增强的过程
  clone.sayHi = function() {
    console.log('hi');
  }
  return clone;
} */

/* 寄生组合继承 */

/* function inheritPrototype(SubType, SuperType) {
  const _prototype = Object.create(SuperType.prototype);
  // 增强对象的过程
  _prototype.constructor = SubType;
  SubType.prototype = _prototype;
}

function Animal(catgory) {
  this.catgory = catgory;
}

Animal.prototype.walk = function() {
  console.log('walk');
}

function Cat(name) {
  Animal.call(this, 'cat');
  this.name = name;
}

inheritPrototype(Cat, Animal);

Cat.prototype.sayName = function() {
  console.log(this.name);
} */


class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPonit extends Point {
  constructor (x, y, color) {
    // 不调用super，子类得不到this对象
    super(x, y);
    this.color = color;
  }
  toString () {
    return `${this.color} ${super.toString()}`
  }
}

