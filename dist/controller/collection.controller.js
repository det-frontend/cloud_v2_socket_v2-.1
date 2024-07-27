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
exports.collectionPPRDDo = exports.collectionRemovePermitHandler = exports.collectionAddPermitHandler = exports.deletCollectionHandler = exports.addCollectionHandler = exports.getCollectionHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const collection_service_1 = require("../service/collection.service");
const stationDetail_service_1 = require("../service/stationDetail.service");
const getCollectionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        let result = yield (0, collection_service_1.collectionGet)(query);
        (0, helper_1.default)(res, "Collection are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getCollectionHandler = getCollectionHandler;
const addCollectionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, collection_service_1.collectionAdd)(req.body);
        (0, helper_1.default)(res, "New Collection was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addCollectionHandler = addCollectionHandler;
const deletCollectionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, collection_service_1.collectionDelete)(req.query);
        (0, helper_1.default)(res, "Collection was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deletCollectionHandler = deletCollectionHandler;
const collectionAddPermitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let collection = yield (0, collection_service_1.collectionGet)({
            _id: req.body.collectionId,
        });
        let station;
        let ksStationDetail = yield (0, stationDetail_service_1.getStationDetail)({ _id: req.body.stationId }, 'kyaw_san');
        if (ksStationDetail.length == 0) {
            let csStationDetail = yield (0, stationDetail_service_1.getStationDetail)({ _id: req.body.stationId }, 'common');
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
        let result = yield (0, collection_service_1.collectionAddStation)(req.body.collectionId, req.body.stationId, req.body.stationName);
        (0, helper_1.default)(res, "station added ", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.collectionAddPermitHandler = collectionAddPermitHandler;
const collectionRemovePermitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let collection = yield (0, collection_service_1.collectionGet)({
            _id: req.body.collectionId,
        });
        let foundStation = collection[0]["stationCollection"].find((ea) => ea["stationId"] == req.body.stationId);
        if (!collection || !foundStation) {
            throw new Error("collection or station not found");
        }
        let result = yield (0, collection_service_1.collectionRemoveStation)(req.body.collectionId, req.body.stationId, req.body.stationName);
        (0, helper_1.default)(res, "station removed ", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.collectionRemovePermitHandler = collectionRemovePermitHandler;
const collectionPPRDDo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let collection = yield (0, collection_service_1.collectionGet)({
            _id: req.body.collectionId,
        });
        let name = req.body.name;
        if (!name)
            return res.status(409);
        if ((_b = (_a = collection[0]) === null || _a === void 0 ? void 0 : _a.permission) === null || _b === void 0 ? void 0 : _b.includes('pprd')) {
            const data = yield (0, collection_service_1.collectionPPRDDPull)(req.body.collectionId, name);
            return (0, helper_1.default)(res, "pprd off", data);
        }
        else {
            const data = yield (0, collection_service_1.collectionPPRDDPush)(req.body.collectionId, name);
            return (0, helper_1.default)(res, "pprd on", data);
        }
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.collectionPPRDDo = collectionPPRDDo;
