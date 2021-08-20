// Packages
import express from 'express';

// Controllers
import { productController } from '../controllers/index';

// Middlewares
import protect from '../middlewares/protect';

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

// Router Initialization
const router = express.Router();

router.use('/:id/reviews', reviewRoute);

// Get Top 5 Cheapeast Products Route
router.get('/top-5-cheap', top5Cheap);

// Get Product Stats Route
router.get('/product-stats', productStats);

// Get ALl Products Route
router.get('/', getAllProducts);

// Get Product Route
router.get('/:id', getProduct);

// Protect All Next Routes
router.use(protect);

// Add Product (Multer Middleware) Route
router.post('/', anyMulter(), addProduct);

// Update Product Details Route
router.patch('/:id/details', updateProductDetails);

// Update Product Main Image (Multer Middleware) Route
router.patch('/:id/main-image', anyMulter(), updateProductMainImage);

// Update Product Images (Multer Middleware) Route
router.patch('/:id/images', anyMulter(), updateProductImages);

// Delete Product Route
router.delete('/:id', deleteProduct);

export default router;
