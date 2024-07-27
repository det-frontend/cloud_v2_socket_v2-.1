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
exports.addAtgFuelIn = exports.fuelInByDate = exports.deleteFuelIn = exports.updateFuelIn = exports.addFuelIn = exports.fuelInPaginate = exports.getFuelIn = void 0;
const fuelIn_model_1 = require("../model/fuelIn.model");
const fuelBalance_service_1 = require("./fuelBalance.service");
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
const limitNo = config_1.default.get("page_limit");
const getFuelIn = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        return yield selectedModel
            .find(query)
            .lean()
            .populate({
            path: "stationId",
            model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
        })
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getFuelIn = getFuelIn;
const fuelInPaginate = (pageNo, query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
    const data = yield selectedModel
        .find(query)
        .sort({ createAt: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .lean()
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = yield selectedModel.countDocuments(query);
    return { count, data };
});
exports.fuelInPaginate = fuelInPaginate;
const addFuelIn = (body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        let no = yield selectedModel.count();
        let tankCondition = yield (0, fuelBalance_service_1.getFuelBalance)({
            stationId: body.stationDetailId,
            fuelType: body.fuel_type,
            tankNo: body.tankNo,
            createAt: body.receive_date,
        }, dbModel);
        // console.log(body, tankCondition, {
        //   stationId: body.stationDetailId,
        //   fuelType: body.fuel_type,
        //   tankNo: body.tankNo,
        //   createAt: body.receive_date,
        // });
        const updatedBody = Object.assign(Object.assign({}, body), { stationId: body.stationDetailId, fuel_in_code: no + 1, tank_balance: tankCondition[0].balance });
        // console.log(updatedBody, "???????????????????????????????????????????????");
        let result = yield new selectedModel(updatedBody).save();
        yield (0, fuelBalance_service_1.updateFuelBalance)({ _id: tankCondition[0]._id }, { fuelIn: body.receive_balance }, dbModel);
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.addFuelIn = addFuelIn;
const updateFuelIn = (query, body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        yield selectedModel.updateMany(query, body);
        return yield selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateFuelIn = updateFuelIn;
const deleteFuelIn = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        let FuelIn = yield selectedModel.find(query);
        if (!FuelIn) {
            throw new Error("No FuelIn with that id");
        }
        return yield selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteFuelIn = deleteFuelIn;
const fuelInByDate = (query, d1, d2, pageNo, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter = Object.assign(Object.assign({}, query), { createAt: {
            $gt: d1,
            $lt: d2,
        } });
    const data = yield selectedModel
        .find(filter)
        .sort({ createAt: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = yield selectedModel.countDocuments(filter);
    return { data, count };
});
exports.fuelInByDate = fuelInByDate;
const addAtgFuelIn = (body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(body);
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        let result = yield new selectedModel(body).save();
        return result;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.addAtgFuelIn = addAtgFuelIn;
