"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRemovePermitHandler = exports.roleAddPermitHandler = exports.deletRoleHandler = exports.addRoleHandler = exports.getRoleHandler = void 0;
const permit_service_1 = require("../service/permit.service");
const role_service_1 = require("../service/role.service");
const helper_1 = __importDefault(require("../utils/helper"));
const getRoleHandler = async (req, res, next) => {
    try {
        let result = await (0, role_service_1.getRole)(req.query);
        (0, helper_1.default)(res, "Role are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getRoleHandler = getRoleHandler;
const addRoleHandler = async (req, res, next) => {
    try {
        let result = await (0, role_service_1.addRole)(req.body);
        (0, helper_1.default)(res, "New Role was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addRoleHandler = addRoleHandler;
const deletRoleHandler = async (req, res, next) => {
    try {
        await (0, role_service_1.deleteRole)(req.query);
        (0, helper_1.default)(res, "Role was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deletRoleHandler = deletRoleHandler;
const roleAddPermitHandler = async (req, res, next) => {
    try {
        let role = await (0, role_service_1.getRole)({ _id: req.body.roleId });
        let permit = await (0, permit_service_1.getPermit)({ _id: req.body.permitId });
        if (!role[0] || !permit[0]) {
            next(new Error("role or permit not found"));
        }
        let foundRole = role[0].permits.find((ea) => ea._id == req.body.permitId);
        if (foundRole) {
            return next(new Error("Permit already in exist"));
        }
        let result = await (0, role_service_1.roleAddPermit)(req.body.roleId, req.body.permitId);
        (0, helper_1.default)(res, "permit added ", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.roleAddPermitHandler = roleAddPermitHandler;
const roleRemovePermitHandler = async (req, res, next) => {
    try {
        let role = await (0, role_service_1.getRole)({ _id: req.body.roleId });
        let dbpermit = role[0]["permits"].find((ea) => ea["_id"] == req.body.permitId);
        if (!role || !dbpermit) {
            throw new Error("role or permit not found");
        }
        let result = await (0, role_service_1.roleRemovePermit)(req.body.roleId, req.body.permitId);
        (0, helper_1.default)(res, "permit removed ", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.roleRemovePermitHandler = roleRemovePermitHandler;
