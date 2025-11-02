import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import bodyParser from 'body-parser';
import errorHandlerDev from 'errorhandler';

import { logger } from './utils/logger';
import { getEnv } from './config/env';
import apiRoutes from './routes/index';
import { errorHandler } from './middleware/errorHandler';

const NODE_ENV = getEnv('NODE_ENV', 'development');
const CORS_WHITELIST = getEnv('CORS_WHITELIST', '');

const app = express();
app.use(cookieParser());
app.use(compression({ threshold: 100 * 1024 }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Send RateLimit headers
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

app.use(
  morgan(NODE_ENV === 'development' ? 'dev' : 'combined', {
    stream: { write: msg => logger.info(msg.trim()) },
  }),
);

if (!CORS_WHITELIST) {
  logger.error('CORS_WHITELIST is not defined in the environment variables.');
  process.exit(1);
}

const whitelist = CORS_WHITELIST === '*' ? true : CORS_WHITELIST.split(',');

interface CorsOptions {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => void;
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
}

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ): void {
    if (whitelist === true || !origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(apiRoutes);

app.use(errorHandler);

if (NODE_ENV === 'development') {
  app.use(errorHandlerDev());
}

export default app;
