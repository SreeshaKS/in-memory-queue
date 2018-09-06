const { generateShortId } = require('../utils');

class Message {
    constructor() {
        this._id = generateShortId()
    }
    identity() {
        return 'MessageObject'
    }
}

module.exports = Message