import Joi from "joi";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import  {  User } from '../../models';
import bcrypt from 'bcrypt';
import JwtService from "../../service/JwtService";
import { REFRESH_SECRET } from "../../config";
import refreshToken from "../../models/refreshToken";

const registerController = {
   async register(req,res,next) {
    //Logic


    //Validation
    const registerSchema = Joi.object({

    name:Joi.string().min(3).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp('[a-zA-Z0-9]{3,30}$')).required(),
    repeat_password:Joi.ref('password')
    })

   
    const { error } =registerSchema.validate(req.body);
    
    if(error) {
        return next(error)
    }

    //Check if user is in the database already
    try {

    const exist = await User.exists({email:req.body.email });
    if(exist) {
        return next(CustomErrorHandler.alreadyExist('This Email Is Already Taken.'));
    }

    }catch(err) {
    return next(err);
    }

    const { name , email , password} = req.body; //Destructure in JS
    //Hash Password
    const hashpassword = await bcrypt.hash(password,10);



    //prepare the model
    const user = new User({
        name,
        email,
        password:hashpassword
    
})

    let access_token;
    let refresh_token;
    try {
        const result = await user.save();
        
    //Token
     access_token = JwtService.sign({_id:result._id, role:result.role});  
     refresh_token = JwtService.sign({_id:result._id, role:result.role},'1y',REFRESH_SECRET);  

    //Database Whitelist
    await refreshToken.create({token:refresh_token})

    } catch (err) {
        return next(err)
    }

 
    

    res.json({access_token,refresh_token})


    }
}

export default registerController;