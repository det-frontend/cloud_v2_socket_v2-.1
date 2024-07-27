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
exports.userRemovePermit = exports.userAddPermit = exports.userRemoveRole = exports.userAddRole = exports.deleteUser = exports.updateUser = exports.getCredentialUser = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const helper_1 = require("../utils/helper");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield user_model_1.default.create(payload);
        let userObj = result.toObject();
        delete userObj.password;
        return userObj;
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.registerUser = registerUser;
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    try {
        let user = yield user_model_1.default
            .findOne({ email })
            .populate("roles permits collectionId")
            .exec();
        // .select("-__v");
        // console.log(user);
        if (!user || !(0, helper_1.compass)(password, user.password)) {
            throw new Error("Creditial Error");
        }
        let userObj = user.toObject();
        userObj["token"] = (0, helper_1.createToken)(userObj);
        delete userObj.password;
        return userObj;
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.loginUser = loginUser;
const getUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_model_1.default
            .find(query)
            .lean()
            .populate({ path: "roles permits" })
            .select("-password -__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getUser = getUser;
const getCredentialUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield user_model_1.default
            .find(query)
            .lean()
            .populate({ path: "roles permits" })
            .select("-__v");
        return [result[0].email, result[0].password];
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getCredentialUser = getCredentialUser;
const updateUser = (query, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.updateMany(query, body);
        return yield user_model_1.default.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateUser = updateUser;
const deleteUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteUser = deleteUser;
const userAddRole = (userId, roleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.findByIdAndUpdate(userId, {
            $push: { roles: roleId },
        });
        return yield user_model_1.default.findById(userId).select("-password -__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.userAddRole = userAddRole;
const userRemoveRole = (userId, roleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.findByIdAndUpdate(userId, {
            $pull: { roles: roleId },
        });
        return yield user_model_1.default.findById(userId).select("-password -__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.userRemoveRole = userRemoveRole;
const userAddPermit = (userId, permitId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.findByIdAndUpdate(userId, { $push: { permits: permitId } });
        return yield user_model_1.default.findById(userId);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.userAddPermit = userAddPermit;
const userRemovePermit = (userId, permitId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.findByIdAndUpdate(userId, { $pull: { permits: permitId } });
        return yield user_model_1.default.findById(userId);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.userRemovePermit = userRemovePermit;
