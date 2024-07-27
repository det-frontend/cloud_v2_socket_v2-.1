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
exports.searchCoustomerHandler = exports.deletCoustomerHandler = exports.addCoustomerHandler = exports.getCoustomerHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const coustomer_service_1 = require("../service/coustomer.service");
const getCoustomerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, coustomer_service_1.getCoustomer)(req.query);
        (0, helper_1.default)(res, "Coustomer are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getCoustomerHandler = getCoustomerHandler;
const addCoustomerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, coustomer_service_1.addCoustomer)(req.body);
        (0, helper_1.default)(res, "New Coustomer was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addCoustomerHandler = addCoustomerHandler;
const deletCoustomerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, coustomer_service_1.deleteCoustomer)(req.query);
        (0, helper_1.default)(res, "Coustomer was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deletCoustomerHandler = deletCoustomerHandler;
const searchCoustomerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, coustomer_service_1.searchCoustomer)(req.query);
        (0, helper_1.default)(res, "search result", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.searchCoustomerHandler = searchCoustomerHandler;
