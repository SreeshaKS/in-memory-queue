const { generateShortId } = require('../utils');
let Context = require('./context')()
let async = require('async')
let { Message } = require('./message')

class Producer {
    constructor(event, handler) {
        this._id = generateShortId(),
            this._event = event;
        this._handler = handler;
        Context.addProducer(this)
    }
    startEvents(callForEvent, errorCallback) {
        async.forever((next)=>{
            callForEvent((message)=>{
                if(message instanceof Message) {
                    console.log(Context.getQueue().getSize())
                    Context.getQueue().enQueue(message,(err,data)=>{
                        if(!err)
                            next()
                    })
                }else {
                    next(new TypeError('Object Not of type ' + Message))
                }
            })
        },errorCallback)
    }
    // ProducerEventCallBack(message, callForEvent) {
    //     if (message instanceof Message) {
    //         console.log(Context.getQueue())
    //         Context.getQueue().enQueue(message, (err, data) => {
    //             if (!err)
    //                 callForEvent((message) => this.ProducerEventCallBack(message,callForEvent))
    //         })
    //     } else {
    //         next(new TypeError('Object Not of type ' + Message))
    //     }
    // }
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

module.exports = Producer;