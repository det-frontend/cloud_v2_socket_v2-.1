"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockBalanceAdjustHandler = exports.getStockBalanceDatePagiHandler = void 0;
const stockBalance_service_1 = require("../service/stockBalance.service");
const helper_1 = __importDefault(require("../utils/helper"));
const getStockBalanceDatePagiHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        let pageNo = Number(req.params.page);
        delete req.query.sDate;
        delete req.query.eDate;
        let query = req.query;
        if (!sDate) {
            throw new Error("You need Date!");
        }
        if (!eDate) {
            eDate = new Date();
        }
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        delete req.query.accessDb;
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let { data, count } = await (0, stockBalance_service_1.findStockBalancePagiByDateService)(query, pageNo, startDate, endDate, model);
        (0, helper_1.default)(res, "Stock balance between date", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getStockBalanceDatePagiHandler = getStockBalanceDatePagiHandler;
const stockBalanceAdjustHandler = async (req, res, next) => {
    try {
        let query = req.query;
        let adjust = req.body.adjust;
        let payload = { adjust };
        let model = req.body.accessDb;
        const result = await (0, stockBalance_service_1.findByIdAndAdjust)(query, payload, model);
        (0, helper_1.default)(res, "Adjust Success!", result, model);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.stockBalanceAdjustHandler = stockBalanceAdjustHandler;
