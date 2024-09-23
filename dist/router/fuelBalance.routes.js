"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fuelBalance_controller_1 = require("../controller/fuelBalance.controller");
const modelControl_1 = require("../middleware/modelControl");
const permitValidator_1 = require("../middleware/permitValidator");
const roleValidator_1 = require("../middleware/roleValidator");
const validator_1 = require("../middleware/validator");
const scheama_1 = require("../schema/scheama");
const fuelBalanceRoute = require("express").Router();
fuelBalanceRoute.get("/all", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, fuelBalance_controller_1.getAllFuelBalanceHandler);
fuelBalanceRoute.get("/pagi/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, fuelBalance_controller_1.getFuelBalanceHandler);
fuelBalanceRoute.get("/without-pagi/by-date", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, fuelBalance_controller_1.getFuelBalanceWithoutPagiHandler);
fuelBalanceRoute.get("/by-date", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, fuelBalance_controller_1.getFuelBalanceByDateHandler);
fuelBalanceRoute.post("/", validator_1.validateToken, (0, validator_1.validateAll)(scheama_1.fuelBalanceSchema), 
// roleValidator(["det"]),
// hasAnyPermit(["add"]),
modelControl_1.modelController, fuelBalance_controller_1.addFuelBalanceHandler);
fuelBalanceRoute.patch("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["edit"]), modelControl_1.modelController, fuelBalance_controller_1.updateFuelBalanceHandler);
fuelBalanceRoute.delete("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["delete"]), modelControl_1.modelController, fuelBalance_controller_1.deleteFuelBalanceHandler);
exports.default = fuelBalanceRoute;
