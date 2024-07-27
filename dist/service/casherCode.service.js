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
exports.getAllCasherCodeService = void 0;
const helper_1 = require("../utils/helper");
const detailSale_model_1 = require("../model/detailSale.model");
const config_1 = __importDefault(require("config"));
const limitNo = config_1.default.get('page_limit');
const getAllCasherCodeService = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
        const data = yield selectedModel
            .distinct(query);
        let count = data.length;
        return { data, count };
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getAllCasherCodeService = getAllCasherCodeService;
