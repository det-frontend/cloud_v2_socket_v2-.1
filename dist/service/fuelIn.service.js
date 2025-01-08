"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAtgFuelIn = exports.fuelInWithoutByDate = exports.fuelInByDate = exports.deleteFuelIn = exports.updateFuelIn = exports.addFuelIn = exports.fuelInPaginate = exports.getFuelIn = void 0;
const fuelIn_model_1 = require("../model/fuelIn.model");
const fuelBalance_service_1 = require("./fuelBalance.service");
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
const limitNo = config_1.default.get("page_limit");
const getFuelIn = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        return await selectedModel
            .find(query)
            .lean({ virtuals: true })
            .populate({
            path: "stationId",
            model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
        })
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getFuelIn = getFuelIn;
const fuelInPaginate = async (pageNo, query, dbModel) => {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
    const data = await selectedModel
        .find(query)
        .sort({ createAt: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .lean({ virtuals: true })
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = await selectedModel.countDocuments(query);
    return { count, data };
};
exports.fuelInPaginate = fuelInPaginate;
const addFuelIn = async (body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        let no = await selectedModel.count();
        let tankCondition = await (0, fuelBalance_service_1.getFuelBalance)({
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
        const updatedBody = {
            ...body,
            stationId: body.stationDetailId,
            fuel_in_code: no + 1,
            tank_balance: tankCondition[0].balance,
        };
        // console.log(updatedBody, "???????????????????????????????????????????????");
        let result = await new selectedModel(updatedBody).save();
        await (0, fuelBalance_service_1.updateFuelBalance)({ _id: tankCondition[0]._id }, { fuelIn: body.receive_balance }, dbModel);
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addFuelIn = addFuelIn;
const updateFuelIn = async (query, body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        await selectedModel.updateMany(query, body);
        return await selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateFuelIn = updateFuelIn;
const deleteFuelIn = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        let FuelIn = await selectedModel.find(query);
        if (!FuelIn) {
            throw new Error("No FuelIn with that id");
        }
        return await selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteFuelIn = deleteFuelIn;
const fuelInByDate = async (query, d1, d2, pageNo, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter = {
        ...query,
        createAt: {
            $gt: d1,
            $lt: d2,
        },
    };
    const data = await selectedModel
        .find(filter)
        .sort({ createAt: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .lean({ virtuals: true })
        .select("-__v");
    const count = await selectedModel.countDocuments(filter);
    return { data, count };
};
exports.fuelInByDate = fuelInByDate;
const fuelInWithoutByDate = async (query, d1, d2, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
    const filter = {
        ...query,
        createAt: {
            $gt: d1,
            $lt: d2,
        },
    };
    // Fetch all data without skip and limit (no pagination)
    const data = await selectedModel
        .find(filter)
        .sort({ createAt: -1 })
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .lean({ virtuals: true })
        .select("-__v");
    const count = await selectedModel.countDocuments(filter);
    return { data, count };
};
exports.fuelInWithoutByDate = fuelInWithoutByDate;
const addAtgFuelIn = async (body, dbModel) => {
    console.log(body);
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, fuelIn_model_1.ksFuelInModel, fuelIn_model_1.csFuelInModel);
        let result = await new selectedModel(body).save();
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addAtgFuelIn = addAtgFuelIn;
