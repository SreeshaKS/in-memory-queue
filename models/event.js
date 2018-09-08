const { generateShortId } = require('../utils');
class Event {
    constructor(name){
        this._id  = generateShortId()
        this._name= name
    }
    getId(){
        return this._id
    }
    getName(){
        return this._name
    }
}
module.exports = Event