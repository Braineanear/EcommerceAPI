import express from 'express';
import auth from '../middlewares/auth';
import { categoryController } from '../controllers/index';
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

router.use(auth('admin'));

router.route('/').get(getAllCategories).post(singleFile('image'), addCategory);

router
  .route('/:id')
  .get(getCategory)
  .delete(deleteCategory)
  .patch(updateCategoryDetails);

router.patch('/:id/image', singleFile('image'), updateCategoryImage);

export default router;
