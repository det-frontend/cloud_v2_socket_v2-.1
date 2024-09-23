"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tankData_controller_1 = require("../controller/tankData.controller");
const modelControl_1 = require("../middleware/modelControl");
const permitValidator_1 = require("../middleware/permitValidator");
const validator_1 = require("../middleware/validator");
const scheama_1 = require("../schema/scheama");
const tankDataRouter = require("express").Router();
tankDataRouter.post("/", 
// validateToken,
(0, validator_1.validateAll)(scheama_1.tankDataSchema), modelControl_1.locSevModelControl, tankData_controller_1.addTankDataController);
tankDataRouter.get("/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, tankData_controller_1.getAllTankDataController);
tankDataRouter.get("/by-date/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, tankData_controller_1.getTankDataByDate);
tankDataRouter.get("/without-pagi/by-date", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, tankData_controller_1.getTankDataWithoutPagiByDate);
tankDataRouter.delete("/", validator_1.validateToken, 
// roleValidator(["det"]),
(0, permitValidator_1.hasAnyPermit)(["delete"]), modelControl_1.modelController, tankData_controller_1.deleteTankDataIdController);
tankDataRouter.patch("/", validator_1.validateToken, 
// roleValidator(["det"]),
(0, permitValidator_1.hasAnyPermit)(["edit"]), modelControl_1.modelController, tankData_controller_1.updateTankDataController);
exports.default = tankDataRouter;
