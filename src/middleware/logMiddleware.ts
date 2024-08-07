import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import mongoose from 'mongoose';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    logger.info(`
    ========== start ==========
    Method: ${req.method}
    URL: ${req.originalUrl}
    Headers: ${JSON.stringify(req.headers)}
    Query Parameters: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    ========== ended ==========
    `);

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`
      ========== start ==========
      Method: ${req.method}
      URL: ${req.originalUrl}
      Status: ${res.statusCode}
      Duration: ${duration}ms
      ========== ended ==========
      `);
    });

    next();
};

export const dbLogger = (req: Request, res: Response, next: NextFunction): void => {
    const exec = mongoose.Query.prototype.exec;
    mongoose.Query.prototype.exec = async function (...args) {
      const model = this.model;
      const collectionName = model.collection.collectionName;
      
      // Record the start time
      const start = process.hrtime.bigint();

      // Execute the query
      const result = await exec.apply(this, args);

      // Record the end time and calculate the duration
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1e6; // Convert to milliseconds

      logger.info(`
      ========== start ==========
      MongoDB Query: ${JSON.stringify(this.getQuery())}
      Collection: ${collectionName}
      Duration: ${duration.toFixed(2)}ms
      ========== ended ==========
      `);
      
      return result;
    };
  next();
};

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction): void => {
      logger.error(`
      ========== start ==========
      Error Message: ${err.message}
      Stack: ${err.stack}
      ========== ended ==========
      `);
      next();
};