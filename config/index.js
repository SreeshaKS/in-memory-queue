class QueueConfiguration {
    constructor(config)  {
        this._size = config.size;
    }
    getSize(){
        return this._size;
    }
    setSize(size){
        this._size = size;
    }
}

class ConsumerConfiguration {
    constructor(config) {
        this._dependency = config.dependency
        this._name = config.name
    }
    getConfiguration(){
        return {
            dependency:this._dependency,
            name:this._name
        }
    }
}

class ProducerConfiguration {
    constructor(config) {
        this._config = config
        // this._dependency = config.dependency
        // this._name = config.name
    }
    getConfiguration(){
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
    getDependencyGraph(){
        return this._dependencyGraph
    }
}

module.exports = {
    QueueConfiguration,
    ConsumerConfiguration,
    ProducerConfiguration,
    Dependency
}