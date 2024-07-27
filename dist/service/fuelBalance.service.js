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
exports.fuelBalanceForStockBalance = exports.fuelBalanceByDate = exports.fuelBalancePaginate = exports.calcFuelBalance = exports.deleteFuelBalance = exports.updateFuelBalance = exports.addFuelBalance = exports.getFuelBalance = void 0;
const fuelBalance_model_1 = require("../model/fuelBalance.model");
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getFuelBalance = (query, dbModel, tankCount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        const result = yield selectedModel
            .find(query)
            .sort({ $natural: -1 })
            .limit(Number(tankCount))
            .lean()
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
});
exports.getFuelBalance = getFuelBalance;
const addFuelBalance = (body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
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
        return yield new selectedModel(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.addFuelBalance = addFuelBalance;
const updateFuelBalance = (query, body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        yield selectedModel.updateMany(query, body);
        return yield selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateFuelBalance = updateFuelBalance;
const deleteFuelBalance = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        let fuelBalance = yield selectedModel.find(query);
        if (!fuelBalance) {
            new Error("No fuelBalance with that id");
        }
        return yield selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteFuelBalance = deleteFuelBalance;
const calcFuelBalance = (query, body, payload, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
        let result = yield selectedModel.find(query);
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
        yield selectedModel.updateMany({ _id: gg === null || gg === void 0 ? void 0 : gg._id }, obj);
        return yield selectedModel.find({ _id: gg === null || gg === void 0 ? void 0 : gg._id }).lean();
    }
    catch (e) {
        throw new Error(e); // Rethrow the error with the actual error message
    }
});
exports.calcFuelBalance = calcFuelBalance;
const fuelBalancePaginate = (pageNo, query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
    const data = yield selectedModel
        .find(query)
        .sort({ realTime: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .lean()
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = yield selectedModel.countDocuments(query);
    return { data, count };
});
exports.fuelBalancePaginate = fuelBalancePaginate;
const fuelBalanceByDate = (query, d1, d2, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = Object.assign(Object.assign({}, query), { realTime: {
            $gt: d1,
            $lt: d2,
        } });
    // console.log("====================================");
    // console.log(d1, d2);
    // console.log("====================================");
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
    // console.log(filter);
    return yield selectedModel
        .find(filter)
        .sort({ realTime: -1 })
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
});
exports.fuelBalanceByDate = fuelBalanceByDate;
const fuelBalanceForStockBalance = (d1, id, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        createAt: d1,
        stationId: id,
    };
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelBalance_model_1.ksFuelBalanceModel, fuelBalance_model_1.csFuelBalanceModel);
    return yield selectedModel
        .find(filter)
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
});
exports.fuelBalanceForStockBalance = fuelBalanceForStockBalance;
