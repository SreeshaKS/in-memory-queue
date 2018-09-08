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
        this._shouldStartConsuming = false;
        this._config = consumerConfiguration.getConfiguration()

        consumerConfiguration.registerConsumer(this._id)
        this.registerDependencyCallbacks()
        this.registerQueueEventCallbacks(this._config.events)

        //eventEmitter.on(this._id+'_RegisterEvent',(es)=>this.registerQueueEventCallbacks(es))
        
        Context.addConsumer(this)
    }  
    registerQueueEventCallbacks(events) {
        events
            .map((e) => {
                return [
                    `enQueue-${e.getName()}`,
                    (d) => {
                        this.consumeMessage(d)
                    }
                ]
            }).forEach((e,i)=> {
                eventEmitter.on(...e)
            })
        //eventEmitter.on('enQueue',(d) => this.consumeMessage(d) )
    }
    registerDependencyCallbacks() {
        Object.keys(this._config.dependency.processAfter)
        .map((e,i) => {
            return [
                `${e/*_id*/}`,
                (data) => {
                    this.dependencyCallback(data)
                }
            ]
        }).forEach((e,i)=>{
            eventEmitter.on(...e)
        })
    }
    dependencyCallback(data) {
        delete this._config.dependency.processAfter[data._id]
        this.consumeMessage(data.message)
    }
    addDepenedencyCallback(consumer) {
        eventEmitter.on(consumer.getId(),this.dependencyCallback.bind(this))
    }
    removeDependencyCallback(consumer) {
        eventEmitter.removeListener(consumer.getId(),this.dependencyCallback)
    }
    consumeMessage(message) {
        console.log(this._config.name+' recived event' + message.getEvent().getName())
        if(this._shouldStartConsuming)
            if(_.isEmpty(this._config.dependency.processAfter)) {
                        Context.getQueue().deQueue(this,
                            (err,data) => {
                                if(err && err instanceof EmptyQueue){
                                    //If Queue is Empty , keep polling 
                                    this._handler(this,null,err.toString());return;
                                } else if (err){
                                    this._handler(this,null,err.toString());return;
                                }
                                eventEmitter.emit(this._id, { _id: this._id, message: message })
                                console.log(this._config.name+' Consuming ' + message.getEvent().getName())
                                this._handler(this,data,null)
                            })
            }else {
                console.log('********')
                console.log(this._config.name,'Dependecy Exists')
                Object.keys(this._config.dependency.processAfter)
                .map((e)=>{console.log(this._config.dependency.processAfter[e].getName())})
                //console.log(this._config.dependency.processAfter.map((e)=>{}))
                console.log('********')
            }
    }
    startConsuming() {
        this._shouldStartConsuming = true
        Context.getQueue().restartInfinitePolling()
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
    getName() {
        return this._config.name
    }
    toString() {
        return `${this._config.name} : ${this._id}`
    }
    addDepenedency(consumer) {
        if(consumer instanceof Consumer){
            this._config.dependency.processAfter[consumer.getId()] = consumer; 
            this.addDepenedencyCallback(consumer)
            return;
        }
        throw new TypeError('Object not of type'+ Consumer)
    }
    removeDependency(consumer) {
        if(consumer instanceof Consumer){
            delete this._config.dependency.processAfter[consumer.getId()] 
            console.log('Removing Dependency ' + consumer.getName() + ' from '+this.getName())
            this.removeDependencyCallback(consumer)
            Context.getQueue().restartInfinitePolling()
            return;
        }
        throw new TypeError('Object not of type'+ Consumer)
    }
}

module.exports = Consumer;