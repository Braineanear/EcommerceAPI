import express from 'express';

// Middlewares

// Controllers
import { cartController } from '../controllers/index';

const {
  addItemToCart,
  subtractItemFromCart,
  reduceByOne,
  increaseByOne,
  getCart,
  deleteCart,
  deleteItem
} = cartController;

const router = express.Router();


router.post('/', addItemToCart);
router.patch('/', subtractItemFromCart);
router.get('/', getCart);
router.delete('/', deleteCart);
router.patch('/reduce-one', reduceByOne);
router.patch('/increase-one', increaseByOne);
router.delete('/:productId', deleteItem);
export default router;
