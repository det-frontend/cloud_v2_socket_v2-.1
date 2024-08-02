"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateToken = exports.validateAll = void 0;
const helper_1 = require("../utils/helper");
const user_service_1 = require("../service/user.service");
const validateAll = (schema) => async (req, res, next) => {
    try {
        let result = await schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (e) {
        return next(new Error(e.errors[0].message));
    }
};
exports.validateAll = validateAll;
const validateToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(new Error("invalid token"));
        }
        try {
            let decoded = (0, helper_1.checkToken)(token);
            let user = await (0, user_service_1.getUser)({ _id: decoded._id });
            req.body.user = user;
        }
        catch (e) {
            return next(new Error(e));
        }
        next();
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.validateToken = validateToken;
const validateUser = async (req, res, next) => {
    try {
        let [email, password] = await (0, user_service_1.getCredentialUser)({ email: req.body.email });
        if (!email || !(0, helper_1.compass)(req.body.password, password)) {
            throw new Error("Creditial Error");
        }
        next();
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.validateUser = validateUser;
