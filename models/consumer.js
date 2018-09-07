const { generateShortId } = require('../utils');
let { InvalidClassError,EmptyQueue, FullQueue, EmptyConsumers } = require('../error')
let eventEmitter = require('../utils').SingletonEventEmitter.getEventEmitter()
let _ = require('lodash');
let Context = require('./context')()
let async = require('async')

class Consumer {
    constructor(event, consumerConfiguration, handler) {
        this._id = generateShortId()
        this._handler = handler;
        this._config = consumerConfiguration.getConfiguration()
        
        Object.keys(this._config.dependency.processAfter)
        .map((e,i)=>{
            return [
                `${e/*_id*/}`,
                (data) => {
                    delete this._config.dependency.processAfter[data._id]
                    this.consumeMessage(data.message)
                }
            ]
        }).forEach((e,i)=>{
            eventEmitter.on(...e)
        })
        eventEmitter.on('enQueue',this.consumeMessage)
    }
    consumeMessage(message) {
        if(_.isEmpty(this._config.dependency.processAfter)) {
            async.forever(
                (next) => {
                    Context.getQueue().deQueue(this,
                        (err,data) => {
                            if(err instanceof EmptyQueue) next()
                            console.log(message,data);
                            eventEmitter.emit(this._id, { _id: this._id, message: message })
                            this._handler(data)
                        })
                },(err)=>{console.log(this._id,err)}
            )
        }
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