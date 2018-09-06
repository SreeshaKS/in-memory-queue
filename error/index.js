class InvalidClassError extends Error {
    constructor(message) {
        this._message = message
    }
    toString() {
        return this._message;
    }
}
module.exports = {
    InvalidClassError
}