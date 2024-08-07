import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import mongoose from 'mongoose';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  logger.info(`${req.method} ${req.originalUrl}`);
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
