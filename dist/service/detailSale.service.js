"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyReportDateForEachDayService = exports.sumSevenDayPrevious = exports.sumTodayStationDatasService = exports.sumTodayFuelTypeService = exports.sumTodayCategoryDatasService = exports.sumTodayDatasService = exports.getTodayVechicleCount = exports.getLastDetailSale = exports.detailSaleByDateAndPagi = exports.detailSaleByDate = exports.detailSalePaginate = exports.getDetailSaleByFuelType = exports.deleteDetailSale = exports.updateDetailSale = exports.addDetailSale = exports.getDetailSale = void 0;
const detailSale_model_1 = require("../model/detailSale.model");
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
const limitNo = config_1.default.get("page_limit");
const getDetailSale = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
        return await selectedModel
            .find(query)
            .populate({
            path: "stationDetailId",
            model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
        })
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getDetailSale = getDetailSale;
const addDetailSale = async (body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
        body.accessDb = dbModel;
        delete body._id;
        return await new selectedModel(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addDetailSale = addDetailSale;
const updateDetailSale = async (query, body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
        await selectedModel.updateMany(query, body);
        return await selectedModel.find(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateDetailSale = updateDetailSale;
const deleteDetailSale = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
        let DetailSale = await selectedModel.find(query);
        if (!DetailSale) {
            throw new Error("No DetailSale with that id");
        }
        return await selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteDetailSale = deleteDetailSale;
const getDetailSaleByFuelType = async (dateOfDay, 
// stationId : string,
fuelType, dbModel) => {
    let fuel = await (0, exports.getDetailSale)({
        dailyReportDate: dateOfDay,
        fuelType: fuelType,
    }, dbModel);
    let fuelLiter = fuel
        .map((ea) => ea["saleLiter"])
        .reduce((pv, cv) => pv + cv, 0);
    let fuelAmount = fuel
        .map((ea) => ea["totalPrice"])
        .reduce((pv, cv) => pv + cv, 0);
    return { count: fuel.length, liter: fuelLiter, price: fuelAmount };
};
exports.getDetailSaleByFuelType = getDetailSaleByFuelType;
const detailSalePaginate = async (pageNo, query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const data = await selectedModel
        .find(query)
        .sort({ createAt: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .populate({
        path: "stationDetailId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = await selectedModel.countDocuments(query);
    return { data, count };
};
exports.detailSalePaginate = detailSalePaginate;
const detailSaleByDate = async (query, d1, d2, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    const filter = {
        ...query,
        createAt: {
            $gt: d1,
            $lt: d2,
        },
    };
    let result = await selectedModel
        .find(filter)
        .sort({ createAt: -1 })
        .populate({
        path: "stationDetailId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    return result;
};
exports.detailSaleByDate = detailSaleByDate;
const detailSaleByDateAndPagi = async (query, d1, d2, pageNo, greater, amount, kyat, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
        console.log(amount, typeof (kyat), greater);
        if (amount) {
            if (kyat == "true") {
                if (greater === "greate") {
                    query.totalPrice = { $gt: amount };
                }
                else if (greater === "less") {
                    query.totalPrice = { $lt: amount };
                }
                else if (greater === "equal") {
                    query.totalPrice = { $eq: amount };
                }
            }
            else {
                if (greater === "greate") {
                    query.saleLiter = { $gt: amount };
                }
                else if (greater === "less") {
                    query.saleLiter = { $lt: amount };
                }
                else if (greater === "equal") {
                    query.saleLiter = { $eq: amount };
                }
            }
        }
        const reqPage = pageNo == 1 ? 0 : pageNo - 1;
        const skipCount = limitNo * reqPage;
        const filter = {
            ...query,
            createAt: {
                $gt: d1,
                $lt: d2,
            },
        };
        console.log(filter);
        const dataQuery = selectedModel
            .find(filter)
            .sort({ createAt: -1 })
            .skip(skipCount)
            .limit(limitNo)
            .populate({
            path: "stationDetailId",
            model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
        })
            .select("-__v");
        const countQuery = selectedModel.countDocuments(filter);
        const [data, count] = await Promise.all([dataQuery, countQuery]);
        // console.log(data);
        return { data, count };
    }
    catch (error) {
        console.error("Error in detailSaleByDateAndPagi:", error);
        throw error;
    }
};
exports.detailSaleByDateAndPagi = detailSaleByDateAndPagi;
const getLastDetailSale = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    return await selectedModel.findOne(query).sort({ _id: -1, createAt: -1 });
};
exports.getLastDetailSale = getLastDetailSale;
const getTodayVechicleCount = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    return await selectedModel.count(query);
};
exports.getTodayVechicleCount = getTodayVechicleCount;
const sumTodayDatasService = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    return await selectedModel.aggregate([
        {
            $match: query,
        },
        {
            $group: {
                _id: "$dailyReportDate",
                totalSaleLiter: {
                    $sum: "$saleLiter",
                },
                totalPrice: {
                    $sum: "$totalPrice",
                },
                count: { $sum: 1 },
            },
        },
    ]);
};
exports.sumTodayDatasService = sumTodayDatasService;
const sumTodayCategoryDatasService = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    return await selectedModel.aggregate([
        {
            $match: query,
        },
        {
            $group: {
                _id: "$vehicleType",
                totalSaleLiter: {
                    $sum: "$saleLiter",
                },
                totalPrice: {
                    $sum: "$totalPrice",
                },
            },
        },
    ]);
};
exports.sumTodayCategoryDatasService = sumTodayCategoryDatasService;
const sumTodayFuelTypeService = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    return await selectedModel.aggregate([
        {
            $match: query,
        },
        {
            $group: {
                _id: null,
                totalSaleLiter: {
                    $sum: "$saleLiter",
                },
                totalPrice: {
                    $sum: "$totalPrice",
                },
            },
        },
    ]);
};
exports.sumTodayFuelTypeService = sumTodayFuelTypeService;
const sumTodayStationDatasService = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    return await selectedModel.aggregate([
        {
            $match: query,
        },
        {
            $lookup: {
                from: "stationdetails", // Name of the collection to perform the lookup
                localField: "stationDetailId",
                foreignField: "_id",
                as: "stationdetails", // Alias for the joined data
            },
        },
        {
            $unwind: "$stationdetails", // Flatten the results from the lookup
        },
        {
            $group: {
                _id: "$stationDetailId",
                totalSaleLiter: {
                    $sum: "$saleLiter",
                },
                totalPrice: {
                    $sum: "$totalPrice",
                },
                stationDetail: { $first: "$stationdetails" }, // Keep stationDetail in the result
            },
        },
    ]);
};
exports.sumTodayStationDatasService = sumTodayStationDatasService;
const sumSevenDayPrevious = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    const today = new Date();
    const pipeline = [];
    for (let i = 6; i >= 0; i--) {
        const currentDate = new Date();
        currentDate.setDate(today.getDate() - i);
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);
        pipeline.push({
            $match: {
                createAt: query,
            },
        });
    }
    pipeline.push({
        $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createAt" } },
            totalSalePrice: { $sum: "$totalPrice" },
            totalSaleLiter: { $sum: "$saleLiter" },
        },
    });
    pipeline.push({
        $sort: {
            _id: 1, // Sort by date in ascending order
        },
    });
    return await selectedModel.aggregate(pipeline);
};
exports.sumSevenDayPrevious = sumSevenDayPrevious;
const getDailyReportDateForEachDayService = async (vehicleQuery, pageNo, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, detailSale_model_1.ksDetailSaleModel, detailSale_model_1.csDetailSaleModel);
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    return await selectedModel.aggregate([
        {
            $match: vehicleQuery,
        },
        {
            $group: {
                _id: {
                    dailyReportDate: "$dailyReportDate",
                    fuelType: "$fuelType",
                },
                totalSaleLiter: { $sum: "$saleLiter" },
                totalPrice: { $sum: "$totalPrice" },
            },
        },
        {
            $group: {
                _id: {
                    dailyReportDate: "$_id.dailyReportDate",
                    fuelType: "$_id.fuelType",
                },
                fuelData: {
                    $push: {
                        totalSaleLiter: "$totalSaleLiter",
                        totalPrice: "$totalPrice",
                    },
                },
            },
        },
        {
            $group: {
                _id: "$_id.dailyReportDate",
                fuelData: {
                    $push: {
                        k: "$_id.fuelType",
                        v: "$fuelData",
                    },
                },
            },
        },
        {
            $sort: { _id: -1 }, // Sort by dailyReportDate in ascending order
        },
        {
            $project: {
                _id: 0,
                dailyReportDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: { $dateFromString: { dateString: "$_id" } },
                    },
                },
                fuelData: { $arrayToObject: "$fuelData" },
            },
        },
    ]);
};
exports.getDailyReportDateForEachDayService = getDailyReportDateForEachDayService;
