// Packages
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUI from 'swagger-ui-express';

// Configs
import config from './config/config';
import { successHandle, errorHandle } from './config/morgan';

// Middlewares
import limiter from './middlewares/rateLimiter';

// Utils
import errorHandler from './utils/errorHandler';
import AppError from './utils/appError';

// Documentation
import docs from '../docs/swagger';

// Routes
import routes from './routes/index';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.enable('trust proxy');

// Morgan Handler
app.use(successHandle);
app.use(errorHandle);

// Set security HTTP headers
app.use(helmet());

// Set Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Data sanitization against XSS
app.use(xss());

// MongoDB data sanitization
app.use(mongoSanitize());

// Implement CORS
app.use(cors());
app.options('*', cors());

app.use(compression());

app.disable('x-powered-by');

// Limit Repeated Failed Requests to Auth Endpoints
if (config.env === 'production') {
  app.use('/api', limiter);
}

// API Routes
app.use('/api', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

// When someone access route that does not exist
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handler
app.use(errorHandler);

/**
 * Exports Express
 * @public
 */
export default app;
