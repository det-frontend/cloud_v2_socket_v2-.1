"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCoustomerHandler = exports.deletCoustomerHandler = exports.addCoustomerHandler = exports.getCoustomerHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const coustomer_service_1 = require("../service/coustomer.service");
const getCoustomerHandler = async (req, res, next) => {
    try {
        let result = await (0, coustomer_service_1.getCoustomer)(req.query);
        (0, helper_1.default)(res, "Coustomer are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getCoustomerHandler = getCoustomerHandler;
const addCoustomerHandler = async (req, res, next) => {
    try {
        let result = await (0, coustomer_service_1.addCoustomer)(req.body);
        (0, helper_1.default)(res, "New Coustomer was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addCoustomerHandler = addCoustomerHandler;
const deletCoustomerHandler = async (req, res, next) => {
    try {
        await (0, coustomer_service_1.deleteCoustomer)(req.query);
        (0, helper_1.default)(res, "Coustomer was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deletCoustomerHandler = deletCoustomerHandler;
const searchCoustomerHandler = async (req, res, next) => {
    try {
        let result = await (0, coustomer_service_1.searchCoustomer)(req.query);
        (0, helper_1.default)(res, "search result", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.searchCoustomerHandler = searchCoustomerHandler;
