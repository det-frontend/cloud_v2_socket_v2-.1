"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionPPRDDo = exports.collectionRemovePermitHandler = exports.collectionAddPermitHandler = exports.deletCollectionHandler = exports.addCollectionHandler = exports.getCollectionHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const collection_service_1 = require("../service/collection.service");
const stationDetail_service_1 = require("../service/stationDetail.service");
const getCollectionHandler = async (req, res, next) => {
    try {
        const name = req.query.name;
        let query;
        if (name) {
            query = { "permission": { $in: [name] } };
        }
        else {
            query = req.query;
        }
        // console.log(query)
        let result = await (0, collection_service_1.collectionGet)(query);
        (0, helper_1.default)(res, "Collection are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getCollectionHandler = getCollectionHandler;
const addCollectionHandler = async (req, res, next) => {
    try {
        let result = await (0, collection_service_1.collectionAdd)(req.body);
        (0, helper_1.default)(res, "New Collection was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addCollectionHandler = addCollectionHandler;
const deletCollectionHandler = async (req, res, next) => {
    try {
        await (0, collection_service_1.collectionDelete)(req.query);
        (0, helper_1.default)(res, "Collection was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deletCollectionHandler = deletCollectionHandler;
const collectionAddPermitHandler = async (req, res, next) => {
    try {
        let collection = await (0, collection_service_1.collectionGet)({
            _id: req.body.collectionId,
        });
        let station;
        let ksStationDetail = await (0, stationDetail_service_1.getStationDetail)({ _id: req.body.stationId }, 'kyaw_san');
        if (ksStationDetail.length == 0) {
            let csStationDetail = await (0, stationDetail_service_1.getStationDetail)({ _id: req.body.stationId }, 'common');
            station = csStationDetail;
        }
        else {
            station = ksStationDetail;
        }
        if (collection.length == 0 || station.length == 0) {
            next(new Error("collection or station not found"));
        }
        let foundStation = collection[0].stationCollection.find((ea) => ea._id == req.body.stationId);
        if (foundStation) {
            return next(new Error("station already in exist"));
        }
        console.log("wk");
        let result = await (0, collection_service_1.collectionAddStation)(req.body.collectionId, req.body.stationId, req.body.stationName);
        (0, helper_1.default)(res, "station added ", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.collectionAddPermitHandler = collectionAddPermitHandler;
const collectionRemovePermitHandler = async (req, res, next) => {
    try {
        let collection = await (0, collection_service_1.collectionGet)({
            _id: req.body.collectionId,
        });
        let foundStation = collection[0]["stationCollection"].find((ea) => ea["stationId"] == req.body.stationId);
        if (!collection || !foundStation) {
            throw new Error("collection or station not found");
        }
        let result = await (0, collection_service_1.collectionRemoveStation)(req.body.collectionId, req.body.stationId, req.body.stationName);
        (0, helper_1.default)(res, "station removed ", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.collectionRemovePermitHandler = collectionRemovePermitHandler;
const collectionPPRDDo = async (req, res, next) => {
    try {
        let collection = await (0, collection_service_1.collectionGet)({
            _id: req.body.collectionId,
        });
        let name = req.body.name;
        if (!name)
            return res.status(409);
        if (collection[0]?.permission?.includes('pprd')) {
            const data = await (0, collection_service_1.collectionPPRDDPull)(req.body.collectionId, name);
            return (0, helper_1.default)(res, "pprd off", data);
        }
        else {
            const data = await (0, collection_service_1.collectionPPRDDPush)(req.body.collectionId, name);
            return (0, helper_1.default)(res, "pprd on", data);
        }
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.collectionPPRDDo = collectionPPRDDo;
