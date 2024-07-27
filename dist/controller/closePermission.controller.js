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
exports.deletePermissionHandler = exports.addPermissionHandler = exports.updatePermissionHandler = exports.getClosePermissionHandler = void 0;
const closePermission_service_1 = require("../service/closePermission.service");
const helper_1 = __importDefault(require("../utils/helper"));
const app_1 = __importDefault(require("../app"));
const getClosePermissionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let query;
        if (req.query.stationDetailId) {
            query = { stationDetailId: req.query.stationDetailId };
        }
        let result = yield (0, closePermission_service_1.getAllClosePermissionService)(model, query);
        (0, helper_1.default)(res, "close Permissions", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getClosePermissionHandler = getClosePermissionHandler;
const updatePermissionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let result = yield (0, closePermission_service_1.getAClosePermissionService)(model, { _id: req.body._id });
        if (!result)
            return res.status(404);
        const succ = yield (0, closePermission_service_1.updatePermissionService)(req.body, req.body._id, model);
        const stationDetailId = succ[0].stationDetailId;
        const payload = succ[0];
        (0, helper_1.default)(res, "update Permissions", succ);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.updatePermissionHandler = updatePermissionHandler;
const addPermissionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let result = yield (0, closePermission_service_1.addPerissionService)(req.body, model);
        app_1.default.of('/change-mode').emit(result.stationDetailId, result);
        (0, helper_1.default)(res, "add Permissions", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addPermissionHandler = addPermissionHandler;
const deletePermissionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        const id = req.body.id;
        let result = yield (0, closePermission_service_1.deletePermissionService)(id, model);
        (0, helper_1.default)(res, "add Permissions", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deletePermissionHandler = deletePermissionHandler;
