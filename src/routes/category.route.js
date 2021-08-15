import express from 'express';

// Middlewares

// Controllers
import { categoryController } from '../controllers/index';

// Utils
import { singleFile } from '../utils/multer';

const {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategory
} = categoryController;

const router = express.Router();

router.route('/').get(getAllCategories).post(singleFile('image'), addCategory);

router
  .route('/:id')
  .get(getCategory)
  .delete(deleteCategory)
  .patch(updateCategoryDetails);

router.patch('/:id/image', singleFile('image'), updateCategoryImage);

export default router;
