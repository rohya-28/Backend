import  express  from "express";
const router =express.Router();
import {productController, refreshController, registerController, userController} from '../controllers';
import { loginController } from "../controllers";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
const app = express();

router.post('/register',registerController.register);
router.post('/login',loginController.login)
router.get('/me',auth,userController.me)
router.post('/refresh',refreshController.refresh)
router.post('/logout',auth,loginController.logout)

router.post('/products/cart-items', productController.getProducts);

router.post('/products',[auth, admin],productController.store);
router.put('/products/:id',[auth, admin],productController.update);
router.delete('/products/:id',[auth, admin],productController.destroy);
router.get('/products',productController.index);
router.get('/products/:id',productController.show);


export default router;