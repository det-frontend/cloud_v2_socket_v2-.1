"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCasherCodeHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const casherCode_service_1 = require("../service/casherCode.service");
const getAllCasherCodeHandler = async (req, res, next) => {
    try {
        let query = req.query.key;
        if (!query)
            throw new Error("You need filter key");
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let { data, count } = await (0, casherCode_service_1.getAllCasherCodeService)(query, model);
        (0, helper_1.default)(res, "Casher codes are here", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getAllCasherCodeHandler = getAllCasherCodeHandler;
