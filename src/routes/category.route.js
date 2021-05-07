import express from 'express';
import auth from '../middlewares/auth';
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

router
  .route('/')
  .get(getAllCategories)
  .post(auth('admin'), singleFile('image'), addCategory);

router
  .route('/:id')
  .get(getCategory)
  .patch(auth('admin'), singleFile('image'), updateCategory)
  .delete(auth('admin'), deleteCategory);

export default router;
