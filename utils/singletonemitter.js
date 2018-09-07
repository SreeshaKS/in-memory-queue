let EventEmitter = require('events');

class SingletonEventEmitter {
    constructor() {
        if(this._EventEmitter == null){
            this._EventEmitter = new EventEmitter();
            this._EventEmitter.on('newListener',() => this._EventEmitter.setMaxListeners(this._EventEmitter.getMaxListeners() + 1))
            this._EventEmitter.on('removeListener',() => this._EventEmitter.setMaxListeners(Math.max(this._EventEmitter.getMaxListeners() - 1, 0)))
        }
    }
    getEventEmitter() {
        return this._EventEmitter;
    }
    getEventNames(regex) {
        return this._EventEmitter.eventNames()
    }
}
module.exports = SingletonEventEmitter;