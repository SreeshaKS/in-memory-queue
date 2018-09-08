let { InvalidClassError, EmptyQueue, FullQueue, EmptyConsumers } = require('../error')
let { Message } = require('./message')
let { QueueConfiguration } = require('../config')
const { generateShortId } = require('../utils')
let eventEmitter = require('../utils').SingletonEventEmitter.getEventEmitter()
let Context = require('./context')()
let _ = require('lodash');
let mutex = false;
let async = require('async')

class Queue {
    constructor(queue, queueConfiguration) {
        this._id = generateShortId();
        this._queue = queue || [];
        this._configuration = queueConfiguration
        eventEmitter.on('deQueue', (message) => {
            console.log('Received DeQueue - Releasing Lock')
            //Release polling lock
            this.restartInfinitePolling()
        })
        Context.setQueue(this)
        async.forever((n) => { this.startInfinitePolling(n) })
    }
    // addConsumer(consumer) {
    //     this._consumers[consumer._id] = consumer;
    // }
    getQueue() {
        return this._queue;
    }
    getSize() {
        return this._queue.length
    }
    getQueueId() {
        return this._id;
    }
    restartInfinitePolling() {
        mutex = false 
    }
    startInfinitePolling(next) {
        while (!_.isEmpty(this._queue) && !mutex) {
            mutex = true;
            let message = this._queue.pop(); this._queue.push(message)
            console.log('enQueue for '+message.getEvent().getName())
            eventEmitter.emit(`enQueue-${message.getEvent().getName()}`, message)
        }
        next()
    }
    deQueue(consumer, callback) {
        if (_.isEmpty(this._queue)) {
            callback(new EmptyQueue(`Empty Queue Cannot DeQueue Message; Consumer : ${consumer.toString()}`), null)
            return;
        }
        let data = this._queue.pop()
        eventEmitter.emit('deQueue', data)
        callback(null, data)
    }
    getConfiguration() {
        return this._configuration
    }
    enQueue(message, postEnqueue) {

        if (this._queue.length >= this._configuration.getSize()) {
            console.log('Queue Full')
            postEnqueue(new FullQueue('Queue Full Cannot Add Elements'))
            return;
        }
        if (message instanceof Message) {
            console.log('Enqueing '+message.getId()+' '+message.getEvent().getName())
            this._queue.unshift(message)
            postEnqueue(null, 'enqueued')
        } else {
            throw new InvalidClassError('Only instances of Message are allowed')
        }
    }
}

module.exports = Queue;