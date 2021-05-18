import express from 'express';

// Controllers
import { orderController } from '../controllers/index';

// Middlewares
import auth from '../middlewares/auth';

const { createOrder, getAllOrders, getOrder, cancelOrder } = orderController;

const router = express.Router();

router.use(auth('user', 'admin', 'seller'));

router.route('/').post(createOrder).get(getAllOrders);

router.route('/:id').get(getOrder).delete(cancelOrder);

export default router;
