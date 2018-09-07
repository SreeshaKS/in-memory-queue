let { InvalidClassError,EmptyQueue, FullQueue, EmptyConsumers } = require('../error')
let { Message } = require('./message')
let { QueueConfiguration } = require('../config')
const { generateShortId } = require('../utils')
let eventEmitter = require('../utils').SingletonEventEmitter.getEventEmitter()
let _ = require('lodash');

class Queue {
    constructor(queue,queueConfiguration) {
        this._id = generateShortId();
        this._queue = queue || [];
        this._configuration = queueConfiguration
        //this._consumers = [];
    }
    // addConsumer(consumer) {
    //     this._consumers[consumer._id] = consumer;
    // }
    getQueue() {
        return this._queue;
    }
    getQueueId() {
        return this._id;
    }
    deQueue(consumer,callback) {
        if(_.isEmpty(this._queue)) {
            callback(new EmptyQueue(`Empty Queue Cannot DeQueue Consumer : ${consumer}`))
        }
        // if(_.isEmpty(this._consumers)) {
        //     throw new EmptyConsumers('Please add consumers to Dequeue')
        // }
        let data = this._queue.pop()
        eventEmitter.emit('deQueue',data)
        callback(null,data)
    }
    getConfiguration(){
        return this._configuration
    }
    enQueue(message) {
        if( this._queue.length == this._configuration.size ){
            throw new FullQueue('Queue Full Cannot Add Elements')
        }
        if (message instanceof Message){
            this._queue.unshift(message)
            eventEmitter.emit('enQueue',data)
        }
        else{
            throw new InvalidClassError('Only instances of Message are allowed')
        }
    }
}

module.exports = Queue;