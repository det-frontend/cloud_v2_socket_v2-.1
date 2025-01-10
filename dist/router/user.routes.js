"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRoute = require("express").Router();
const permitValidator_1 = require("../middleware/permitValidator");
const roleValidator_1 = require("../middleware/roleValidator");
const validator_1 = require("../middleware/validator");
const user_controller_1 = require("../controller/user.controller");
const scheama_1 = require("../schema/scheama");
//register user
userRoute.post("/register", (0, validator_1.validateAll)(scheama_1.createUserSchema), user_controller_1.registerUserHandler);
//login user
userRoute.post("/login", (0, validator_1.validateAll)(scheama_1.loginUserSchema), user_controller_1.loginUserHandler);
//update
userRoute.patch("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["edit"]), user_controller_1.updateUserHandler);
//getuser
userRoute.get("/", user_controller_1.getUserHandler);
userRoute.get('/station/:id', user_controller_1.getStationUserHandler);
//delete each user
userRoute.delete("/", validator_1.validateToken, (0, roleValidator_1.roleValidator)(["det", "admin"]), (0, permitValidator_1.hasAnyPermit)(["delete"]), user_controller_1.deleteUserHandler);
//admin routes
//beware deleting all user route
userRoute.delete("/admin", validator_1.validateToken, user_controller_1.deleteUserHandler);
userRoute.get("/admin", validator_1.validateToken, user_controller_1.getUserByAdminHandler);
//adding role in user
userRoute.patch("/add/role", validator_1.validateToken, (0, validator_1.validateAll)(scheama_1.userRoleSchema), (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["add"]), user_controller_1.userAddRoleHandler);
userRoute.patch("/remove/role", validator_1.validateToken, (0, validator_1.validateAll)(scheama_1.userRoleSchema), (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["delete"]), user_controller_1.userRemoveRoleHandler);
//adding permit in user
userRoute.patch("/add/permit", validator_1.validateToken, (0, validator_1.validateAll)(scheama_1.userPermitSchema), (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["add"]), user_controller_1.userAddPermitHandler);
userRoute.patch("/remove/permit", validator_1.validateToken, (0, validator_1.validateAll)(scheama_1.userPermitSchema), (0, roleValidator_1.roleValidator)(["det"]), (0, permitValidator_1.hasAnyPermit)(["delete"]), user_controller_1.userRemovePermitHandler);
exports.default = userRoute;
