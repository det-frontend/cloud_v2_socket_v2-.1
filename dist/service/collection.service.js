"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionPPRDDPush = exports.collectionPPRDDPull = exports.collectionRemoveStation = exports.collectionAddStation = exports.collectionDelete = exports.collectionAdd = exports.collectionGet = void 0;
const collection_model_1 = __importDefault(require("../model/collection.model"));
const collectionGet = async (query) => {
    try {
        return await collection_model_1.default
            .find(query)
            .lean()
            // .populate("stationCollection")
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.collectionGet = collectionGet;
const collectionAdd = async (body) => {
    try {
        return await new collection_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.collectionAdd = collectionAdd;
const collectionDelete = async (query) => {
    try {
        return await collection_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.collectionDelete = collectionDelete;
const collectionAddStation = async (collectionId, stationId, name) => {
    try {
        await collection_model_1.default.findByIdAndUpdate(collectionId, {
            $push: { stationCollection: { stationId: stationId, stationName: name } },
        });
        return collection_model_1.default.findById(collectionId);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.collectionAddStation = collectionAddStation;
const collectionRemoveStation = async (collectionId, stationId, name) => {
    try {
        await collection_model_1.default.findByIdAndUpdate(collectionId, {
            $pull: { stationCollection: { stationId: stationId, stationName: name } },
        });
        return collection_model_1.default.findById(collectionId);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.collectionRemoveStation = collectionRemoveStation;
const collectionPPRDDPull = async (collectionId, name) => {
    try {
        await collection_model_1.default.findByIdAndUpdate(collectionId, {
            $pull: { permission: name }
        });
        return collection_model_1.default.findById(collectionId);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.collectionPPRDDPull = collectionPPRDDPull;
const collectionPPRDDPush = async (collectionId, name) => {
    try {
        await collection_model_1.default.findByIdAndUpdate(collectionId, {
            $push: { permission: name }
        });
        return collection_model_1.default.findById(collectionId);
    }
    catch (e) {
        throw new Error(e);
    }
};
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
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }
