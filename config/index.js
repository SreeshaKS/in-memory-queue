let {Consumer,Event} = require('../models')
let {TypeError} = require('../error')
let eventEmitter = require('../utils').SingletonEventEmitter.getEventEmitter()
let _ = require('lodash');

class QueueConfiguration {
    constructor(config) {
        this._size = config.size || 10;
    }
    getSize() {
        return this._size;
    }
    setSize(size) {
        this._size = size;
    }
}

class ConsumerConfiguration {
    constructor(config) {
        // {processAfter:[{_id:''}]}
        this._dependency = config.dependency
        this._name = config.name
        this._events = config.events || []
        this._consumerID = config.consumerID;
    }
    getConfiguration() {
        return {
            dependency: this._dependency,
            name: this._name,
            events: this._events
        }
    }
    addDependency(consumer){
        if(consumer instanceof Consumer) {
            this._dependency.processAfter[consumer._id] = consumer
        }else {
            throw new TypeError('Dependency not an Instance of'+Consumer)
        }
    }
    getName(){
        return this._name
    }
    // registerEvents(events) {
    //     if(!_.isEmpty(events)){
    //         if(_isEmpty(this._consumerID)){
    //             throw new Error('No Consumer Registered')
    //         }
    //         this._events.push(events)
    //         eventEmitter.emit(this._consumerID+'_RegisterEvent',events)
    //     }
    //     else throw new TypeError('Object not of type '+Event)
    // }
    registerConsumer(consumerID){
        if(!_.isEmpty(this._consumerID)){
            throw new Error('Consumer'+this._consumerID+' Already Registered')
        }else{
            this._consumerID = consumerID
        }
    }
}

class ProducerConfiguration {
    constructor(config) {
        this._config = config
        // this._dependency = config.dependency
        // this._name = config.name
    }
    getConfiguration() {
        return this._config
        // return {
        //     dependency:this._dependency,
        //     name:this._name
        // }
    }
}

class Dependency {
    constructor(dependency) {
        this._dependencyGraph = dependency.graph
    }
    getDependencyGraph() {
        return this._dependencyGraph
    }
}

module.exports = {
    QueueConfiguration,
    ConsumerConfiguration,
    ProducerConfiguration,
    Dependency
}