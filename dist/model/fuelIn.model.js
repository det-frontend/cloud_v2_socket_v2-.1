"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csFuelInModel = exports.ksFuelInModel = void 0;
const mongoose_1 = require("mongoose");
const connect_1 = __importDefault(require("../utils/connect"));
const helper_1 = require("../utils/helper");
const kyawsanDb = (0, connect_1.default)("kyawsan_DbUrl");
const commonDb = (0, connect_1.default)("common_DbUrl");
const fuelInSchema = new mongoose_1.Schema({
    stationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        require: true,
        ref: (0, helper_1.dbDistribution)(this),
    },
    driver: { type: String, required: true },
    bowser: { type: String, required: true },
    tankNo: { type: String, required: true },
    fuel_type: { type: String, required: true },
    fuel_in_code: { type: Number, required: true },
    tank_balance: { type: Number, required: true },
    opening: { type: Number, required: true },
    terminal: { type: String, required: true },
    current_balance: { type: Number },
    send_balance: { type: Number },
    receive_balance: { type: Number, required: true },
    receive_date: { type: String, required: true },
    createAt: { type: Date, default: new Date() },
});
(0, helper_1.virtualFormat)(fuelInSchema, [
    "tank_balance",
    "opening",
    "current_balance",
    "send_balance",
    "receive_balance",
]);
// fuelInSchema.pre("save", function (next) {
//   const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
//   const options = { timeZone: "Asia/Yangon", hour12: false };
//   let currentDateTime = new Date().toLocaleTimeString("en-US", options);
//   const [hour, minute, second] = currentDateTime.split(":").map(Number);
//   if (hour == 24) {
//     currentDateTime = `00:${minute}:${second}`;
//   }
//   let iso: Date = new Date(`${currentDate}T${currentDateTime}.000Z`);
//   this.receive_date = currentDate;
//   this.createAt = iso;
//   next();
// });
const ksFuelInModel = kyawsanDb.model("fuelIn", fuelInSchema);
exports.ksFuelInModel = ksFuelInModel;
const csFuelInModel = commonDb.model("fuelIn", fuelInSchema);
exports.csFuelInModel = csFuelInModel;
