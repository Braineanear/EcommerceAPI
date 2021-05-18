import express from 'express';

// Middlewares
import auth from '../middlewares/auth';

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

router.use(auth('user', 'admin', 'seller'));

router.post('/', addItemToCart);
router.patch('/', subtractItemFromCart);
router.get('/', getCart);
router.delete('/', deleteCart);
router.patch('/reduce-one', reduceByOne);
router.patch('/increase-one', increaseByOne);
router.delete('/:productId', deleteItem);
export default router;
