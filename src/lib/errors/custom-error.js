export class CustomError extends Error {
    constructor(message, code, statusCode, error) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.error = error
    }
}