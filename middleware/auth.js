import CustomErrorHandler from "../service/CustomErrorHandler";
import JwtService from "../service/JwtService";

const auth = async(req,res,next) => {

    let authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthrized());
    }

    const token = authHeader.split(' ')[1];
    console.log(token);

    try {
        const { _id,role } = await JwtService.verify(token)
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    
    } catch (err) {
    return next (CustomErrorHandler.unAuthrized());        
    }

}

export default auth;