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
        logger.info(`MongoDB Query: ${JSON.stringify(this.getQuery())} - Collection: ${collectionName}`);
        return exec.apply(this, args);
    };
  next();
};
