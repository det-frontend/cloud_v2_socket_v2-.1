"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const casherCode_controller_1 = require("../controller/casherCode.controller");
const modelControl_1 = require("../middleware/modelControl");
const validator_1 = require("../middleware/validator");
const casherCodeRoute = require("express").Router();
casherCodeRoute.get("/", validator_1.validateToken, modelControl_1.modelController, casherCode_controller_1.getAllCasherCodeHandler);
exports.default = casherCodeRoute;
