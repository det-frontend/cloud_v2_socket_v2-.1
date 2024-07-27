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
exports.deletPermitHandler = exports.addPermitHandler = exports.getPermitHandler = void 0;
const permit_service_1 = require("../service/permit.service");
const helper_1 = __importDefault(require("../utils/helper"));
const getPermitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, permit_service_1.getPermit)(req.query);
        (0, helper_1.default)(res, "Permit are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getPermitHandler = getPermitHandler;
const addPermitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, permit_service_1.addPermit)(req.body);
        (0, helper_1.default)(res, "New permit was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addPermitHandler = addPermitHandler;
const deletPermitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, permit_service_1.deletePermit)(req.query);
        (0, helper_1.default)(res, "Permit was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deletPermitHandler = deletPermitHandler;
