"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRemovePermit = exports.userAddPermit = exports.userRemoveRole = exports.userAddRole = exports.deleteUser = exports.updateUser = exports.getCredentialUser = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const helper_1 = require("../utils/helper");
const registerUser = async (payload) => {
    try {
        let result = await user_model_1.default.create(payload);
        let userObj = result.toObject();
        delete userObj.password;
        return userObj;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.registerUser = registerUser;
const loginUser = async ({ email, password, }) => {
    try {
        let user = await user_model_1.default
            .findOne({ email })
            .populate("roles permits collectionId")
            .exec();
        // .select("-__v");
        console.log(user);
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
};
exports.loginUser = loginUser;
const getUser = async (query) => {
    try {
        return await user_model_1.default
            .find(query)
            .lean()
            .populate({ path: "roles permits" })
            .select("-password -__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getUser = getUser;
const getCredentialUser = async (query) => {
    try {
        let result = await user_model_1.default
            .find(query)
            .lean()
            .populate({ path: "roles permits" })
            .select("-__v");
        return [result[0].email, result[0].password];
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getCredentialUser = getCredentialUser;
const updateUser = async (query, body) => {
    try {
        await user_model_1.default.updateMany(query, body);
        return await user_model_1.default.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (query) => {
    try {
        return await user_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteUser = deleteUser;
const userAddRole = async (userId, roleId) => {
    try {
        await user_model_1.default.findByIdAndUpdate(userId, {
            $push: { roles: roleId },
        });
        return await user_model_1.default.findById(userId).select("-password -__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.userAddRole = userAddRole;
const userRemoveRole = async (userId, roleId) => {
    try {
        await user_model_1.default.findByIdAndUpdate(userId, {
            $pull: { roles: roleId },
        });
        return await user_model_1.default.findById(userId).select("-password -__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.userRemoveRole = userRemoveRole;
const userAddPermit = async (userId, permitId) => {
    try {
        await user_model_1.default.findByIdAndUpdate(userId, { $push: { permits: permitId } });
        return await user_model_1.default.findById(userId);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.userAddPermit = userAddPermit;
const userRemovePermit = async (userId, permitId) => {
    try {
        await user_model_1.default.findByIdAndUpdate(userId, { $pull: { permits: permitId } });
        return await user_model_1.default.findById(userId);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.userRemovePermit = userRemovePermit;
