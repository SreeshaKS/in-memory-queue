const { generateShortId } = require('../utils');

class Consumer {
    constructor(event, handler) {
        this._id = generateShortId(),
            this._event = event;
        this._handler = handler;
    }
    getEvent() {
        return this._event;
    }

    getId() {
        return this._id;
    }

    getHandler() {
        return this._handler;
    }
}

module.exports = Consumer;