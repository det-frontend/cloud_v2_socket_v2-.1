"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connect_1 = __importDefault(require("../utils/connect"));
const controlDb = (0, connect_1.default)("controlDbUrl");
const permitSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
});
const permitModel = controlDb.model("permit", permitSchema);
exports.default = permitModel;
