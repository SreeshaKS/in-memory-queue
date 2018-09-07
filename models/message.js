const { generateShortId } = require('../utils');

class Message {
    constructor(data) {
        this._id = generateShortId()
        this._data = data
    }
    identity() {
        return 'MessageObject'
    }
    getMessage(){
        return this._data = data
    }
}

module.exports = Message