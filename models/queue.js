let { InvalidClassError,EmptyQueue, FullQueue, EmptyConsumers } = require('../error')
let { Message } = require('./message')
let { QueueConfiguration } = require('../config')
const { generateShortId } = require('../utils')
let eventEmitter = require('../utils').SingletonEventEmitter.getEventEmitter()
let Context = require('./context')()
let _ = require('lodash');

class Queue {
    constructor(queue,queueConfiguration) {
        this._id = generateShortId();
        this._queue = queue || [];
        this._configuration = queueConfiguration
        Context.setQueue(this)
    }
    // addConsumer(consumer) {
    //     this._consumers[consumer._id] = consumer;
    // }
    getQueue() {
        return this._queue;
    }
    getSize(){
        return this._queue.length
    }
    getQueueId() {
        return this._id;
    }
    deQueue(consumer,callback) {
        if(_.isEmpty(this._queue)) {
            callback(new EmptyQueue(`Empty Queue Cannot DeQueue Message; Consumer : ${consumer.toString()}`),null)
            return;
        }
        let data = this._queue.pop()
        eventEmitter.emit('deQueue',data)
        callback(null,data)
    }
    getConfiguration(){
        return this._configuration
    }
    enQueue(message,postEnqueue) {
        console.log(this._queue.length , this._configuration.getSize() )
        if( this._queue.length >= this._configuration.getSize() ){
            postEnqueue( new FullQueue('Queue Full Cannot Add Elements'))
            return;
        }
        if (message instanceof Message){
            this._queue.unshift(message)
            eventEmitter.emit(`enQueue-${message.getEvent().getName()}`,message)
            postEnqueue(null,'enqueued')
        }
        else{
            throw new InvalidClassError('Only instances of Message are allowed')
        }
    }
}

module.exports = Queue;