import winston, { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const dailyRotate = new (transports as any).DailyRotateFile({
  dirname: 'logs',
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

export const logger: winston.Logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({ format: format.simple() }),
    dailyRotate,
  ],
});
