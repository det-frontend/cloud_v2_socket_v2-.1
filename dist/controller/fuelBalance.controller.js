"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFuelBalanceByDateHandler = exports.deleteFuelBalanceHandler = exports.updateFuelBalanceHandler = exports.addFuelBalanceHandler = exports.getFuelBalanceHandler = exports.getAllFuelBalanceHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fuelBalance_service_1 = require("../service/fuelBalance.service");
const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
const getAllFuelBalanceHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, fuelBalance_service_1.getFuelBalance)(req.query, model);
        (0, helper_1.default)(res, "FuelIn are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getAllFuelBalanceHandler = getAllFuelBalanceHandler;
const getFuelBalanceHandler = async (req, res, next) => {
    try {
        let pageNo = Number(req.params.page);
        let sDate = req.query.sDate?.toString();
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
        let { count, data } = await (0, fuelBalance_service_1.fuelBalancePaginate)(pageNo, {
            ...query,
            createAt: sDate,
        }, model);
        (0, helper_1.default)(res, "fuelBalance find", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getFuelBalanceHandler = getFuelBalanceHandler;
const addFuelBalanceHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, fuelBalance_service_1.addFuelBalance)(req.body, model);
        (0, helper_1.default)(res, "New fuelBalance data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addFuelBalanceHandler = addFuelBalanceHandler;
const updateFuelBalanceHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, fuelBalance_service_1.updateFuelBalance)(req.query, req.body, model);
        (0, helper_1.default)(res, "updated fuelBalance data", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.updateFuelBalanceHandler = updateFuelBalanceHandler;
const deleteFuelBalanceHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        await (0, fuelBalance_service_1.deleteFuelBalance)(req.query, model);
        (0, helper_1.default)(res, "fuelBalance data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deleteFuelBalanceHandler = deleteFuelBalanceHandler;
const getFuelBalanceByDateHandler = async (req, res, next) => {
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
        let result = await (0, fuelBalance_service_1.fuelBalanceByDate)(query, startDate, endDate, model);
        (0, helper_1.default)(res, "fuel balance between two date", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getFuelBalanceByDateHandler = getFuelBalanceByDateHandler;
