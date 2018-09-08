let { InvalidClassError,EmptyQueue, FullQueue, EmptyConsumers,NullContext } = require('../error')
let _ = require('lodash');

class Context {
    constructor(queue,consumers,producers) {
        this._queue = []
        this._consumers = []
        this._producers = []
        this._semaphore = null;
    }
    getQueue() {
        if(_.isEmpty(global.context)) throw new NullContext('Please initialize app context');
        return this._queue
    }
    setQueue(queue) {
        if(_.isEmpty(global.context)) throw new NullContext('Please initialize app context');
        this._queue = queue
    }
    getConsumer(consumer) {
        if(_.isEmpty(global.context)) throw new NullContext('Please initialize app context');
        return this._consumers.filter((e, i) => e._id == consumer._id)[0]
    }
    getProducer(producer) {
        if(_.isEmpty(global.context)) throw new NullContext('Please initialize app context');
        return this._producers.filter((e, i) => e._id == producer._id)[0]
    }
    addConsumer(consumer) {
        if(_.isEmpty(global.context)) throw new NullContext('Please initialize app context');
        this._consumers.push(consumer)
    }
    addProducer(producer) {
        if(_.isEmpty(global.context)) throw new NullContext('Please initialize app context');
        this._producers.push(producer)
    }
}


module.exports = () => {
        if(_.isEmpty(global.context)) {
            global.context = new Context()
            return global.context
        }
        return global.context
}