
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

    empty() {
        return this.data.length == 0;
    }
}

module.exports = Queue;

