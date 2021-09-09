// Packages
import express from 'express';

// Controllers
import { favoriteController } from '../controllers';

// Middlewares
import protect from '../middlewares/protect';

const {
  addFavoriteProduct,
  getFavoriteList,
  deleteProductFromFavorite,
  checkProductInFavoriteList
} = favoriteController;

const router = express.Router();

// Add Product to Favorite List Route
// Get Product's of Favorite List Route
router
  .route('/')
  .post(protect, addFavoriteProduct)
  .get(protect, getFavoriteList);

router.delete('/:id', protect, deleteProductFromFavorite);

router.get('/check/:id', protect, checkProductInFavoriteList);

export default router;
