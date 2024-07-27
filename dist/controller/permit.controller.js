"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletPermitHandler = exports.addPermitHandler = exports.getPermitHandler = void 0;
const permit_service_1 = require("../service/permit.service");
const helper_1 = __importDefault(require("../utils/helper"));
const getPermitHandler = async (req, res, next) => {
    try {
        let result = await (0, permit_service_1.getPermit)(req.query);
        (0, helper_1.default)(res, "Permit are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getPermitHandler = getPermitHandler;
const addPermitHandler = async (req, res, next) => {
    try {
        let result = await (0, permit_service_1.addPermit)(req.body);
        (0, helper_1.default)(res, "New permit was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addPermitHandler = addPermitHandler;
const deletPermitHandler = async (req, res, next) => {
    try {
        await (0, permit_service_1.deletePermit)(req.query);
        (0, helper_1.default)(res, "Permit was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deletPermitHandler = deletPermitHandler;
