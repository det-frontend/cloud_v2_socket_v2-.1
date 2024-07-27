"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connect_1 = __importDefault(require("../utils/connect"));
const controlDb = (0, connect_1.default)("controlDbUrl");
;
const closePermissionSchema = new mongoose_1.Schema({
    stationDetailId: { type: String, required: true },
    mode: { type: String, required: true }
}, {
    timestamps: true
});
const closePermissionModel = controlDb.model("closePermission", closePermissionSchema);
exports.default = closePermissionModel;
