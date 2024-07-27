"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csFuelBalanceModel = exports.ksFuelBalanceModel = void 0;
const mongoose_1 = require("mongoose");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const connect_1 = __importDefault(require("../utils/connect"));
const helper_1 = require("../utils/helper");
const kyawsanDb = (0, connect_1.default)("kyawsan_DbUrl");
const commonDb = (0, connect_1.default)("common_DbUrl");
const fuelBalanceSchema = new mongoose_1.Schema({
    stationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: (0, helper_1.dbDistribution)(this),
        require: true,
    },
    accessDb: { type: String, required: true },
    fuelType: { type: String, required: true },
    capacity: { type: String, required: true },
    opening: { type: Number, default: 0 },
    tankNo: { type: Number, require: true },
    fuelIn: { type: Number, default: 0 },
    cash: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    nozzles: { type: Array, required: true },
    realTime: { type: Date, default: new Date() },
    createAt: { type: String, default: new Date().toLocaleDateString(`fr-CA`) },
});
fuelBalanceSchema.pre("save", function (next) {
    const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
    if (this.realTime) {
        next();
        return;
    }
    this.realTime = new Date();
    this.createAt = currentDate;
    next();
});
const ksFuelBalanceModel = kyawsanDb.model("fuelBalance", fuelBalanceSchema);
exports.ksFuelBalanceModel = ksFuelBalanceModel;
const csFuelBalanceModel = commonDb.model("fuelBalance", fuelBalanceSchema);
exports.csFuelBalanceModel = csFuelBalanceModel;
