"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connect_1 = __importDefault(require("../utils/connect"));
const controlDb = (0, connect_1.default)("controlDbUrl");
const collectionSchema = new mongoose_1.Schema({
    collectionName: { type: String, required: true, unique: true },
    stationCollection: [
        {
            stationId: { type: String, required: true },
            stationName: { type: String, required: true },
        },
    ],
    stationImg: { type: String, required: true, unique: true },
    permission: [],
});
const collectionModel = controlDb.model("collection", collectionSchema);
exports.default = collectionModel;
