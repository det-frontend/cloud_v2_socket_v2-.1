"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAnyPermit = void 0;
const hasAnyPermit = (permits) => (req, res, next) => {
    try {
        let bol = false;
        for (let i = 0; i < permits.length; i++) {
            let hasPermit = req.body.user[0].permits.find((ea) => ea.name == permits[i]);
            if (hasPermit) {
                bol = true;
                break;
            }
        }
        if (!bol)
            return next(new Error("You have not that permit"));
        next();
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.hasAnyPermit = hasAnyPermit;
