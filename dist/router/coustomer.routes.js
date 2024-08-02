"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coustomer_controller_1 = require("../controller/coustomer.controller");
const permitValidator_1 = require("../middleware/permitValidator");
const validator_1 = require("../middleware/validator");
const coustomerRoute = require("express").Router();
coustomerRoute.get("/", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), coustomer_controller_1.getCoustomerHandler);
coustomerRoute.post("/", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["add"]), coustomer_controller_1.addCoustomerHandler);
coustomerRoute.delete("/", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["delete"]), coustomer_controller_1.deletCoustomerHandler);
coustomerRoute.get("/search", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), coustomer_controller_1.searchCoustomerHandler);
coustomerRoute.post("/local-create", validator_1.validateUser, coustomer_controller_1.addCoustomerHandler);
exports.default = coustomerRoute;