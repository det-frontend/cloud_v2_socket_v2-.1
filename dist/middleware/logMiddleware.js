"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.dbLogger = exports.requestLogger = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const requestLogger = (req, res, next) => {
    const start = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
    logger_1.default.info(`
    ========== start ==========
    Method: ${req.method}
    URL: ${req.originalUrl}
    Headers: ${JSON.stringify(req.headers)}
    Query Parameters: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    ========== ended ==========
    `);
    res.on('finish', () => {
        const duration = (0, moment_1.default)().diff(start, 'milliseconds');
        logger_1.default.info(`
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
exports.requestLogger = requestLogger;
const dbLogger = (req, res, next) => {
    const exec = mongoose_1.default.Query.prototype.exec;
    mongoose_1.default.Query.prototype.exec = async function (...args) {
        const model = this.model;
        const collectionName = model.collection.collectionName;
        // Record the start time
        const start = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        // Record the end time and calculate the duration
        const end = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        // Execute the query
        const result = await exec.apply(this, args);
        // Convert to milliseconds
        const duration = (0, moment_1.default)(end, 'YYYY-MM-DD HH:mm:ss').diff((0, moment_1.default)(start, 'YYYY-MM-DD HH:mm:ss'), 'milliseconds');
        logger_1.default.info(`
      ========== start ==========
      MongoDB Query: ${JSON.stringify(this.getQuery())}
      Collection: ${collectionName}
      Duration: ${duration}ms
      ========== ended ==========
      `);
        return result;
    };
    next();
};
exports.dbLogger = dbLogger;
const errorLogger = (err, req, res, next) => {
    logger_1.default.error(`
      ========== start ==========
      Error Message: ${err.message}
      Stack: ${err.stack}
      ========== ended ==========
      `);
    next();
};
exports.errorLogger = errorLogger;
