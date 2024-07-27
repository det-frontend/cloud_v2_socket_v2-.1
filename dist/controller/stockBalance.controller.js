"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockBalanceAdjustHandler = exports.getStockBalanceDatePagiHandler = void 0;
const stockBalance_service_1 = require("../service/stockBalance.service");
const helper_1 = __importDefault(require("../utils/helper"));
const getStockBalanceDatePagiHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        let { data, count } = yield (0, stockBalance_service_1.findStockBalancePagiByDateService)(query, pageNo, startDate, endDate, model);
        (0, helper_1.default)(res, "Stock balance between date", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getStockBalanceDatePagiHandler = getStockBalanceDatePagiHandler;
const stockBalanceAdjustHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = req.query;
        let adjust = req.body.adjust;
        let payload = { adjust };
        let model = req.body.accessDb;
        const result = yield (0, stockBalance_service_1.findByIdAndAdjust)(query, payload, model);
        (0, helper_1.default)(res, "Adjust Success!", result, model);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.stockBalanceAdjustHandler = stockBalanceAdjustHandler;
