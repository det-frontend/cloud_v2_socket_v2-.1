"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const debtSchema = new mongoose_2.Schema({
    stationDetailId: {
        type: mongoose_2.Schema.Types.ObjectId,
        require: true,
        ref: "stationDetail",
    },
    couObjId: {
        type: mongoose_2.Schema.Types.ObjectId,
        require: true,
        ref: "coustomer",
    },
    vocono: { type: String, require: true, unique: true },
    credit: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    liter: { type: Number, default: 0 },
    note: { type: String, default: null },
    paided: { type: Boolean, default: false },
    dateOfDay: {
        type: String,
        default: new Date().toLocaleDateString(`fr-CA`),
    },
    createdAt: { type: Date, default: Date.now },
});
debtSchema.pre("save", function (next) {
    const options = { timeZone: "Asia/Yangon", hour12: false };
    const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
    const currentDateTime = new Date().toLocaleTimeString("en-US", options);
    let iso = new Date(`${currentDate}T${currentDateTime}.000Z`);
    this.createdAt = iso;
    this.dateOfDay = currentDate;
    next();
});
const debtModel = mongoose_1.default.model("debt", debtSchema);
exports.default = debtModel;
