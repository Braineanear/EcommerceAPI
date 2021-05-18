import express from 'express';

import userRoute from './user.route';
import authRoute from './auth.route';
import productRoute from './product.route';
import categoryRoute from './category.route';
import cartRoute from './cart.route';
import orderRoute from './order.route';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/product', productRoute);
router.use('/category', categoryRoute);
router.use('/cart', cartRoute);
router.use('/order', orderRoute);

export default router;
