let { InvalidClassError } = require('../exceptions');
let { Message } = require('./message')
const { generateShortId } = require('../utils');

class Queue {
    costructor(queue) {
        this._id = generateShortId();
        this._queue = queue || [];
    }
    getQueue() {
        return this._queue;
    }
    getQueueId() {
        return this._id;
    }
    deQueue() {
        return this._queue.pop()
    }
    enQueue(message) {
        if (message instanceof Message)
            this._queue.unshift(message)
        else
            throw new InvalidClassError('Only instances of Message are allowed')
    }
}

module.exports = Queue;