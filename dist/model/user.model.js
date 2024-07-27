"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const helper_1 = require("../utils/helper");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const connect_1 = __importDefault(require("../utils/connect"));
const role_model_1 = __importDefault(require("./role.model"));
const permit_model_1 = __importDefault(require("./permit.model"));
const collection_model_1 = __importDefault(require("./collection.model"));
const controlDb = (0, connect_1.default)("controlDbUrl");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    stationId: { type: mongoose_1.Schema.Types.ObjectId, default: null },
    collectionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: collection_model_1.default,
        default: null,
    },
    roles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: role_model_1.default }],
    permits: [{ type: mongoose_1.Schema.Types.ObjectId, ref: permit_model_1.default }],
    accessDb: { type: String }
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        if (!user.isModified("password")) {
            return next();
        }
        let hash = (0, helper_1.encode)(user.password);
        user.password = hash;
        return next();
    });
});
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcryptjs_1.default.compare(candidatePassword, user.password).catch((e) => false);
    });
};
const UserModel = controlDb.model("user", userSchema);
exports.default = UserModel;
