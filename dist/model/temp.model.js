"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connect_1 = __importDefault(require("../utils/connect"));
const controlDb = (0, connect_1.default)("controlDbUrl");
const tempSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const tempModel = controlDb.model("temp", tempSchema);
exports.default = tempModel;
