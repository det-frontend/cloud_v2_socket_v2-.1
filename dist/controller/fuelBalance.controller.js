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
exports.getFuelBalanceByDateHandler = exports.deleteFuelBalanceHandler = exports.updateFuelBalanceHandler = exports.addFuelBalanceHandler = exports.getFuelBalanceHandler = exports.getAllFuelBalanceHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fuelBalance_service_1 = require("../service/fuelBalance.service");
const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
const getAllFuelBalanceHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let result = yield (0, fuelBalance_service_1.getFuelBalance)(req.query, model);
        (0, helper_1.default)(res, "FuelIn are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getAllFuelBalanceHandler = getAllFuelBalanceHandler;
const getFuelBalanceHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let pageNo = Number(req.params.page);
        let sDate = (_a = req.query.sDate) === null || _a === void 0 ? void 0 : _a.toString();
        delete req.query.sDate;
        delete req.query.eDate;
        let query = req.query;
        if (!sDate) {
            throw new Error("you need date");
        }
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let { count, data } = yield (0, fuelBalance_service_1.fuelBalancePaginate)(pageNo, Object.assign(Object.assign({}, query), { createAt: sDate }), model);
        (0, helper_1.default)(res, "fuelBalance find", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getFuelBalanceHandler = getFuelBalanceHandler;
const addFuelBalanceHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let result = yield (0, fuelBalance_service_1.addFuelBalance)(req.body, model);
        (0, helper_1.default)(res, "New fuelBalance data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addFuelBalanceHandler = addFuelBalanceHandler;
const updateFuelBalanceHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let result = yield (0, fuelBalance_service_1.updateFuelBalance)(req.query, req.body, model);
        (0, helper_1.default)(res, "updated fuelBalance data", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.updateFuelBalanceHandler = updateFuelBalanceHandler;
const deleteFuelBalanceHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        yield (0, fuelBalance_service_1.deleteFuelBalance)(req.query, model);
        (0, helper_1.default)(res, "fuelBalance data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deleteFuelBalanceHandler = deleteFuelBalanceHandler;
const getFuelBalanceByDateHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        let query = req.query;
        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let result = yield (0, fuelBalance_service_1.fuelBalanceByDate)(query, startDate, endDate, model);
        (0, helper_1.default)(res, "fuel balance between two date", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getFuelBalanceByDateHandler = getFuelBalanceByDateHandler;
