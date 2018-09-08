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
    registerQueueEventCallbacks(events){
        console.log(this._config.events.map((e)=>this._config.name+'\t'+e.getName()+'\t'))
        events
            .map((e) => {
                return [
                    `enQueue-${e.getName()}`,
                    (d) => {
                        this.consumeMessage(d)
                    }
                ]
            }).forEach((e,i)=>{
                eventEmitter.on(...e)
            })
        //eventEmitter.on('enQueue',(d) => this.consumeMessage(d) )
    }
    registerDependencyCallbacks(){
        Object.keys(this._config.dependency.processAfter)
        .map((e,i) => {
            return [
                `${e/*_id*/}`,
                (data) => {
                    this.dependencyCallback(data)
                }
            ]
        }).forEach((e,i)=>{
            console.log()
            eventEmitter.on(...e)
        })
    }
    dependencyCallback(data){
        delete this._config.dependency.processAfter[data._id]
        this.consumeMessage(data.message)
    }
    addDepenedencyCallback(consumer){
        eventEmitter.on(consumer.getId(),(data)=>{this.dependencyCallback(data)})
    }
    consumeMessage(message) {
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
                                this._handler(this,data,null)
                            })
            }else {
                console.log('***************************************')
                console.log(this._config.name)
                console.log('Dependecy Exists')
                Object.keys(this._config.dependency.processAfter)
                .map((e)=>{console.log(this._config.dependency.processAfter[e].getName())})
                //console.log(this._config.dependency.processAfter.map((e)=>{}))
                console.log('***************************************')
            }
    }
    startConsuming(){
        this._shouldStartConsuming = true
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
    toString(){
        return `${this._config.name} : ${this._id}`
    }
    addDepenedency(consumer){
        if(consumer instanceof Consumer){
            this._config.dependency.processAfter[consumer.getId()] = consumer; 
            this.addDepenedencyCallback(consumer)
            return;
        }
        throw new TypeError('Object not of type'+ Consumer)
    }
}

module.exports = Consumer;