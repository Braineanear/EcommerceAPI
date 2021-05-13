import express from 'express';
import { productController } from '../controllers/index';
import auth from '../middlewares/auth';
import { anyMulter } from '../utils/multer';

const {
  getAllProducts,
  getProduct,
  addProduct,
  updateProductDetails,
  updateProductMainImage,
  updateProductImages,
  deleteProduct,
  top5Cheap,
  productStats
} = productController;

const router = express.Router();

router.get('/top-5-cheap', top5Cheap, getAllProducts);
router.get('/product-stats', productStats);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.patch('/:id/details', updateProductDetails);
router.patch('/:id/main-image', anyMulter(), updateProductMainImage);
router.patch('/:id/images', anyMulter(), updateProductImages);
router.delete('/:id', deleteProduct);

router.use(auth('admin', 'seller'));

router.route('/').post(anyMulter(), addProduct);

export default router;
