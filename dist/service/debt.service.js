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
exports.detailSaleByDateAndPagi = exports.deleteDebt = exports.updateDebt = exports.countDebt = exports.addDebt = exports.DebtPaginate = exports.getDebt = void 0;
const config_1 = __importDefault(require("config"));
const debt_model_1 = __importDefault(require("../model/debt.model"));
const coustomer_service_1 = require("./coustomer.service");
const getDebt = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield debt_model_1.default
            .find(query)
            .populate("couObjId")
            .lean()
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getDebt = getDebt;
const DebtPaginate = (pageNo, query) => __awaiter(void 0, void 0, void 0, function* () {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const data = yield debt_model_1.default
        .find(query)
        .populate("couObjId")
        .skip(skipCount)
        .limit(limitNo)
        .lean()
        .select("-__v");
    const count = yield debt_model_1.default.countDocuments(query);
    return { data, count };
});
exports.DebtPaginate = DebtPaginate;
const addDebt = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let coustomerConditon = yield (0, coustomer_service_1.getCoustomerById)(body.couObjId);
        if (!coustomerConditon)
            throw new Error("There is no coustomer with that name");
        return yield new debt_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.addDebt = addDebt;
const countDebt = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield debt_model_1.default.countDocuments(query);
});
exports.countDebt = countDebt;
const updateDebt = (query, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield debt_model_1.default.updateMany(query, body);
        return yield debt_model_1.default.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateDebt = updateDebt;
const deleteDebt = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Debt = yield debt_model_1.default.find(query);
        if (!Debt) {
            throw new Error("No Debt with that id");
        }
        return yield debt_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteDebt = deleteDebt;
const detailSaleByDateAndPagi = (query, d1, d2, pageNo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limitNo = config_1.default.get("page_limit");
        const reqPage = pageNo == 1 ? 0 : pageNo - 1;
        const skipCount = limitNo * reqPage;
        const filter = Object.assign(Object.assign({}, query), { createdAt: {
                $gt: d1,
                $lt: d2,
            } });
        const dataQuery = debt_model_1.default
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skipCount)
            .limit(limitNo)
            .populate("couObjId")
            .select("-__v");
        const countQuery = debt_model_1.default.countDocuments(filter);
        const [data, count] = yield Promise.all([dataQuery, countQuery]);
        return { data, count };
    }
    catch (error) {
        // console.error("Error in detailSaleByDateAndPagi:", error);
        throw error;
    }
});
exports.detailSaleByDateAndPagi = detailSaleByDateAndPagi;
