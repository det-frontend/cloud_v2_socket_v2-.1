"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRemovePermit = exports.roleAddPermit = exports.deleteRole = exports.addRole = exports.getRole = void 0;
const role_model_1 = __importDefault(require("../model/role.model"));
const getRole = async (query) => {
    try {
        return await role_model_1.default
            .find(query)
            .lean()
            .populate("permits")
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getRole = getRole;
const addRole = async (body) => {
    try {
        return await new role_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addRole = addRole;
const deleteRole = async (query) => {
    try {
        return await role_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteRole = deleteRole;
const roleAddPermit = async (roleId, permitId) => {
    try {
        await role_model_1.default.findByIdAndUpdate(roleId, { $push: { permits: permitId } });
        return role_model_1.default.findById(roleId);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.roleAddPermit = roleAddPermit;
const roleRemovePermit = async (roleId, permitId) => {
    try {
        await role_model_1.default.findByIdAndUpdate(roleId, { $pull: { permits: permitId } });
        return role_model_1.default.findById(roleId);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.roleRemovePermit = roleRemovePermit;
