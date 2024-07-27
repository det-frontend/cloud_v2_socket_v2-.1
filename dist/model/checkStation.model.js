"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connect_1 = __importDefault(require("../utils/connect"));
const controlDb = (0, connect_1.default)("controlDbUrl");
const checkStationSchema = new mongoose_1.Schema({
    otpCode: { type: String, unique: true, required: true },
    stationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "stationDetail",
        require: true,
    },
    createdAt: { type: Date, default: Date.now() },
});
const checkStationModel = controlDb.model("checkStation", checkStationSchema);
exports.default = checkStationModel;
