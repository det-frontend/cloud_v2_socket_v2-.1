"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf } = winston_1.format;
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), logFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: path_1.default.join(__dirname, '../../logs/combined.log'), level: 'info' }),
        new winston_1.transports.File({ filename: path_1.default.join(__dirname, '../../logs/error.log'), level: 'error' }),
        new winston_1.transports.File({ filename: path_1.default.join(__dirname, '../../logs/detailsale.log'), level: 'warn' }),
    ]
});
exports.default = logger;
