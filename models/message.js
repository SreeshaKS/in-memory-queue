const { generateShortId } = require('../utils');

class Message {
    constructor(data,event) {
        this._id = generateShortId()
        this._data = data
        this._event = event
    }
    identity() {
        return 'MessageObject'
    }
    getData(){
        return this._data = data
    }
    getEvent(){
        return this._event
    }
    getId(){
        return this._id;
    }
}

module.exports = {
    Message
}