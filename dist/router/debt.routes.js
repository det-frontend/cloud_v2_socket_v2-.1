"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debt_controller_1 = require("../controller/debt.controller");
const permitValidator_1 = require("../middleware/permitValidator");
const validator_1 = require("../middleware/validator");
const debtRoute = require("express").Router();
debtRoute.get("/:page", debt_controller_1.getDebtHandler);
debtRoute.get("/pagi/by-date/:page", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["view"]), debt_controller_1.getDebtDatePagiHandler);
debtRoute.post("/", 
// validateToken, hasAnyPermit(["add"]),
debt_controller_1.addDebtHandler);
debtRoute.post("/local-create", validator_1.validateUser, debt_controller_1.addDebtHandler);
debtRoute.patch("/", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["edit"]), debt_controller_1.updateDebtHandler);
debtRoute.delete("/", validator_1.validateToken, (0, permitValidator_1.hasAnyPermit)(["delete"]), debt_controller_1.deleteDebtHandler);
exports.default = debtRoute;
