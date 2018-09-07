const { generateShortId } = require('./shortId');
const SingletonEventEmitter = require('./singletonemitter');

module.exports = {
    generateShortId,
    SingletonEventEmitter : new SingletonEventEmitter()
}