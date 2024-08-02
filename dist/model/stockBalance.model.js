"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csStockBalanceModel = exports.ksStockBalanceModel = void 0;
const mongoose_1 = require("mongoose");
const helper_1 = require("../utils/helper");
const connect_1 = __importDefault(require("../utils/connect"));
const kyawsanDb = (0, connect_1.default)('kyawsan_DbUrl');
const chawsuDb = (0, connect_1.default)('common_DbUrl');
;
const stockBalanceSchema = new mongoose_1.Schema({
    stationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: (0, helper_1.dbDistribution)(this),
        require: true
    },
    tank: { type: String, required: true },
    opening: { type: Number, required: true },
    adjust: { type: Number, required: true },
    issue: { type: Number, required: true },
    receive: { type: Number, required: true },
    balance: { type: Number, required: true },
    todayTank: { type: Number, required: true },
    yesterdayTank: { type: Number, required: true },
    totalIssue: { type: Number, required: true },
    todayGL: { type: Number, required: true },
    totalGL: { type: Number, required: true },
    accessDb: { type: String, required: true },
    realTime: { type: String },
}, {
    timestamps: true
});
const ksStockBalanceModel = kyawsanDb.model("stockBalance", stockBalanceSchema);
exports.ksStockBalanceModel = ksStockBalanceModel;
const csStockBalanceModel = chawsuDb.model("stockBalance", stockBalanceSchema);
exports.csStockBalanceModel = csStockBalanceModel;
