class Queue {
    constructor() {
        this._arr = [];
    }

    enter(val) {
        const _this = this;
        this._arr.push(val);
        return this._arr.length;
    }

    out() {
        const _this = this;
        const outer = this._arr.shift();
        return outer;
    }

    size() {
        return this._arr.length;
    }
}

const queue1 = new Queue();
queue1.enter(1);
queue1.enter(2);
queue1.enter(3);
queue1.enter(4);
console.log(queue1.out());
console.log(queue1.out());
console.log(queue1.out());
console.log(queue1.out());