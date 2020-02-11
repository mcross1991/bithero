
class Queue {

    constructor() {
        this.data = [];
    }

    push(item) {
        this.data.push(item);
    }

    pop() {
        return this.data.pop();
    }

    isEmpty() {
        return this.data.length == 0;
    }
}

module.exports = Queue;

