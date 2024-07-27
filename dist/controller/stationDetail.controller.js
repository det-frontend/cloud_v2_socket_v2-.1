"use strict";
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
//   } catch (e: any) {
//     next(new Error(e));
//   }
// };
const getStationDetailHandler = async (req, res, next) => {
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
        let { data, count } = await (0, stationDetail_service_1.stationDetailPaginate)(pageNo, req.query, model);
        (0, helper_1.default)(res, "StationDetail are here", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getStationDetailHandler = getStationDetailHandler;
const addStationDetailHandler = async (req, res, next) => {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        // console.log(model)
        let result = await (0, stationDetail_service_1.addStationDetail)(req.body, model);
        (0, helper_1.default)(res, "New StationDetail data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addStationDetailHandler = addStationDetailHandler;
const updateStationDetailHandler = async (req, res, next) => {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let result = await (0, stationDetail_service_1.updateStationDetail)({ _id: req.query._id }, req.body, model);
        (0, helper_1.default)(res, "updated StationDetail data", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.updateStationDetailHandler = updateStationDetailHandler;
const deleteStationDetailHandler = async (req, res, next) => {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        await (0, stationDetail_service_1.deleteStationDetail)({ _id: req.query._id }, model);
        (0, helper_1.default)(res, "StationDetail data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deleteStationDetailHandler = deleteStationDetailHandler;
const getAllStationHandler = async (req, res, next) => {
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
        let data = await (0, stationDetail_service_1.getAllStationDetails)(model, query);
        (0, helper_1.default)(res, "StationDetail are here", data, model);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getAllStationHandler = getAllStationHandler;
const allowPermissionDetailSale = async (req, res, next) => {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let station = await (0, stationDetail_service_1.getStationDetail)({ _id: req.body._id }, model);
        if (!station)
            return res.status(409);
        const keye = req.body.keye;
        if (station[0].permission.includes(keye)) {
            let result = await (0, stationDetail_service_1.permissionAddService)(req.body._id, req.body.keye, model, { $pull: { permission: keye } });
            return (0, helper_1.default)(res, "pull permited!", result);
        }
        else {
            let result = await (0, stationDetail_service_1.permissionAddService)(req.body._id, req.body.keye, model, { $push: { permission: keye } });
            return (0, helper_1.default)(res, "push permited!", result);
        }
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.allowPermissionDetailSale = allowPermissionDetailSale;
