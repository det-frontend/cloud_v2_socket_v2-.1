"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const permit_model_1 = __importDefault(require("./permit.model"));
const connect_1 = __importDefault(require("../utils/connect"));
const controlDb = (0, connect_1.default)("controlDbUrl");
const roleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    permits: [{ type: mongoose_1.Schema.Types.ObjectId, ref: permit_model_1.default }],
});
const roleModel = controlDb.model("role", roleSchema);
exports.default = roleModel;
