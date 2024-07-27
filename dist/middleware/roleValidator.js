"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleValidator = void 0;
//if you want to access multi role change this like hasAnyRole
const roleValidator = (role) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let bol = false;
        for (let i = 0; i < role.length; i++) {
            let foundRole = yield ((_a = req.body.user[0].roles) === null || _a === void 0 ? void 0 : _a.find((ea) => ea.name == role[i]));
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
});
exports.roleValidator = roleValidator;
