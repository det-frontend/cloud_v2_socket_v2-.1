"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleValidator = void 0;
//if you want to access multi role change this like hasAnyRole
const roleValidator = (role) => async (req, res, next) => {
    try {
        let bol = false;
        for (let i = 0; i < role.length; i++) {
            let foundRole = await req.body.user[0].roles?.find((ea) => ea.name == role[i]);
            if (foundRole) {
                bol = true;
                break;
            }
        }
        if (!bol)
            return next(new Error("You dont have enough role"));
        next();
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.roleValidator = roleValidator;
