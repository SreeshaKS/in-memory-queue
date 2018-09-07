class InvalidClassError extends Error {
    constructor(message) {
        this._message = message
    }
    toString() {
        return this._message;
    }
}

class EmptyQueue extends Error {
    constructor(message) {
        this._message = message
    }
    toString() {
        return this._message;
    }
}

class FullQueue extends Error {
    constructor(message) {
        this._message = message
    }
    toString() {
        return this._message;
    }
}

class EmptyConsumers extends Error {
    constructor(message) {
        this._message = message
    }
    toString() {
        return this._message;
    }
}

class NullContext extends Error {
    constructor(message) {
        this._message = message
    }
    toString() {
        return this._message;
    }
}

module.exports = {
    InvalidClassError,
    FullQueue,
    EmptyQueue,
    EmptyConsumers,
    NullContext
}