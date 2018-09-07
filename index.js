let eventEmitter = require('./utils').SingletonEventEmitter.getEventEmitter();
eventEmitter.on('event', (a,b) => {
    console.log(a,b)
})
eventEmitter.emit('event','a','b');