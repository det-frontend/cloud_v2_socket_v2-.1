"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbLogger = exports.requestLogger = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const requestLogger = (req, res, next) => {
    logger_1.default.info(`${req.method} ${req.originalUrl}`);
    next();
};
exports.requestLogger = requestLogger;
const dbLogger = (req, res, next) => {
    const exec = mongoose_1.default.Query.prototype.exec;
    mongoose_1.default.Query.prototype.exec = async function (...args) {
        const model = this.model;
        const collectionName = model.collection.collectionName;
        // Record the start time
        const start = process.hrtime.bigint();
        // Execute the query
        const result = await exec.apply(this, args);
        // Record the end time and calculate the duration
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1e6; // Convert to milliseconds
        logger_1.default.info(`
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
exports.dbLogger = dbLogger;
