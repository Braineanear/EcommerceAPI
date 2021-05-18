import express from 'express';

// Controllers
import { productController } from '../controllers/index';

// Middlewares
import auth from '../middlewares/auth';

// Utils
import { anyMulter } from '../utils/multer';

// Routes
import reviewRoute from './review.route';

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

router.use('/:id/reviews', reviewRoute);

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.get('/top-5-cheap', top5Cheap, getAllProducts);
router.get('/product-stats', productStats);

router.use(auth('admin', 'seller'));

router.post('/', anyMulter(), addProduct);
router.patch('/:id/details', updateProductDetails);
router.patch('/:id/main-image', anyMulter(), updateProductMainImage);
router.patch('/:id/images', anyMulter(), updateProductImages);
router.delete('/:id', deleteProduct);

export default router;
