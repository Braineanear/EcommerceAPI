import express from 'express';
import { productController } from '../controllers/index';
import auth from '../middlewares/auth';
import { anyMulter } from '../utils/multer';

const { getAllProducts, addProduct } = productController;

const router = express.Router();

router.get('/', getAllProducts);

router.use(auth('admin', 'seller'));

router.route('/').post(anyMulter(), addProduct);

export default router;
