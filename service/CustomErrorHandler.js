class CustomErrorHandler extends Error {
    constructor(staus,msg) {
        super();
        this.staus = staus;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorHandler(409,message);
    }

    static wrongCredentials(message = 'Username Or Password is wrong') {
        return new CustomErrorHandler(401,message);
    }

    static unAuthrized(message = 'unAuthorized') {
        return new CustomErrorHandler(401,message);
    }

    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(401,message);
    }

    static serverError(message = '404 Internal Server Error') {
        return new CustomErrorHandler(500,message);
    }
}

export default CustomErrorHandler;