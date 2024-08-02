"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAtgFuelInHandler = exports.getFuelInByDateHandler = exports.deleteFuelInHandler = exports.updateFuelInHandler = exports.addFuelInHandler = exports.getFuelInHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const fuelIn_service_1 = require("../service/fuelIn.service");
const getFuelInHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let pageNo = Number(req.params.page);
        let { data, count } = await (0, fuelIn_service_1.fuelInPaginate)(pageNo, req.query, model);
        (0, helper_1.default)(res, "FuelIn are here", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getFuelInHandler = getFuelInHandler;
const addFuelInHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, fuelIn_service_1.addFuelIn)(req.body, model);
        (0, helper_1.default)(res, "New FuelIn data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addFuelInHandler = addFuelInHandler;
const updateFuelInHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, fuelIn_service_1.updateFuelIn)(req.query, req.body, model);
        (0, helper_1.default)(res, "updated FuelIn data", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.updateFuelInHandler = updateFuelInHandler;
const deleteFuelInHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        await (0, fuelIn_service_1.deleteFuelIn)(req.query, model);
        (0, helper_1.default)(res, "FuelIn data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deleteFuelInHandler = deleteFuelInHandler;
const getFuelInByDateHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        let pageNo = Number(req.params.page);
        delete req.query.sDate;
        delete req.query.eDate;
        let query = req.query;
        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }
        //if date error ? you should use split with T or be sure detail Id
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        delete req.query.accessDb;
        let { data, count } = await (0, fuelIn_service_1.fuelInByDate)(query, startDate, endDate, pageNo, model);
        (0, helper_1.default)(res, "fuel balance between two date", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getFuelInByDateHandler = getFuelInByDateHandler;
const addAtgFuelInHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, fuelIn_service_1.addAtgFuelIn)(req.body, model);
        (0, helper_1.default)(res, "New FuelIn data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addAtgFuelInHandler = addAtgFuelInHandler;
