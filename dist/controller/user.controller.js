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
exports.userRemovePermitHandler = exports.userAddPermitHandler = exports.userRemoveRoleHandler = exports.userAddRoleHandler = exports.deleteUserHandler = exports.getUserByAdminHandler = exports.updateUserHandler = exports.getUserHandler = exports.loginUserHandler = exports.registerUserHandler = void 0;
const user_service_1 = require("../service/user.service");
const helper_1 = __importDefault(require("../utils/helper"));
const role_service_1 = require("../service/role.service");
const permit_service_1 = require("../service/permit.service");
const registerUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, user_service_1.registerUser)(req.body);
        (0, helper_1.default)(res, "user registered", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.registerUserHandler = registerUserHandler;
const loginUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, user_service_1.loginUser)(req.body);
        (0, helper_1.default)(res, "registered users", result);
    }
    catch (e) {
        next(e);
    }
});
exports.loginUserHandler = loginUserHandler;
const getUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = req.query;
        let result = yield (0, user_service_1.getUser)(query);
        (0, helper_1.default)(res, "registered users", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getUserHandler = getUserHandler;
const updateUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, user_service_1.updateUser)(req.query, req.body);
        (0, helper_1.default)(res, "updated user data", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.updateUserHandler = updateUserHandler;
const getUserByAdminHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, user_service_1.getUser)(req.query);
        (0, helper_1.default)(res, "registered users", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getUserByAdminHandler = getUserByAdminHandler;
const deleteUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, user_service_1.deleteUser)(req.query);
        (0, helper_1.default)(res, "user deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deleteUserHandler = deleteUserHandler;
const userAddRoleHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, user_service_1.getUser)({ _id: req.body.userId });
    let role = yield (0, role_service_1.getRole)({ _id: req.body.roleId });
    if (!user[0] || !role[0]) {
        return next(new Error("there is no role or user"));
    }
    let foundRole = user[0].roles.find((ea) => ea._id == req.body.roleId);
    if (foundRole) {
        return next(new Error("Role already in exist"));
    }
    try {
        let result = yield (0, user_service_1.userAddRole)(user[0]._id, role[0]._id);
        // let result = await userModel.findById(user._id)
        (0, helper_1.default)(res, "role added", result);
    }
    catch (e) {
        next(new Error(e.errors));
    }
});
exports.userAddRoleHandler = userAddRoleHandler;
const userRemoveRoleHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, user_service_1.getUser)({ _id: req.body.userId });
    // let role = await getRole({_id : req.body.roleId})
    if (!user[0]) {
        return next(new Error("there is no user"));
    }
    let foundRole = user[0].roles.find((ea) => ea._id == req.body.roleId);
    if (!foundRole) {
        return next(new Error("role not exist"));
    }
    try {
        let result = yield (0, user_service_1.userRemoveRole)(user[0]._id, req.body.roleId);
        (0, helper_1.default)(res, "role removed", result);
    }
    catch (e) {
        next(new Error(e.errors));
    }
});
exports.userRemoveRoleHandler = userRemoveRoleHandler;
const userAddPermitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, user_service_1.getUser)({ _id: req.body.userId });
    let permit = yield (0, permit_service_1.getPermit)({ _id: req.body.permitId });
    if (!user[0] || !permit[0]) {
        return next(new Error("there is no permit or user"));
    }
    let foundRole = user[0].permits.find((ea) => ea._id == req.body.permitId);
    if (foundRole) {
        return next(new Error("permit already in exist"));
    }
    try {
        let result = yield (0, user_service_1.userAddPermit)(user[0]._id, permit[0]._id);
        // let result = await userModel.findById(user._id)
        (0, helper_1.default)(res, "permit added", result);
    }
    catch (e) {
        next(new Error(e.errors));
    }
});
exports.userAddPermitHandler = userAddPermitHandler;
const userRemovePermitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, user_service_1.getUser)({ _id: req.body.userId });
    // let role = await getRole({_id : req.body.roleId})
    if (!user[0]) {
        return next(new Error("there is no user"));
    }
    let foundRole = user[0].permits.find((ea) => ea._id == req.body.permitId);
    if (!foundRole) {
        return next(new Error("permit not exist"));
    }
    try {
        let result = yield (0, user_service_1.userRemovePermit)(user[0]._id, req.body.permitId);
        (0, helper_1.default)(res, "permit removed", result);
    }
    catch (e) {
        next(new Error(e.errors));
    }
});
exports.userRemovePermitHandler = userRemovePermitHandler;
