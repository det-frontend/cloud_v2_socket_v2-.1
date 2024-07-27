"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const coustomerSchema = new mongoose_1.Schema({
    cou_name: { type: String, required: true, unique: true },
    cou_id: { type: String, unique: true },
    cou_phone: { type: Number, unique: true },
    cou_sec_phone: { type: Number, unique: true },
    cou_address: { type: String, required: true },
    com_register_no: { type: String, default: null },
    contact_person_name: { type: String, required: true },
    contact_person_phone: { type: Number, required: true },
    contact_person_sec_phone: { type: Number, required: true },
    limitAmount: { type: Number, default: 0 },
    cou_debt: { type: Number, default: 0 },
}, {
    timestamps: true,
});
coustomerSchema.pre("save", function (next) {
    this.cou_name = this.cou_name.toLowerCase();
    this.cou_id = (0, uuid_1.v4)().substr(0, 6);
    next();
});
const coustomerModel = mongoose_1.default.model("coustomer", coustomerSchema);
exports.default = coustomerModel;
