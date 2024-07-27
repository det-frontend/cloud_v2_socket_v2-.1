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
exports.addAtgFuelInHandler = exports.getFuelInByDateHandler = exports.deleteFuelInHandler = exports.updateFuelInHandler = exports.addFuelInHandler = exports.getFuelInHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const fuelIn_service_1 = require("../service/fuelIn.service");
const getFuelInHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let pageNo = Number(req.params.page);
        let { data, count } = yield (0, fuelIn_service_1.fuelInPaginate)(pageNo, req.query, model);
        (0, helper_1.default)(res, "FuelIn are here", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getFuelInHandler = getFuelInHandler;
const addFuelInHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let result = yield (0, fuelIn_service_1.addFuelIn)(req.body, model);
        (0, helper_1.default)(res, "New FuelIn data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addFuelInHandler = addFuelInHandler;
const updateFuelInHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let result = yield (0, fuelIn_service_1.updateFuelIn)(req.query, req.body, model);
        (0, helper_1.default)(res, "updated FuelIn data", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.updateFuelInHandler = updateFuelInHandler;
const deleteFuelInHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        yield (0, fuelIn_service_1.deleteFuelIn)(req.query, model);
        (0, helper_1.default)(res, "FuelIn data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deleteFuelInHandler = deleteFuelInHandler;
const getFuelInByDateHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        let { data, count } = yield (0, fuelIn_service_1.fuelInByDate)(query, startDate, endDate, pageNo, model);
        (0, helper_1.default)(res, "fuel balance between two date", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getFuelInByDateHandler = getFuelInByDateHandler;
const addAtgFuelInHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let result = yield (0, fuelIn_service_1.addAtgFuelIn)(req.body, model);
        (0, helper_1.default)(res, "New FuelIn data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addAtgFuelInHandler = addAtgFuelInHandler;
