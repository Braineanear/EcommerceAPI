// Packages
import express from 'express';

// Controllers
import { authController } from '../controllers/index';

const { token } = authController;

const router = express.Router();

router.post('/token', token);

export default router;
