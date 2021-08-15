import express from 'express';

// Controllers
import { orderController } from '../controllers/index';

// Middlewares

const { createOrder, getAllOrders, getOrder, cancelOrder } = orderController;

const router = express.Router();


router.route('/').post(createOrder).get(getAllOrders);

router.route('/:id').get(getOrder).delete(cancelOrder);

export default router;
