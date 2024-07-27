"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.realTankCalculationForStockBalance = exports.fuelBalanceCalculationForStockBalance = exports.dbDistribution = exports.dBSelector = exports.fMsg2 = exports.previous = exports.checkToken = exports.createToken = exports.compass = exports.encode = void 0;
const config_1 = __importDefault(require("config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stationDetail_model_1 = require("../model/stationDetail.model");
const saltWorkFactor = config_1.default.get("saltWorkFactor");
const secretKey = config_1.default.get("secretKey");
const salt = bcryptjs_1.default.genSaltSync(saltWorkFactor);
//password checking and converting
const encode = (payload) => bcryptjs_1.default.hashSync(payload, salt);
exports.encode = encode;
const compass = (payload, dbPass) => bcryptjs_1.default.compareSync(payload, dbPass);
exports.compass = compass;
//tokenization
const createToken = (payload) => jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: "12h" });
exports.createToken = createToken;
const checkToken = (payload) => jsonwebtoken_1.default.verify(payload, secretKey);
exports.checkToken = checkToken;
//get prev date
let previous = (date = new Date()) => {
    let previousDate = new Date();
    previousDate.setDate(date.getDate() - 1);
    return previousDate.toLocaleDateString(`fr-CA`);
};
exports.previous = previous;
//for response
const fMsg = (res, msg = "all success", result = [], route = null, totalCount = null) => {
    if (totalCount != null) {
        res.status(200).json({ con: true, msg, route, result, totalCount });
    }
    else {
        res.status(200).json({ con: true, msg, result });
    }
};
const fMsg2 = (res, status = 200, msg = "all success", result = []) => {
    res.status(status).json({ con: true, msg, result });
};
exports.fMsg2 = fMsg2;
const dBSelector = (dbModel, dbOne, dbTwo) => {
    if (dbModel === "kyaw_san") {
        return dbOne;
    }
    else if (dbModel === "common") {
        return dbTwo;
    }
    else {
        throw new Error("Invalid model name");
    }
};
exports.dBSelector = dBSelector;
const dbDistribution = (ea) => {
    if (ea.accessDb === "kyaw_san") {
        return stationDetail_model_1.ksStationDetailModel;
    }
    else if (ea.accessDb === "common") {
        return stationDetail_model_1.csStationDetailModel;
    }
    else {
        return stationDetail_model_1.ksStationDetailModel;
    }
};
exports.dbDistribution = dbDistribution;
const fuelBalanceCalculationForStockBalance = (data) => {
    let ron92_opening = 0;
    let ron95_opening = 0;
    let diesel_opening = 0;
    let pDiesel_opening = 0;
    let ron92_cash = 0;
    let ron95_cash = 0;
    let diesel_cash = 0;
    let pDiesel_cash = 0;
    let ron92_balance = 0;
    let ron95_balance = 0;
    let diesel_balance = 0;
    let pDiesel_balance = 0;
    let ron92_receive = 0;
    let ron95_receive = 0;
    let diesel_receive = 0;
    let pDiesel_receive = 0;
    data.map((e) => {
        if (e.fuelType === "001-Octane Ron(92)") {
            ron92_opening += e.opening;
            ron92_cash += e.cash;
            ron92_balance += e.balance;
            ron92_receive = e.fuelIn;
        }
        if (e.fuelType === "002-Octane Ron(95)") {
            ron95_opening += e.opening;
            ron95_cash += e.cash;
            ron95_balance += e.balance;
            ron95_receive = e.fuelIn;
        }
        if (e.fuelType === "004-Diesel") {
            diesel_opening += e.opening;
            diesel_cash += e.cash;
            diesel_balance += e.balance;
            diesel_receive = e.fuelIn;
        }
        if (e.fuelType === "005-Premium Diesel") {
            pDiesel_opening += e.opening;
            pDiesel_cash += e.cash;
            pDiesel_balance += e.balance;
            pDiesel_receive = e.fuelIn;
        }
    });
    return { ron92_opening, ron95_opening, diesel_opening, pDiesel_opening, ron92_cash, ron95_cash, diesel_cash, pDiesel_cash, ron92_balance, ron95_balance, diesel_balance, pDiesel_balance, ron92_receive, ron95_receive, diesel_receive, pDiesel_receive };
};
exports.fuelBalanceCalculationForStockBalance = fuelBalanceCalculationForStockBalance;
const realTankCalculationForStockBalance = (data) => {
    let ron92 = 0;
    let ron95 = 0;
    let diesel = 0;
    let pDiesel = 0;
    data.forEach((element) => {
        if (element.oilType === "Petrol 92" || element.oilType === "001-Octane Ron(92)") {
            ron92 += element.volume;
        }
        if (element.oilType === "95 Octane" || element.oilType === "002-Octane Ron(95)") {
            ron95 += element.volume;
        }
        if (element.oilType === "Super Diesel" || element.oilType === "005-Premium Diesel") {
            pDiesel += element.volume;
        }
        if (element.oilType === "Diesel" || element.oilType === " 004-Diesel") {
            diesel += element.volume;
        }
    });
    return { ron92, ron95, diesel, pDiesel };
};
exports.realTankCalculationForStockBalance = realTankCalculationForStockBalance;
exports.default = fMsg;
