import { Product } from "../models";
import multer from 'multer';
import  path from 'path';
import CustomErrorHandler from "../service/CustomErrorHandler";
import fs from 'fs';
import Joi from 'joi';
import productSchema from "../validators/productValidator";
import product from "../models/product";



const storage = multer.diskStorage({
    destination:(req,file,cb) => cb(null,'uploads/'),
    filename:(req,file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
});


const handleMultipartData = multer({ storage,limits: {fileSize:1000000 * 5 } }).single('image') //5mb

const productController = {
   async store(req,res,next) {
       //Multipart form data
       handleMultipartData(req,res, async (err) => {
           if (err) {
               return next (CustomErrorHandler.serverError(err.message))
           }
          
           const filepath = req.file.path;
           //Validation from ProductValidator
        

        const { error } = productSchema.validate(req.body)
        if (error) {
            //Delete the uploade file
            fs.unlink(`${appRoot}/${filepath}`,(err) => {
                if (err) {
                    return next (CustomErrorHandler.serverError(err.message))
                }
               
            });

            //rootfolder/uploads/filename.png
            return next (error);
        }
        const { name,price,size} = req.body;
        let document;

        try {
           document = await Product.create({
            name,
            price,
            size,
            image:filepath
           }); 

        } catch (error) {
            return next (error)
        }
        res.status(201).json(document);
       });

       
    },



    update(req,res,next) {
        handleMultipartData(req,res, async (err) => {
            if (err) {
                return next (CustomErrorHandler.serverError(err.message))
            }
            
            let filepath ;;
            if(req.file){
                filepath = req.file.path
            }
          
            //Validation
    
         const { error } = productSchema.validate(req.body)
         if (error) {
             //Delete the uploade file

             if(req.file) {
             fs.unlink(`${appRoot}/${filepath}`,(err) => {
                 if (err) {
                     return next (CustomErrorHandler.serverError(err.message))
                 }
             });
             }

             //rootfolder/uploads/filename.png
             return next (error);

         }

         const { name,price,size} = req.body;
         let document;
 
         try {
            document = await Product.findOneAndUpdate({_id:req.params.id},{
             name,
             price,
             size,
             ...(req.file && {image:filepath})
            }, {new:true}); 
        
 
         } catch (error) {
             return next (error)
         }
         res.status(201).json(document);
        });
    },

   async destroy(req,res,next) {
        const document = await  Product.findOneAndRemove({_id:req.params.id})
        if (!document) {
            return next(new Error('Nothing to Delete'))
        }
        //image delete
        const imagePath = document._doc.image;
        fs.unlink(`${appRoot}/${imagePath}`,(err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
        });
        res.json(document);
    },


    async  index(req,res,next) {
        let documents;
        //pagination mongoose pagination
        try {
            documents = await Product.find().select('-updatedAt -__v').sort({_id:-1})
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents)
    },

    async show (req,res,next) {
        let document;
        try {
            document = await Product.findOne({_id:req.params.id}).select('-updatedAt -__v')
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document)
    },
    async getProducts(req, res, next) {
        let documents;
        try {
            documents = await Product.find({'_id': { $in: req.body.ids }}).select('-updatedAt -__v');
        } catch(err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    }
    
}

    

export default productController