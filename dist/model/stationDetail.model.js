"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csStationDetailModel = exports.ksStationDetailModel = void 0;
const mongoose_1 = require("mongoose");
const connect_1 = __importDefault(require("../utils/connect"));
const kyawsanDb = (0, connect_1.default)("kyawsan_DbUrl");
const commonDb = (0, connect_1.default)("common_DbUrl");
const stationDetailSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true, unique: true },
    lienseNo: { type: String, required: true, unique: true },
    deviceCount: { type: Number, required: true },
    nozzleCount: { type: Number, required: true },
    tankCount: { type: Number, required: true },
    permission: [],
    startDate: { type: Date, required: true },
    expireDate: { type: Date, required: true }
});
const ksStationDetailModel = kyawsanDb.model("stationDetail", stationDetailSchema);
exports.ksStationDetailModel = ksStationDetailModel;
const csStationDetailModel = commonDb.model("stationDetail", stationDetailSchema);
exports.csStationDetailModel = csStationDetailModel;
