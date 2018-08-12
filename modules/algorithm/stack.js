class Stack {
    constructor() {
        this.arr = [];
    }

    push(val) {
        const _this = this;
        this.arr.push(val);
        return this.arr.length;
    }

    pop() {
        const _this = this;
        const popVal = this.arr.pop();
        return popVal;
    }

    size() {
        return this.arr.length;
    }
}

/* const stack1 = new Stack();
stack1.push(1);
stack1.push(2);
stack1.push(3);
console.log(stack1.size());
console.log(stack1.pop());
console.log(stack1.pop());
console.log(stack1.pop()); */
