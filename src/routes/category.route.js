import express from 'express';
import { categoryController } from '../controllers/index';
import { singleFile } from '../utils/multer';

const {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory
} = categoryController;

const router = express.Router();

router.route('/').get(getAllCategories).post(singleFile('image'), addCategory);

router
  .route('/:id')
  .get(getCategory)
  .patch(singleFile('image'), updateCategory)
  .delete(deleteCategory);

export default router;
