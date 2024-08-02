"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailSaleByDateAndPagi = exports.deleteDebt = exports.updateDebt = exports.countDebt = exports.addDebt = exports.DebtPaginate = exports.getDebt = void 0;
const config_1 = __importDefault(require("config"));
const debt_model_1 = __importDefault(require("../model/debt.model"));
const coustomer_service_1 = require("./coustomer.service");
const getDebt = async (query) => {
    try {
        return await debt_model_1.default
            .find(query)
            .populate("couObjId")
            .lean()
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getDebt = getDebt;
const DebtPaginate = async (pageNo, query) => {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const data = await debt_model_1.default
        .find(query)
        .populate("couObjId")
        .skip(skipCount)
        .limit(limitNo)
        .lean()
        .select("-__v");
    const count = await debt_model_1.default.countDocuments(query);
    return { data, count };
};
exports.DebtPaginate = DebtPaginate;
const addDebt = async (body) => {
    try {
        let coustomerConditon = await (0, coustomer_service_1.getCoustomerById)(body.couObjId);
        if (!coustomerConditon)
            throw new Error("There is no coustomer with that name");
        return await new debt_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addDebt = addDebt;
const countDebt = async (query) => {
    return await debt_model_1.default.countDocuments(query);
};
exports.countDebt = countDebt;
const updateDebt = async (query, body) => {
    try {
        await debt_model_1.default.updateMany(query, body);
        return await debt_model_1.default.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateDebt = updateDebt;
const deleteDebt = async (query) => {
    try {
        let Debt = await debt_model_1.default.find(query);
        if (!Debt) {
            throw new Error("No Debt with that id");
        }
        return await debt_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteDebt = deleteDebt;
const detailSaleByDateAndPagi = async (query, d1, d2, pageNo) => {
    try {
        const limitNo = config_1.default.get("page_limit");
        const reqPage = pageNo == 1 ? 0 : pageNo - 1;
        const skipCount = limitNo * reqPage;
        const filter = {
            ...query,
            createdAt: {
                $gt: d1,
                $lt: d2,
            },
        };
        const dataQuery = debt_model_1.default
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skipCount)
            .limit(limitNo)
            .populate("couObjId")
            .select("-__v");
        const countQuery = debt_model_1.default.countDocuments(filter);
        const [data, count] = await Promise.all([dataQuery, countQuery]);
        return { data, count };
    }
    catch (error) {
        // console.error("Error in detailSaleByDateAndPagi:", error);
        throw error;
    }
};
exports.detailSaleByDateAndPagi = detailSaleByDateAndPagi;
