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
exports.getDailyReportDateForEachDayHandler = exports.calcualteDatasForEachDayHanlder = exports.sevenDayPreviousTotalHandler = exports.calculateStationTotalHandler = exports.calculateCategoriesTotalHandler = exports.calculateTotalPerDayHandler = exports.statementReportHandler = exports.getDetailSaleDatePagiHandler = exports.getDetailSaleByDateHandler = exports.deleteDetailSaleHandler = exports.updateDetailSaleHandler = exports.addDetailSaleHandler = exports.getDetailSaleHandler = void 0;
const helper_1 = __importStar(require("../utils/helper"));
const detailSale_service_1 = require("../service/detailSale.service");
const fuelBalance_service_1 = require("../service/fuelBalance.service");
const dailyReport_service_1 = require("../service/dailyReport.service");
const stationDetail_service_1 = require("../service/stationDetail.service");
const mongodb_1 = require("mongodb");
const collection_service_1 = require("../service/collection.service");
const getDetailSaleHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageNo = Number(req.params.page);
        if (!pageNo)
            throw new Error("You need page number");
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let { data, count } = yield (0, detailSale_service_1.detailSalePaginate)(pageNo, req.query, model);
        (0, helper_1.default)(res, "DetailSale are here", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getDetailSaleHandler = getDetailSaleHandler;
const addDetailSaleHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // //that is remove after pos updated
        let model = req.body.accessDb;
        // console.log(req.body, "this is req.body");
        let check = yield (0, detailSale_service_1.getDetailSale)({ vocono: req.body.vocono }, model);
        //console.log(check);
        if (check.length != 0) {
            (0, helper_1.default)(res);
            return;
        }
        let result = yield (0, detailSale_service_1.addDetailSale)(req.body, model);
        // next update code
        // if (result.cashType == "Debt") {
        //   // let checkVocono = await getDebt({ vocono: result.vocono });
        //   // if (checkVocono.length > 0)
        //   //   throw new Error("this vocono is alreadly exist");
        //   let coustomerConditon = await getCoustomerById(result.couObjId);
        //   if (!coustomerConditon)
        //     throw new Error("There is no coustomer with that name");
        //   let debtBody = {
        //     stationDetailId: result.stationDetailId,
        //     vocono: result.vocono,
        //     couObjId: result.couObjId,
        //     deposit: 0,
        //     credit: result.totalPrice,
        //     liter: result.saleLiter,
        //   };
        //   coustomerConditon.cou_debt =
        //     coustomerConditon.cou_debt + result.totalPrice;
        //   await addDebt(debtBody);
        //   await updateCoustomer(result.couObjId, coustomerConditon);
        // }
        //caculation
        // console.log("wkkk");
        let checkDate = yield (0, fuelBalance_service_1.getFuelBalance)({
            stationId: result.stationDetailId,
            createAt: result.dailyReportDate,
        }, model);
        let checkRpDate = yield (0, dailyReport_service_1.getDailyReport)({
            stationId: result.stationDetailId,
            dateOfDay: result.dailyReportDate,
        }, model);
        if (checkRpDate.length == 0) {
            yield (0, dailyReport_service_1.addDailyReport)({
                stationId: result.stationDetailId,
                dateOfDay: result.dailyReportDate,
            }, model);
        }
        let station = yield (0, stationDetail_service_1.getStationDetail)({
            _id: result.stationDetailId,
        }, model);
        // console.log('station', station);
        const tankCount = station[0].tankCount;
        if (checkDate.length == 0) {
            let prevDate = (0, helper_1.previous)(new Date(req.body.dailyReportDate));
            let prevResult = yield (0, fuelBalance_service_1.getFuelBalance)({
                stationId: result.stationDetailId,
                // createAt: prevDate,
            }, model, tankCount);
            // get tank count from stationDetail
            // console.log('tankCount', tankCount);
            //.slice(0, 4)
            yield Promise.all(prevResult === null || prevResult === void 0 ? void 0 : prevResult.map((ea) => __awaiter(void 0, void 0, void 0, function* () {
                let obj;
                if (ea.balance == 0) {
                    obj = {
                        stationId: ea.stationId,
                        fuelType: ea.fuelType,
                        capacity: ea.capacity,
                        opening: ea.opening + ea.fuelIn,
                        tankNo: ea.tankNo,
                        createAt: result.dailyReportDate,
                        nozzles: ea.nozzles,
                        balance: ea.opening + ea.fuelIn,
                    };
                }
                else {
                    obj = {
                        stationId: ea.stationId,
                        fuelType: ea.fuelType,
                        capacity: ea.capacity,
                        opening: ea.opening + ea.fuelIn - ea.cash,
                        tankNo: ea.tankNo,
                        createAt: req.body.dailyReportDate,
                        nozzles: ea.nozzles,
                        balance: ea.opening + ea.fuelIn - ea.cash,
                    };
                }
                yield (0, fuelBalance_service_1.addFuelBalance)(obj, model);
            })));
        }
        yield (0, fuelBalance_service_1.calcFuelBalance)({
            stationId: result.stationDetailId,
            fuelType: result.fuelType,
            createAt: result.dailyReportDate,
        }, { liter: result.saleLiter }, result.nozzleNo, model);
        (0, helper_1.default)(res, "New DetailSale data was added", result);
    }
    catch (e) {
        // console.log(e);
        next(new Error(e));
    }
});
exports.addDetailSaleHandler = addDetailSaleHandler;
const updateDetailSaleHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let result = yield (0, detailSale_service_1.updateDetailSale)(req.query, req.body, model);
        (0, helper_1.default)(res, "updated DetailSale data", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.updateDetailSaleHandler = updateDetailSaleHandler;
const deleteDetailSaleHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        yield (0, detailSale_service_1.deleteDetailSale)(req.query, model);
        (0, helper_1.default)(res, "DetailSale data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deleteDetailSaleHandler = deleteDetailSaleHandler;
// //get detail sale between two date
const getDetailSaleByDateHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        delete req.query.greater;
        delete req.query.amount;
        let query = req.query;
        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        //if date error ? you should use split with T or be sure detail Id
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let result = yield (0, detailSale_service_1.detailSaleByDate)(query, startDate, endDate, model);
        (0, helper_1.default)(res, "detail sale between two date", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getDetailSaleByDateHandler = getDetailSaleByDateHandler;
const getDetailSaleDatePagiHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        let pageNo = Number(req.params.page);
        const greater = req.query.greate;
        const amount = parseInt(req.query.amount);
        delete req.query.sDate;
        delete req.query.eDate;
        delete req.query.greate;
        delete req.query.amount;
        let query = req.query;
        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        //if date error ? you should use split with T or be sure detail Id
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let { data, count } = yield (0, detailSale_service_1.detailSaleByDateAndPagi)(query, startDate, endDate, pageNo, greater, amount, model);
        (0, helper_1.default)(res, "detail sale between two date", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getDetailSaleDatePagiHandler = getDetailSaleDatePagiHandler;
const statementReportHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        let query = req.query;
        if (!req.query.stationDetailId)
            throw new Error("you need stataion");
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let stationDetail = yield (0, stationDetail_service_1.getStationDetail)({
            _id: req.query.stationDetailId,
        }, model);
        let finalData = [];
        for (let i = 1; i <= stationDetail[0].nozzleCount; i++) {
            let noz = i.toString().padStart(2, "0");
            query = Object.assign(Object.assign({}, query), { nozzleNo: noz });
            // let result = await detailSaleByDate(query, startDate, endDate, model);
            const value = yield (0, detailSale_service_1.detailSaleByDate)(query, startDate, endDate, model);
            let result = value.reverse();
            let count = result.length;
            if (count == 0) {
                query = Object.assign(Object.assign({}, query), { nozzleNo: noz });
                let lastData = yield (0, detailSale_service_1.getLastDetailSale)(query, model);
                // console.log(
                //   lastData,
                //   "this is last Data....................................................."
                // );
                if (lastData) {
                    let data = {
                        stationId: stationDetail[0].name,
                        station: stationDetail,
                        nozzle: noz,
                        price: "0",
                        fuelType: lastData === null || lastData === void 0 ? void 0 : lastData.fuelType,
                        totalizer_opening: lastData === null || lastData === void 0 ? void 0 : lastData.devTotalizar_liter,
                        totalizer_closing: lastData === null || lastData === void 0 ? void 0 : lastData.devTotalizar_liter,
                        totalizer_different: 0,
                        totalSaleLiter: 0,
                        totalSalePrice: 0,
                        other: 0,
                        pumptest: 0,
                    };
                    finalData.push(data);
                }
                else {
                    let data = {
                        stationId: stationDetail[0].name,
                        station: stationDetail,
                        nozzle: noz,
                        price: "0",
                        fuelType: "-",
                        totalizer_opening: "0",
                        totalizer_closing: "0",
                        totalizer_different: 0,
                        totalSaleLiter: 0,
                        totalSalePrice: 0,
                        other: 0,
                        pumptest: 0,
                    };
                    finalData.push(data);
                }
                // return;
            }
            else {
                let totalSaleLiter = result
                    .map((ea) => ea["saleLiter"])
                    .reduce((pv, cv) => pv + cv, 0);
                let totalSalePrice = result
                    .map((ea) => ea["totalPrice"])
                    .reduce((pv, cv) => pv + cv, 0);
                let pumptest = result
                    .filter((ea) => ea.vehicleType == "Pump Test")
                    .map((ea) => ea.totalPrice)
                    .reduce((pv, cv) => pv + cv, 0);
                // console.log(
                //   result[0].devTotalizar_liter,
                //   result[count - 1].devTotalizar_liter,
                //   result[count - 1].salePrice
                // );
                let otherCalcu = (Number(result[count - 1].devTotalizar_liter -
                    (result[0].devTotalizar_liter - result[0].saleLiter)) - Number(totalSaleLiter - pumptest)).toFixed(3) || "0";
                let data = {
                    stationId: stationDetail[0].name,
                    station: stationDetail,
                    nozzle: noz,
                    fuelType: result[count - 1].fuelType,
                    price: result[count - 1].salePrice
                        ? result[count - 1].salePrice
                        : result[count - 2].salePrice,
                    totalizer_opening: Number((result[0].devTotalizar_liter - result[0].saleLiter).toFixed(3)),
                    totalizer_closing: Number(result[count - 1].devTotalizar_liter.toFixed(3)),
                    totalizer_different: Number(result[count - 1].devTotalizar_liter -
                        (result[0].devTotalizar_liter - result[0].saleLiter)).toFixed(3),
                    totalSaleLiter: Number((totalSaleLiter - pumptest).toFixed(3)),
                    totalSalePrice: Number(totalSalePrice.toFixed(3)),
                    other: Math.abs(Number(result[count - 1].devTotalizar_liter -
                        (result[0].devTotalizar_liter - result[0].saleLiter)) - Number((totalSaleLiter - pumptest).toFixed(3))),
                    pumptest: pumptest,
                };
                finalData.push(data);
            }
        }
        // console.log("0000000000");
        // console.log(finalData);
        // console.log("0000000000");
        (0, helper_1.default)(res, "final data", finalData, model);
    }
    catch (e) {
        console.log(e);
        next(new Error(e));
    }
});
exports.statementReportHandler = statementReportHandler;
const calculateTotalPerDayHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        if (req.query.totalVehicle) {
            const vehicleQuery = { createAt: { $gt: startDate, $lt: endDate } };
            const result = yield (0, detailSale_service_1.getTodayVechicleCount)(vehicleQuery, model);
            if (result)
                (0, helper_1.default)(res, "Total Vehicle", result, model);
        }
        else if (req.query.fuelType) {
            const vehicleQuery = {
                createAt: { $gt: startDate, $lt: endDate },
                fuelType: req.query.fuelType,
            };
            const result = yield (0, detailSale_service_1.sumTodayDatasService)(vehicleQuery, model);
            if (result)
                (0, helper_1.default)(res, `Total FuelType ${req.query.fuelType}`, result, model);
        }
        else {
            const vehicleQuery = { createAt: { $gt: startDate, $lt: endDate } };
            const result = yield (0, detailSale_service_1.sumTodayDatasService)(vehicleQuery, model);
            if (result)
                (0, helper_1.default)(res, "Total Today Sum", result, model);
        }
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.calculateTotalPerDayHandler = calculateTotalPerDayHandler;
const calculateCategoriesTotalHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let vehicleTypes = req.query.vehicleType;
        vehicleTypes = vehicleTypes.split(",");
        const vehicleQuery = {
            createAt: { $gt: startDate, $lt: endDate },
            vehicleType: { $in: vehicleTypes },
        };
        const result = yield (0, detailSale_service_1.sumTodayCategoryDatasService)(vehicleQuery, model);
        if (result)
            (0, helper_1.default)(res, "Total Vehicle", result, model);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.calculateCategoriesTotalHandler = calculateCategoriesTotalHandler;
const calculateStationTotalHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        const collection = yield (0, collection_service_1.collectionGet)({ collectionName: model });
        let stationIds = req.query.stations;
        const stationCollection = collection[0].stationCollection;
        const arryStationCollection = [];
        stationCollection.map((e) => {
            return arryStationCollection.push(new mongodb_1.ObjectId(e.stationId));
        });
        // stationIds = stationIds.split(',');
        // const stationDetailIds = [
        //   new ObjectId(stationIds[0]),
        //   new ObjectId(stationIds[1]),
        //   new ObjectId(stationIds[2]),
        //   new ObjectId(stationIds[3]),
        //   new ObjectId(stationIds[4]),
        //   new ObjectId(stationIds[5]),
        // ];
        const vehicleQuery = {
            createAt: { $gt: startDate, $lt: endDate },
            stationDetailId: { $in: arryStationCollection },
        };
        const result = yield (0, detailSale_service_1.sumTodayStationDatasService)(vehicleQuery, model);
        if (result)
            (0, helper_1.default)(res, "Total Stations", result, model);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.calculateStationTotalHandler = calculateStationTotalHandler;
const sevenDayPreviousTotalHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        function formatDate(date) {
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            return `${year}-${month}-${day}`;
        }
        function getDates(startDate, endDate) {
            const dates = [];
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(formatDate(new Date(currentDate)));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        }
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const datesArray = getDates(sevenDaysAgo, today);
        const query = { dailyReportDate: { $in: datesArray } };
        const result = yield (0, detailSale_service_1.sumTodayDatasService)(query, model);
        if (result)
            (0, helper_1.default)(res, "Total seven day", result, model);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.sevenDayPreviousTotalHandler = sevenDayPreviousTotalHandler;
const calcualteDatasForEachDayHanlder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
exports.calcualteDatasForEachDayHanlder = calcualteDatasForEachDayHanlder;
const getDailyReportDateForEachDayHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let pageNo = Number(req.params.page);
        let model = req.body.accessDb;
        const vehicleQuery = {
            createAt: { $gt: startDate, $lt: endDate },
            stationDetailId: new mongodb_1.ObjectId(`${req.query.stationDetailId}`),
        };
        let result = yield (0, detailSale_service_1.getDailyReportDateForEachDayService)(vehicleQuery, pageNo, model);
        (0, helper_1.default)(res, "Daily Report Date For EachDay", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getDailyReportDateForEachDayHandler = getDailyReportDateForEachDayHandler;
