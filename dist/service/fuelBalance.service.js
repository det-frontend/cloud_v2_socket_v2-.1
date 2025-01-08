"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuelBalanceForStockBalance = exports.fuelBalanceByDate = exports.fuelBalanceWithoutPagi = exports.fuelBalancePaginate = exports.calcFuelBalance = exports.deleteFuelBalance = exports.updateFuelBalance = exports.addFuelBalance = exports.getFuelBalance = void 0;
const fuelBalance_model_1 = require("../model/fuelBalance.model");
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getFuelBalance = async (query, dbModel, tankCount) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        const result = await selectedModel
            .find(query)
            .sort({ $natural: -1 })
            .limit(Number(tankCount))
            .lean({ virtuals: true })
            // .populate({
            //   path: "stationId",
            //   model: dbDistribution({ accessDb: dbModel }),
            // })
            .select("-__v");
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getFuelBalance = getFuelBalance;
const addFuelBalance = async (body, dbModel) => {
    try {
        const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
        const options = { timeZone: "Asia/Yangon", hour12: false };
        let currentDateTime = new Date().toLocaleTimeString("en-US", options);
        const [hour, minute, second] = currentDateTime.split(":").map(Number);
        if (hour == 24) {
            currentDateTime = `00:${minute}:${second}`;
        }
        let iso = new Date(`${currentDate}T${currentDateTime}.000Z`);
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        if (!body.accessDb)
            body.accessDb = dbModel;
        body.realTime = iso;
        return await new selectedModel(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addFuelBalance = addFuelBalance;
const updateFuelBalance = async (query, body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        await selectedModel.updateMany(query, body);
        return await selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateFuelBalance = updateFuelBalance;
const deleteFuelBalance = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        let fuelBalance = await selectedModel.find(query);
        if (!fuelBalance) {
            new Error("No fuelBalance with that id");
        }
        return await selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteFuelBalance = deleteFuelBalance;
const calcFuelBalance = async (query, body, payload, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        let result = await selectedModel.find(query);
        if (result.length == 0) {
            new Error("No fuel balance data found for the given query.");
        }
        let gg = result.find((ea) => ea.nozzles.includes(payload.toString()));
        if (!gg) {
            new Error("No tank with the provided nozzle found.");
        }
        if (typeof body.liter !== "number" || isNaN(body.liter)) {
            new Error("Invalid 'liter' value. It must be a valid number.");
        }
        let cashLiter = gg.cash + body.liter;
        let obj = {
            cash: cashLiter,
            balance: gg.opening + gg.fuelIn - cashLiter,
        };
        await selectedModel.updateMany({ _id: gg?._id }, obj);
        return await selectedModel.find({ _id: gg?._id }).lean({ virtuals: true });
    }
    catch (e) {
        throw new Error(e); // Rethrow the error with the actual error message
    }
};
exports.calcFuelBalance = calcFuelBalance;
const fuelBalancePaginate = async (pageNo, query, dbModel) => {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
    const data = await selectedModel
        .find(query)
        .sort({ realTime: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .lean({ virtuals: true })
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = await selectedModel.countDocuments(query);
    return { data, count };
};
exports.fuelBalancePaginate = fuelBalancePaginate;
const fuelBalanceWithoutPagi = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
    // Fetch all data without skip and limit (no pagination)
    const data = await selectedModel
        .find(query)
        .sort({ realTime: -1 })
        .lean({ virtuals: true })
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = await selectedModel.countDocuments(query);
    return { data, count };
};
exports.fuelBalanceWithoutPagi = fuelBalanceWithoutPagi;
const fuelBalanceByDate = async (query, d1, d2, dbModel) => {
    const filter = {
        ...query,
        realTime: {
            $gt: d1,
            $lt: d2,
        },
    };
    // console.log("====================================");
    // console.log(d1, d2);
    // console.log("====================================");
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
    // console.log(filter);
    return await selectedModel
        .find(filter)
        .sort({ realTime: -1 })
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .lean({ virtuals: true })
        .select("-__v");
};
exports.fuelBalanceByDate = fuelBalanceByDate;
const fuelBalanceForStockBalance = async (d1, id, dbModel) => {
    const filter = {
        createAt: d1,
        stationId: id,
    };
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
    return await selectedModel
        .find(filter)
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .lean({ virtuals: true })
        .select("-__v");
};
exports.fuelBalanceForStockBalance = fuelBalanceForStockBalance;
