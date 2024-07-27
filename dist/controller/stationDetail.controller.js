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
exports.allowPermissionDetailSale = exports.getAllStationHandler = exports.deleteStationDetailHandler = exports.updateStationDetailHandler = exports.addStationDetailHandler = exports.getStationDetailHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const stationDetail_service_1 = require("../service/stationDetail.service");
// export const getAllStationDetailHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let ksData = await getStationDetail(req.query, ksStationDetailModel);
//     let csData = await getStationDetail(req.query, csStationDetailModel);
//     let result = [...ksData, ...csData];
//     fMsg(res, "StationDetail are here", result);
//   } catch (e) {
//     next(new Error(e));
//   }
// };
const getStationDetailHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageNo = Number(req.params.page);
        if (!pageNo)
            throw new Error("You need page number");
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        // console.log(model)
        let { data, count } = yield (0, stationDetail_service_1.stationDetailPaginate)(pageNo, req.query, model);
        (0, helper_1.default)(res, "StationDetail are here", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getStationDetailHandler = getStationDetailHandler;
const addStationDetailHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        // console.log(model)
        let result = yield (0, stationDetail_service_1.addStationDetail)(req.body, model);
        (0, helper_1.default)(res, "New StationDetail data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addStationDetailHandler = addStationDetailHandler;
const updateStationDetailHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let result = yield (0, stationDetail_service_1.updateStationDetail)({ _id: req.query._id }, req.body, model);
        (0, helper_1.default)(res, "updated StationDetail data", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.updateStationDetailHandler = updateStationDetailHandler;
const deleteStationDetailHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        yield (0, stationDetail_service_1.deleteStationDetail)({ _id: req.query._id }, model);
        (0, helper_1.default)(res, "StationDetail data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deleteStationDetailHandler = deleteStationDetailHandler;
const getAllStationHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        // console.log(model)
        const name = req.query.name;
        let query;
        if (name === "user" || name === "pprd" || name === "manager") {
            query = { permission: { $in: [name] } };
        }
        let data = yield (0, stationDetail_service_1.getAllStationDetails)(model, query);
        (0, helper_1.default)(res, "StationDetail are here", data, model);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getAllStationHandler = getAllStationHandler;
const allowPermissionDetailSale = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let station = yield (0, stationDetail_service_1.getStationDetail)({ _id: req.body._id }, model);
        if (!station)
            return res.status(409);
        const keye = req.body.keye;
        if (station[0].permission.includes(keye)) {
            let result = yield (0, stationDetail_service_1.permissionAddService)(req.body._id, req.body.keye, model, { $pull: { permission: keye } });
            return (0, helper_1.default)(res, "pull permited!", result);
        }
        else {
            let result = yield (0, stationDetail_service_1.permissionAddService)(req.body._id, req.body.keye, model, { $push: { permission: keye } });
            return (0, helper_1.default)(res, "push permited!", result);
        }
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.allowPermissionDetailSale = allowPermissionDetailSale;
