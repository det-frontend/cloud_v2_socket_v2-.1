"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCasherCodeService = void 0;
const helper_1 = require("../utils/helper");
const detailSale_model_1 = require("../model/detailSale.model");
const config_1 = __importDefault(require("config"));
const limitNo = config_1.default.get('page_limit');
const getAllCasherCodeService = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
        const data = await selectedModel
            .distinct(query);
        let count = data.length;
        return { data, count };
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getAllCasherCodeService = getAllCasherCodeService;
