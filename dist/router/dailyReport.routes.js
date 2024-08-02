"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dailyReport_controller_1 = require("../controller/dailyReport.controller");
const modelControl_1 = require("../middleware/modelControl");
const permitValidator_1 = require("../middleware/permitValidator");
const roleValidator_1 = require("../middleware/roleValidator");
const validator_1 = require("../middleware/validator");
const scheama_1 = require("../schema/scheama");
const dailyReportRoute = require("express").Router();
dailyReportRoute.get("/pagi/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, dailyReport_controller_1.getDailyReportHandler);
dailyReportRoute.post("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["add"]), (0, validator_1.validateAll)(scheama_1.dailyReportSchema), modelControl_1.modelController, dailyReport_controller_1.addDailyReportHandler);
dailyReportRoute.patch("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["edit"]), (0, validator_1.validateAll)(scheama_1.allSchemaId), modelControl_1.modelController, dailyReport_controller_1.updateDailyReportHandler);
dailyReportRoute.delete("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["delete"]), (0, validator_1.validateAll)(scheama_1.allSchemaId), modelControl_1.modelController, dailyReport_controller_1.deleteDailyReportHandler);
// dailyReportRoute.get(
//   "/by-date/:page",
//   validateToken,
//   hasAnyPermit(["view"]),
//   modelController,
//   getDailyReportByDateHandler
// );
exports.default = dailyReportRoute;
