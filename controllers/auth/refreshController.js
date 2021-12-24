import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { User } from "../../models";
import refreshToken from "../../models/refreshToken";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import JwtService from "../../service/JwtService";

const refreshController = {

    async refresh(req,res,next) {

    //validation
    const refreshSchema = Joi.object({
        refresh_token:Joi.string().required()
    });

    const { error } = refreshSchema.validate(req.body)
    if(error) {
        return next(error);
    }


    let refreshtoken;
    //Database
    try {
        refreshtoken = await refreshToken.findOne({token:req.body.refresh_token})
    if (!refreshtoken) {
        return next(CustomErrorHandler.unAuthrized('Invalid refesh token'))
    }    


    
    let userId
    try {
        const{_id} = await JwtService.verify(refreshtoken.token,REFRESH_SECRET);
        userId = _id;
    } catch (error) {
        return next(CustomErrorHandler.unAuthrized('Invalid refes token'))
    }




    const user = User.findOne({_id:userId})
    if(!user){
     return next(CustomErrorHandler.unAuthrized('No user Found'))
    }

    //Token
    const access_token = JwtService.sign({_id:user._id, role:user.role});  
    const refresh_token = JwtService.sign({_id:user._id, role:user.role},'1y',REFRESH_SECRET);  

    //Database Whitelist
    await refreshToken.create({token:refresh_token})
    res.json ({access_token,refresh_token})  



    } catch (err) {
        return next(new Error('something went wrong' + err.message))
    }

    }

}

export default refreshController