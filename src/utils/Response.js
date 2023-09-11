class Response {
    constructor(success, message, dataValues) {
        this.success = success;
        this.message = message;
        this.dataValues = dataValues;
    }
    isSuccess() {
        return this.success;
    }
}
module.exports = Response;
