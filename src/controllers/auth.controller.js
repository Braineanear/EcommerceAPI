// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { authService } from '../services/index';

export const token = (req, res) => {
  const { token, secret } = req.body;

  const userId = authService.token(token, secret);

  res.status(200).json({
    userId
  });
};
