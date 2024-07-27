"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csDailyReportModel = exports.ksDailyReportModel = void 0;
const mongoose_1 = require("mongoose");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const connect_1 = __importDefault(require("../utils/connect"));
const helper_1 = require("../utils/helper");
const kyawsanDb = (0, connect_1.default)("kyawsan_DbUrl");
const commonDb = (0, connect_1.default)("common_DbUrl");
const dailyReportSchema = new mongoose_1.Schema({
    stationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: (0, helper_1.dbDistribution)(this),
        required: true,
    },
    accessDb: { type: String, required: true },
    dateOfDay: { type: String, default: new Date().toLocaleDateString(`fr-CA`) },
    date: { type: Date, default: new Date() },
});
dailyReportSchema.pre("save", function (next) {
    const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
    if (this.dateOfDay) {
        next();
    }
    else {
        this.dateOfDay = currentDate;
        next();
    }
});
const ksDailyReportModel = kyawsanDb.model("dailyReport", dailyReportSchema);
exports.ksDailyReportModel = ksDailyReportModel;
const csDailyReportModel = commonDb.model("dailyReport", dailyReportSchema);
exports.csDailyReportModel = csDailyReportModel;
