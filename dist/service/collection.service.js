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
exports.collectionPPRDDPush = exports.collectionPPRDDPull = exports.collectionRemoveStation = exports.collectionAddStation = exports.collectionDelete = exports.collectionAdd = exports.collectionGet = void 0;
const collection_model_1 = __importDefault(require("../model/collection.model"));
const collectionGet = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield collection_model_1.default
            .find(query)
            .lean()
            // .populate("stationCollection")
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.collectionGet = collectionGet;
const collectionAdd = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield new collection_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.collectionAdd = collectionAdd;
const collectionDelete = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield collection_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.collectionDelete = collectionDelete;
const collectionAddStation = (collectionId, stationId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield collection_model_1.default.findByIdAndUpdate(collectionId, {
            $push: { stationCollection: { stationId: stationId, stationName: name } },
        });
        return collection_model_1.default.findById(collectionId);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.collectionAddStation = collectionAddStation;
const collectionRemoveStation = (collectionId, stationId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield collection_model_1.default.findByIdAndUpdate(collectionId, {
            $pull: { stationCollection: { stationId: stationId, stationName: name } },
        });
        return collection_model_1.default.findById(collectionId);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.collectionRemoveStation = collectionRemoveStation;
const collectionPPRDDPull = (collectionId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield collection_model_1.default.findByIdAndUpdate(collectionId, {
            $pull: { permission: name }
        });
        return collection_model_1.default.findById(collectionId);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.collectionPPRDDPull = collectionPPRDDPull;
const collectionPPRDDPush = (collectionId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield collection_model_1.default.findByIdAndUpdate(collectionId, {
            $push: { permission: name }
        });
        return collection_model_1.default.findById(collectionId);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.collectionPPRDDPush = collectionPPRDDPush;
// export const collectionIsPermission = async(name: string,id:string)=>{
//   try {
//     return await collectionModel
//       .find({
//         "permission": { $in: [name] },
//       })
//       .lean()
//       // .populate("stationCollection")
//       .select("-__v");
//   } catch (e) {
//     throw new Error(e);
//   }
// }
