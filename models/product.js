import { APP_URL } from '../config';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type :String , required: true},
    price: { type :Number , required: true},
    size: { type :String , required: true},
    image: { type :String , required: true,get:(image) => {
        //http://localhost:5000/uploads/ifiohsfjf555sfksja
        return `${APP_URL}/${image}`
    }},
    
},{timestamps:true,toJSON:{getters:true},id:false});

export default mongoose.model('Product',productSchema,'products');