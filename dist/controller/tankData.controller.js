"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTankDataController = exports.deleteTankDataIdController = exports.getTankDataWithoutPagiByDate = exports.getTankDataByDate = exports.getAllTankDataController = exports.addTankDataController = void 0;
const tankData_service_1 = require("../service/tankData.service");
const helper_1 = __importStar(require("../utils/helper"));
const fuelBalance_service_1 = require("../service/fuelBalance.service");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const stockBalance_service_1 = require("../service/stockBalance.service");
const addTankDataController = async (req, res, next) => {
    const currentDate = (0, moment_timezone_1.default)().format("YYYY-MM-DD");
    const previousDate = (0, moment_timezone_1.default)()
        .tz("Asia/Yangon")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
    try {
        let model = req.body.accessDb;
        let stationId = req.body.stationDetailId;
        let tankData = await (0, tankData_service_1.getTankData)({
            stationDetailId: stationId,
            dailyReportDate: (0, moment_timezone_1.default)().format("YYYY-MM-DD"),
        }, model);
        if (tankData.length == 0) {
            await (0, tankData_service_1.addTankDataService)(req.body, model);
        }
        else {
            await (0, tankData_service_1.updateExistingTankData)(tankData[0]._id, req.body, model);
        }
        //find fuel balance
        let fuelBalanceLatest = await (0, fuelBalance_service_1.fuelBalanceForStockBalance)(currentDate, stationId, model);
        //find yesterday Tank
        let yesterdayTank = await (0, tankData_service_1.latestTankDataByStationId)({
            stationDetailId: req.body.stationDetailId,
            dailyReportDate: previousDate,
        }, model);
        // console.log(fuelBalanceLatest, yesterdayTank)
        //realtime tank opening
        const datas = req.body.data;
        // console.log(datas, "...............................")
        let yesterdayDatas = [];
        if (yesterdayTank.length == 1) {
            yesterdayDatas = yesterdayTank[0].data;
        }
        else {
            yesterdayDatas = [];
        }
        console.log("gg");
        const todayTankData = await (0, helper_1.realTankCalculationForStockBalance)(datas);
        //realtime tank opening
        console.log("wkkkkkkkkkkkkkkkkk");
        //yesterday tank opening
        const yesterdayTankData = await (0, helper_1.realTankCalculationForStockBalance)(yesterdayDatas);
        // yesterday tank opening
        // console.log(todayTankData, yesterdayTankData, "..............................");
        // console.log(fuelBalanceLatest,"wk....");
        //fuel balance opening
        const { ron92_opening, ron92_cash, ron92_balance, ron92_receive, ron95_opening, ron95_cash, ron95_balance, ron95_receive, diesel_opening, diesel_cash, diesel_balance, diesel_receive, pDiesel_opening, pDiesel_cash, pDiesel_balance, pDiesel_receive, } = (0, helper_1.fuelBalanceCalculationForStockBalance)(fuelBalanceLatest);
        // console.log(
        //   ron92_opening,
        //   ron92_cash,
        //   ron92_balance,
        //   ron92_receive,
        //   ron95_opening,
        //   ron95_cash,
        //   ron95_balance,
        //   ron95_receive,
        //   diesel_opening,
        //   diesel_cash,
        //   diesel_balance,
        //   diesel_receive,
        //   pDiesel_opening,
        //   pDiesel_cash,
        //   pDiesel_balance,
        //   pDiesel_receive
        // );
        const pureData92 = {
            stationId: req.body.stationDetailId,
            tank: "001-Octane Ron(92)",
            opening: ron92_opening.toFixed(3),
            receive: ron92_receive,
            issue: ron92_cash.toFixed(3),
            adjust: 0,
            balance: ron92_balance.toFixed(3),
            todayTank: todayTankData.ron92.toFixed(3),
            yesterdayTank: yesterdayTankData.ron92.toFixed(3),
            totalIssue: (yesterdayTankData.ron92 - todayTankData.ron92).toFixed(3),
            todayGL: (ron92_cash -
                (yesterdayTankData.ron92 - todayTankData.ron92)).toFixed(3),
            totalGL: 0,
            accessDb: "kyaw_san",
            realTime: currentDate,
        };
        const pureData95 = {
            stationId: req.body.stationDetailId,
            tank: "002-Octane Ron(95)",
            opening: ron95_opening.toFixed(3),
            receive: ron95_receive,
            issue: ron95_cash.toFixed(3),
            adjust: 0,
            balance: ron95_balance.toFixed(3),
            todayTank: todayTankData.ron95.toFixed(3),
            yesterdayTank: yesterdayTankData.ron95.toFixed(3),
            totalIssue: (yesterdayTankData.ron95 - todayTankData.ron95).toFixed(3),
            todayGL: (ron95_cash -
                (yesterdayTankData.ron95 - todayTankData.ron95)).toFixed(3),
            totalGL: 0,
            accessDb: "kyaw_san",
            realTime: currentDate,
        };
        const pureDiesel = {
            stationId: req.body.stationDetailId,
            tank: "004-Diesel",
            opening: diesel_opening.toFixed(3),
            receive: diesel_receive,
            issue: diesel_cash.toFixed(3),
            adjust: 0,
            balance: diesel_balance.toFixed(3),
            todayTank: todayTankData.diesel.toFixed(3),
            yesterdayTank: yesterdayTankData.diesel.toFixed(3),
            totalIssue: (yesterdayTankData.diesel - todayTankData.diesel).toFixed(3),
            todayGL: (diesel_cash -
                (yesterdayTankData.diesel - todayTankData.diesel)).toFixed(3),
            totalGL: 0,
            accessDb: "kyaw_san",
            realTime: currentDate,
        };
        const pureSuperDiesel = {
            stationId: req.body.stationDetailId,
            tank: "005-Premium Diesel",
            opening: pDiesel_opening.toFixed(3),
            receive: pDiesel_receive,
            issue: pDiesel_cash.toFixed(3),
            adjust: 0,
            balance: pDiesel_balance.toFixed(3),
            todayTank: todayTankData.pDiesel.toFixed(3),
            yesterdayTank: yesterdayTankData.pDiesel.toFixed(3),
            totalIssue: (yesterdayTankData.pDiesel - todayTankData.pDiesel).toFixed(3),
            todayGL: (pDiesel_cash -
                (yesterdayTankData.pDiesel - todayTankData.pDiesel)).toFixed(3),
            totalGL: 0,
            accessDb: "kyaw_san",
            realTime: currentDate,
        };
        const isToday = await (0, stockBalance_service_1.findStockBalanceByDateService)({ realTime: currentDate }, model);
        // console.log("====================================");
        // console.log(isToday);
        // console.log("====================================");
        if (isToday.length === 0) {
            const dataWeMustSave = [
                pureData92,
                pureData95,
                pureDiesel,
                pureSuperDiesel,
            ];
            dataWeMustSave.forEach(async (data, index) => {
                const result = await (0, stockBalance_service_1.addStockBalanceService)(data, model);
            });
        }
        else {
            const result_1 = await (0, stockBalance_service_1.findByoneAndUpdateMany)({ tank: "001-Octane Ron(92)", realTime: currentDate }, pureData92, model);
            if (!result_1)
                return next(new Error(result_1));
            const result_2 = await (0, stockBalance_service_1.findByoneAndUpdateMany)({ tank: "002-Octane Ron(95)", realTime: currentDate }, pureData95, model);
            if (!result_2)
                return next(new Error(result_2));
            const result_3 = await (0, stockBalance_service_1.findByoneAndUpdateMany)({ tank: "005-Premium Diesel", realTime: currentDate }, pureSuperDiesel, model);
            if (!result_3)
                return next(new Error(result_3));
            const result_4 = await (0, stockBalance_service_1.findByoneAndUpdateMany)({ tank: "004-Diesel", realTime: currentDate }, pureDiesel, model);
            if (!result_4)
                return next(new Error(result_4));
            (0, helper_1.default)(res, "Tank data update is successful!", result_4);
        }
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addTankDataController = addTankDataController;
const getAllTankDataController = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let pageNo = Number(req.params.page);
        let result = await (0, tankData_service_1.getAllTankDataService)(model, pageNo);
        (0, helper_1.default)(res, "All is tank data", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getAllTankDataController = getAllTankDataController;
const getTankDataByDate = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let pageNo = Number(req.params.page);
        delete req.query.sDate;
        let query = req.query;
        if (!query.dailyReportDate) {
            throw new Error("you need date");
        }
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        delete req.query.accessDb;
        const startDate = new Date(sDate);
        let { data, count } = await (0, tankData_service_1.tankDataByDate)(query, startDate, pageNo, model);
        (0, helper_1.default)(res, "tank", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getTankDataByDate = getTankDataByDate;
const getTankDataWithoutPagiByDate = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        delete req.query.sDate;
        let query = req.query;
        if (!query.dailyReportDate) {
            throw new Error("you need date");
        }
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        delete req.query.accessDb;
        const startDate = new Date(sDate);
        // Call tankDataByDate without pageNo (since pagination is removed)
        let { data, count } = await (0, tankData_service_1.tankDataWithoutPagiByDate)(query, startDate, model);
        (0, helper_1.default)(res, "tank", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getTankDataWithoutPagiByDate = getTankDataWithoutPagiByDate;
const deleteTankDataIdController = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, tankData_service_1.deleteTankDataById)(req.query, model);
        if (!result)
            throw new Error("Tank data delete is failed!");
        (0, helper_1.default)(res, "Tank Data was deleted!");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deleteTankDataIdController = deleteTankDataIdController;
const updateTankDataController = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, tankData_service_1.updateTankDataService)(req.query, req.body, model);
        (0, helper_1.default)(res, "Updated tank data!", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.updateTankDataController = updateTankDataController;
