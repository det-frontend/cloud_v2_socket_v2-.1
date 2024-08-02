"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDebtDatePagiHandler = exports.deleteDebtHandler = exports.updateDebtHandler = exports.addDebtHandler = exports.getDebtHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const debt_service_1 = require("../service/debt.service");
const coustomer_service_1 = require("../service/coustomer.service");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const test = "test";
const getDebtHandler = async (req, res, next) => {
    try {
        let pageNo = Number(req.params.page);
        let { data, count } = await (0, debt_service_1.DebtPaginate)(pageNo, req.query);
        (0, helper_1.default)(res, "Debt are here", data, test, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getDebtHandler = getDebtHandler;
const addDebtHandler = async (req, res, next) => {
    try {
        // console.log("add new debt");
        const cuurentDateForVocono = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("DDMMYYYY");
        const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
        if (!req.body.couObjId)
            throw new Error("you need customer id");
        let coustomerConditon = await (0, coustomer_service_1.getCoustomerById)(req.body.couObjId);
        if (!coustomerConditon)
            throw new Error("There is no coustomer with that name");
        if (req.body.deposit) {
            let count = await (0, debt_service_1.countDebt)({ dateOfDay: currentDate });
            req.body.vocono = `paid/${cuurentDateForVocono}/${count}`;
            req.body.paided = true;
            let result = await (0, debt_service_1.addDebt)(req.body);
            // // console.log(result);
            // console.log(coustomerConditon);
            let newUpdateDebt = await (0, debt_service_1.getDebt)({
                couObjId: coustomerConditon._id,
                paided: false,
            });
            paidedHandler(newUpdateDebt, result.deposit);
            // console.log(newUpdateDebt);
            // console.log(data);
            coustomerConditon.cou_debt = coustomerConditon.cou_debt + result.deposit;
            await (0, coustomer_service_1.updateCoustomer)(result.couObjId, coustomerConditon);
            (0, helper_1.default)(res, "New Debt data was added", result);
        }
        if (req.body.credit) {
            if (!req.body.vocono)
                throw new Error("You need to add vocono ");
            let approvVocono = await (0, debt_service_1.getDebt)({ vocono: req.body.vocono });
            if (!approvVocono)
                throw new Error("There is no vocono with that number");
            let debtBody = {
                stationDetailId: approvVocono[0].stationDetailId,
                vocono: req.body.vocono,
                couObjId: approvVocono[0].couObjId,
                deposit: 0,
                credit: approvVocono[0].credit,
                liter: approvVocono[0].liter,
            };
            coustomerConditon.cou_debt =
                coustomerConditon.cou_debt + approvVocono[0].credit;
            let addResutl = await (0, debt_service_1.addDebt)(debtBody);
            await (0, coustomer_service_1.updateCoustomer)(req.body.couObjId, coustomerConditon);
            (0, helper_1.default)(res, "New Debt data was added", addResutl);
        }
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addDebtHandler = addDebtHandler;
const updateDebtHandler = async (req, res, next) => {
    try {
        let result = await (0, debt_service_1.updateDebt)(req.query, req.body);
        (0, helper_1.default)(res, "updated Debt data", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.updateDebtHandler = updateDebtHandler;
const deleteDebtHandler = async (req, res, next) => {
    try {
        await (0, debt_service_1.deleteDebt)(req.query);
        (0, helper_1.default)(res, "Debt data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deleteDebtHandler = deleteDebtHandler;
const getDebtDatePagiHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        let pageNo = Number(req.params.page);
        delete req.query.sDate;
        delete req.query.eDate;
        let query = req.query;
        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }
        //if date error ? you should use split with T or be sure detail Id
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let { data, count } = await (0, debt_service_1.detailSaleByDateAndPagi)(query, startDate, endDate, pageNo);
        (0, helper_1.default)(res, "debt between two date", data, test, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getDebtDatePagiHandler = getDebtDatePagiHandler;
let paidedHandler = async (arr, limitAmount) => {
    let cacualatedCredit = 0;
    for (const ea of arr) {
        cacualatedCredit += ea.credit;
        if (cacualatedCredit <= limitAmount) {
            ea.paided = true;
            await (0, debt_service_1.updateDebt)({ _id: ea._id }, { paided: ea.paided });
        }
        else {
            break;
        }
    }
};
