import express from 'express';

// Controllers
import { orderController } from '../controllers/index';

// Middlewares
import auth from '../middlewares/auth';

const { createOrder, getAllOrders, getOrder, cancelOrder } = orderController;

const router = express.Router();

router.post('/', auth('user', 'admin', 'seller'), createOrder);
router.get('/', auth('user', 'admin', 'seller'), getAllOrders);

router.get('/:id', auth('user', 'admin', 'seller'), getOrder);
router.delete('/:id', auth('user', 'admin', 'seller'), cancelOrder);

export default router;
