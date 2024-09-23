"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fuelIn_controller_1 = require("../controller/fuelIn.controller");
const modelControl_1 = require("../middleware/modelControl");
const permitValidator_1 = require("../middleware/permitValidator");
const roleValidator_1 = require("../middleware/roleValidator");
const validator_1 = require("../middleware/validator");
const scheama_1 = require("../schema/scheama");
const fuelInRoute = require("express").Router();
fuelInRoute.get("/pagi/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, fuelIn_controller_1.getFuelInHandler);
fuelInRoute.get("/pagi/by-date/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, fuelIn_controller_1.getFuelInByDateHandler);
fuelInRoute.get("/without-pagi/by-date/", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), modelControl_1.modelController, fuelIn_controller_1.getFuelInWithoutPagiByDateHandler);
fuelInRoute.post("/", 
// validateToken,
// roleValidator(["manager", "det"]), //In that one role is manager
// hasAnyPermit(["add"]),
(0, validator_1.validateAll)(scheama_1.fuelInSchema), 
// modelController,
modelControl_1.locSevModelControl, fuelIn_controller_1.addFuelInHandler);
fuelInRoute.post('/cloud/atg', (0, validator_1.validateAll)(scheama_1.fuelInSchema), modelControl_1.locSevModelControl, fuelIn_controller_1.addAtgFuelInHandler);
fuelInRoute.patch("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["manager", "det"]), (0, permitValidator_1.hasAnyPermit)(["edit"]), (0, validator_1.validateAll)(scheama_1.allSchemaId), modelControl_1.modelController, fuelIn_controller_1.updateFuelInHandler);
fuelInRoute.delete("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["manager", "det"]), (0, permitValidator_1.hasAnyPermit)(["delete"]), (0, validator_1.validateAll)(scheama_1.allSchemaId), modelControl_1.modelController, fuelIn_controller_1.deleteFuelInHandler);
exports.default = fuelInRoute;
