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
const getDebtHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageNo = Number(req.params.page);
        let { data, count } = yield (0, debt_service_1.DebtPaginate)(pageNo, req.query);
        (0, helper_1.default)(res, "Debt are here", data, test, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getDebtHandler = getDebtHandler;
const addDebtHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("add new debt");
        const cuurentDateForVocono = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("DDMMYYYY");
        const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
        if (!req.body.couObjId)
            throw new Error("you need customer id");
        let coustomerConditon = yield (0, coustomer_service_1.getCoustomerById)(req.body.couObjId);
        if (!coustomerConditon)
            throw new Error("There is no coustomer with that name");
        if (req.body.deposit) {
            let count = yield (0, debt_service_1.countDebt)({ dateOfDay: currentDate });
            req.body.vocono = `paid/${cuurentDateForVocono}/${count}`;
            req.body.paided = true;
            let result = yield (0, debt_service_1.addDebt)(req.body);
            // // console.log(result);
            // console.log(coustomerConditon);
            let newUpdateDebt = yield (0, debt_service_1.getDebt)({
                couObjId: coustomerConditon._id,
                paided: false,
            });
            paidedHandler(newUpdateDebt, result.deposit);
            // console.log(newUpdateDebt);
            // console.log(data);
            coustomerConditon.cou_debt = coustomerConditon.cou_debt + result.deposit;
            yield (0, coustomer_service_1.updateCoustomer)(result.couObjId, coustomerConditon);
            (0, helper_1.default)(res, "New Debt data was added", result);
        }
        if (req.body.credit) {
            if (!req.body.vocono)
                throw new Error("You need to add vocono ");
            let approvVocono = yield (0, debt_service_1.getDebt)({ vocono: req.body.vocono });
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
            let addResutl = yield (0, debt_service_1.addDebt)(debtBody);
            yield (0, coustomer_service_1.updateCoustomer)(req.body.couObjId, coustomerConditon);
            (0, helper_1.default)(res, "New Debt data was added", addResutl);
        }
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addDebtHandler = addDebtHandler;
const updateDebtHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, debt_service_1.updateDebt)(req.query, req.body);
        (0, helper_1.default)(res, "updated Debt data", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.updateDebtHandler = updateDebtHandler;
const deleteDebtHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, debt_service_1.deleteDebt)(req.query);
        (0, helper_1.default)(res, "Debt data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deleteDebtHandler = deleteDebtHandler;
const getDebtDatePagiHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        let { data, count } = yield (0, debt_service_1.detailSaleByDateAndPagi)(query, startDate, endDate, pageNo);
        (0, helper_1.default)(res, "debt between two date", data, test, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getDebtDatePagiHandler = getDebtDatePagiHandler;
let paidedHandler = (arr, limitAmount) => __awaiter(void 0, void 0, void 0, function* () {
    let cacualatedCredit = 0;
    for (const ea of arr) {
        cacualatedCredit += ea.credit;
        if (cacualatedCredit <= limitAmount) {
            ea.paided = true;
            yield (0, debt_service_1.updateDebt)({ _id: ea._id }, { paided: ea.paided });
        }
        else {
            break;
        }
    }
});
