"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stationDetail_controller_1 = require("../controller/stationDetail.controller");
const modelControl_1 = require("../middleware/modelControl");
const permitValidator_1 = require("../middleware/permitValidator");
const roleValidator_1 = require("../middleware/roleValidator");
const validator_1 = require("../middleware/validator");
const scheama_1 = require("../schema/scheama");
const stationDetailRoute = require("express").Router();
// stationDetailRoute.get("/", getAllStationDetailHandler);
stationDetailRoute.get("/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, stationDetail_controller_1.getStationDetailHandler);
stationDetailRoute.get('/get/all', validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, stationDetail_controller_1.getAllStationHandler);
stationDetailRoute.post("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["admin"]), (0, permitValidator_1.hasAnyPermit)(["add"]), 
// validateAll(stationDetailSchema),
modelControl_1.modelController, stationDetail_controller_1.addStationDetailHandler);
stationDetailRoute.patch("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["admin"]), (0, permitValidator_1.hasAnyPermit)(["edit"]), (0, validator_1.validateAll)(scheama_1.allSchemaId), modelControl_1.modelController, stationDetail_controller_1.updateStationDetailHandler);
stationDetailRoute.delete("/", validator_1.validateToken, (0, validator_1.validateAll)(scheama_1.allSchemaId), (0, roleValidator_1.roleValidator)(["admin"]), (0, permitValidator_1.hasAnyPermit)(["delete"]), modelControl_1.modelController, stationDetail_controller_1.deleteStationDetailHandler);
stationDetailRoute.patch("/permission", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["admin"]), modelControl_1.modelController, stationDetail_controller_1.allowPermissionDetailSale);
exports.default = stationDetailRoute;
