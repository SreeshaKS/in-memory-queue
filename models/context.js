class Context {
    constructor() {
        this._consumers = []
        this._producers = []
    }
    getQueue() {
        return this._queue
    }
    setQueue(queue) {
        this._queue = queue
    }
    getConsumer(consumer) {
        return this._consumers.filter((e, i) => e._id == consumer._id)[0]
    }
    getProducer(producer) {
        return this._producers.filter((e, i) => e._id == producer._id)[0]
    }
    addConsumer(consumer) {
        this._consumers.push(consumer)
    }
    addProducer(producer) {
        this._producers.push(producer)
    }
}

module.export = Context