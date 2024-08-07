import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
    new transports.File({ filename: path.join(__dirname, '../../logs/errors.log'), level: 'error' })
  ]
});

export default logger;
