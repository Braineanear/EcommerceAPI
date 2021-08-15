// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { authService } from '../services/index';

export const token = catchAsync(async (req, res) => {
  const { token, secret } = req.body;

  const data = await authService.token(token, secret);

  res.status(200).json({
    data
  });
});
