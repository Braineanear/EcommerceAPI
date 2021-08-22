// Packages
import express from 'express';

// Middlewares
import protect from '../middlewares/protect';

// Controllers
import { cartController } from '../controllers/index';

const {
  addItemToCart,
  reduceByOne,
  increaseByOne,
  getCart,
  deleteCart,
  deleteItem
} = cartController;

// Router Initialization
const router = express.Router();

// Protect All Routes
router.use(protect);

// Get Cart Route
// Add Item To Cart Route
// Subtract Item From Cart Route
// Delete Cart Route
router.route('/').get(getCart).post(addItemToCart).delete(deleteCart);

// Reduce One Route
router.patch('/reduce-one', reduceByOne);

// Increase One Route
router.patch('/increase-one', increaseByOne);

// Delete Product Route
router.delete('/:productId', deleteItem);

export default router;
