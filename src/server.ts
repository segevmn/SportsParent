import mongoose from 'mongoose';

import { logger } from './utils/logger';
import { getEnv } from './config/env';
import app from './app';

const NODE_ENV = getEnv('NODE_ENV', 'development');
const MONGO_URI = getEnv('MONGO_URI');
const PORT = getEnv('PORT', '3000');

const PortNumber = Number.parseInt(PORT, 10);
if (Number.isNaN(PortNumber)) {
  logger.error(`Invalid PORT: ${PORT}`);
  process.exit(1);
}

if (!MONGO_URI) {
  logger.error('MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info('MongoDB connected successfully');
    const server = app.listen(PortNumber, () => {
      logger.info(
        `Server is running on http://localhost:${PortNumber} in ${NODE_ENV} mode`,
      );
    });
    server.on('error', e => {
      logger.error('HTTP listen error:', e);
      process.exit(1);
    });
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });
