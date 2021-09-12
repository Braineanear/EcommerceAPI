// Packages
import express from 'express';

// Controllers
import { discountController } from '../controllers';

// Middlewares
import protect from '../middlewares/protect';
import restrictedTo from '../middlewares/restrictedTo';

const {
  verifyDiscountCode,
  getAllDiscountCodes,
  generateDiscountCode,
  deleteDiscountCode,
  cancelDiscountCode
} = discountController;

const router = express.Router();

router.use(protect);

router.post('/verify', verifyDiscountCode);

router.delete('/cancel', cancelDiscountCode);

router.use(restrictedTo('admin'));

router.get('/', getAllDiscountCodes);

router.post('/generate', generateDiscountCode);

router.delete('/:id', deleteDiscountCode);

export default router;
