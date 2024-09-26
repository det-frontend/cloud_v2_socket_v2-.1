"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csDetailSaleModel = exports.ksDetailSaleModel = void 0;
const mongoose_1 = require("mongoose");
const connect_1 = __importDefault(require("../utils/connect"));
const helper_1 = require("../utils/helper");
const kyawsanDb = (0, connect_1.default)("kyawsan_DbUrl");
const commonDb = (0, connect_1.default)("common_DbUrl");
const detailSaleSchema = new mongoose_1.Schema({
    stationDetailId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: (0, helper_1.dbDistribution)(this),
    },
    accessDb: { type: String, required: true },
    device: { type: String },
    preset: { type: String, default: null },
    asyncAlready: { type: String, required: true, default: "0" },
    vocono: { type: String, required: true, unique: true }, //g
    carNo: { type: String, default: null }, //g
    vehicleType: { type: String, default: "car" }, //g
    depNo: { type: String, default: '0' },
    nozzleNo: { type: String, required: true }, //g
    fuelType: { type: String, required: true }, //g
    //update
    cashType: {
        type: String,
        default: "Cash",
        // enum: ["Cash", "KBZ_Pay", "Credit", "FOC", "Debt", "Others"],
    },
    casherCode: { type: String, required: true },
    couObjId: { type: mongoose_1.Schema.Types.ObjectId, default: null },
    isError: { type: String },
    salePrice: { type: Number, required: true },
    saleLiter: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalizer_liter: { type: Number, required: true },
    devTotalizar_liter: { type: Number },
    totalizer_amount: { type: Number, required: true },
    tankBalance: { type: Number, default: 0 },
    tankNo: { type: Number, default: 0 },
    isSent: { type: Number, default: 0 },
    dailyReportDate: {
        type: String,
        default: new Date().toLocaleDateString(`fr-CA`),
    },
    createAt: { type: Date, default: new Date() },
});
// detailSaleSchema.pre("save", function (next) {
//  console.log(this);
//  if (this.createAt) {
//    console.log("wee zzoooo");
//  }
//   next();
// });
const ksDetailSaleModel = kyawsanDb.model("detailSale", detailSaleSchema);
exports.ksDetailSaleModel = ksDetailSaleModel;
const csDetailSaleModel = commonDb.model("detailSale", detailSaleSchema);
exports.csDetailSaleModel = csDetailSaleModel;
