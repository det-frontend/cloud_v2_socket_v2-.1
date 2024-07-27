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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateToken = exports.validateAll = void 0;
const helper_1 = require("../utils/helper");
const user_service_1 = require("../service/user.service");
const validateAll = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (e) {
        return next(new Error(e.errors[0].message));
    }
});
exports.validateAll = validateAll;
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return next(new Error("invalid token"));
        }
        try {
            let decoded = (0, helper_1.checkToken)(token);
            let user = yield (0, user_service_1.getUser)({ _id: decoded._id });
            req.body.user = user;
        }
        catch (e) {
            return next(new Error(e));
        }
        next();
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.validateToken = validateToken;
const validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let [email, password] = yield (0, user_service_1.getCredentialUser)({ email: req.body.email });
        if (!email || !(0, helper_1.compass)(req.body.password, password)) {
            throw new Error("Creditial Error");
        }
        next();
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.validateUser = validateUser;
