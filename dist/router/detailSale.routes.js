"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const detailSale_controller_1 = require("../controller/detailSale.controller");
const modelControl_1 = require("../middleware/modelControl");
const permitValidator_1 = require("../middleware/permitValidator");
const roleValidator_1 = require("../middleware/roleValidator");
const validator_1 = require("../middleware/validator");
const scheama_1 = require("../schema/scheama");
const detailSaleRoute = require("express").Router();
detailSaleRoute.get("/pagi/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.getDetailSaleHandler);
detailSaleRoute.get("/by-date", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.getDetailSaleByDateHandler);
detailSaleRoute.get("/pagi/by-date/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.getDetailSaleDatePagiHandler);
// //that for only device
detailSaleRoute.post("/", 
// validateAll(detailSaleSchema),
modelControl_1.locSevModelControl, detailSale_controller_1.addDetailSaleHandler);
detailSaleRoute.patch("/", validator_1.validateToken, (0, validator_1.validateAll)(scheama_1.detailSaleUpdateSchema), (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["edit"]), modelControl_1.modelController, detailSale_controller_1.updateDetailSaleHandler);
detailSaleRoute.delete("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["delete"]), (0, validator_1.validateAll)(scheama_1.allSchemaId), modelControl_1.modelController, detailSale_controller_1.deleteDetailSaleHandler);
detailSaleRoute.get("/statement-report", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.statementReportHandler);
detailSaleRoute.get("/perday/total", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.calculateTotalPerDayHandler);
detailSaleRoute.get("/perday/categories/total", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.calculateCategoriesTotalHandler);
detailSaleRoute.get("/perday/station/total", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.calculateStationTotalHandler);
detailSaleRoute.get("/previous/sevenday/total", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.sevenDayPreviousTotalHandler);
detailSaleRoute.get("/daily-sale/by-date/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, detailSale_controller_1.getDailyReportDateForEachDayHandler);
exports.default = detailSaleRoute;
