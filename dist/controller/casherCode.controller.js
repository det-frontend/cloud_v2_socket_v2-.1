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
exports.getAllCasherCodeHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const casherCode_service_1 = require("../service/casherCode.service");
const getAllCasherCodeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = req.query.key;
        if (!query)
            throw new Error("You need filter key");
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let { data, count } = yield (0, casherCode_service_1.getAllCasherCodeService)(query, model);
        (0, helper_1.default)(res, "Casher codes are here", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getAllCasherCodeHandler = getAllCasherCodeHandler;
