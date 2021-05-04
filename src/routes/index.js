import express from 'express';

import userRoute from './user.route';
import authRoute from './auth.route';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);

export default router;
