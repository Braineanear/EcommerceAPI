// Packages
import express from 'express';

// Controllers
import { orderController } from '../controllers/index';

// Middlewares
import protect from '../middlewares/protect';

const { createOrder, getAllOrders, getOrder, cancelOrder } = orderController;

// Router Initialization
const router = express.Router();

// Protect All Routes
router.use(protect);

// Get All Orders Route
// Create Order Route
router.route('/').get(getAllOrders).post(createOrder);

// Get Order Route
// Cancel Order Route
router.route('/:id').get(getOrder).delete(cancelOrder);

export default router;
