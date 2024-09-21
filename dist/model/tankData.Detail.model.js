"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csTankDataModel = exports.ksTankDataModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const connect_1 = __importDefault(require("../utils/connect"));
const helper_1 = require("../utils/helper");
const kyawsanDb = (0, connect_1.default)('kyawsan_DbUrl');
const chawsuDb = (0, connect_1.default)('common_DbUrl');
;
;
const tankDataSchema = new mongoose_1.Schema({
    stationDetailId: {
        type: mongoose_2.default.Types.ObjectId,
        ref: (0, helper_1.dbDistribution)(this),
        required: true
    },
    // vocono: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    nozzleNo: {
        type: String,
        required: true,
    },
    data: {
        type: Array,
        default: []
    },
    dailyReportDate: {
        type: String,
        default: new Date().toLocaleDateString(`fr-CA`),
    },
}, {
    timestamps: true
});
const ksTankDataModel = kyawsanDb.model("tankData", tankDataSchema);
exports.ksTankDataModel = ksTankDataModel;
const csTankDataModel = chawsuDb.model('tankData', tankDataSchema);
exports.csTankDataModel = csTankDataModel;
