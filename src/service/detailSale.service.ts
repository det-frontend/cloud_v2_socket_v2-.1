import { FilterQuery, UpdateQuery, model } from "mongoose";
import {
  csDetailSaleModel,
  detailSaleDocument,
  ksDetailSaleModel,
} from "../model/detailSale.model";
import config from "config";
import { dBSelector, dbDistribution } from "../utils/helper";
import moment from "moment-timezone";
import { query } from "express";
import { stationDetailDocument } from "../model/stationDetail.model";

const limitNo = config.get<number>("page_limit");

export const getDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    return await selectedModel
      .find(query)

      .populate({
        path: "stationDetailId",
        model: dbDistribution({ accessDb: dbModel }),
      })
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addDetailSale = async (
  body: detailSaleDocument,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    body.accessDb = dbModel;

    delete body._id;
    return await new selectedModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  body: UpdateQuery<detailSaleDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    await selectedModel.updateMany(query, body);
    return await selectedModel.find(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    let DetailSale = await selectedModel.find(query);
    if (!DetailSale) {
      throw new Error("No DetailSale with that id");
    }
    return await selectedModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const getDetailSaleByFuelType = async (
  dateOfDay: string,
  // stationId : string,
  fuelType: string,
  dbModel: string
) => {
  let fuel = await getDetailSale(
    {
      dailyReportDate: dateOfDay,
      fuelType: fuelType,
    },
    dbModel
  );

  let fuelLiter = fuel
    .map((ea) => ea["saleLiter"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);
  let fuelAmount = fuel
    .map((ea) => ea["totalPrice"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);

  return { count: fuel.length, liter: fuelLiter, price: fuelAmount };
};

export const detailSalePaginate = async (
  pageNo: number,
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
): Promise<{ count: number; data: detailSaleDocument[] }> => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;
  const data = await selectedModel
    .find(query)
    .sort({ createAt: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .populate({
      path: "stationDetailId",
      model: dbDistribution({ accessDb: dbModel }),
    })
    .select("-__v");
  const count = await selectedModel.countDocuments(query);

  return { data, count };
};

export const detailSaleByDate = async (
  query: FilterQuery<detailSaleDocument>,
  d1: Date,
  d2: Date,
  dbModel: string
): Promise<detailSaleDocument[]> => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

  const filter: FilterQuery<detailSaleDocument> = {
    ...query,
    createAt: {
      $gt: d1,
      $lt: d2,
    },
  };

  console.log(d1, d2, "this is detail sale by date");

  let result = await selectedModel
    .find(filter)
    .sort({ createAt: -1 })
    .populate({
      path: "stationDetailId",
      model: dbDistribution({ accessDb: dbModel }),
    })
    .select("-__v");

  return result;
};

export const detailSaleByDateAndPagi = async (
  query: FilterQuery<detailSaleDocument>,
  d1: Date,
  d2: Date,
  pageNo: number,
  dbModel: string
): Promise<{ count: number; data: detailSaleDocument[] }> => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter: FilterQuery<detailSaleDocument> = {
      ...query,
      createAt: {
        $gt: d1,
        $lt: d2,
      },
    };

    const dataQuery = selectedModel
      .find(filter)
      .sort({ createAt: -1 })
      .skip(skipCount)
      .limit(limitNo)
      .populate({
        path: "stationDetailId",
        model: dbDistribution({ accessDb: dbModel }),
      })
      .select("-__v");

    const countQuery = selectedModel.countDocuments(filter);

    const [data, count] = await Promise.all([dataQuery, countQuery]);
    console.log(data);
    return { data, count };
  } catch (error) {
    console.error("Error in detailSaleByDateAndPagi:", error);
    throw error;
  }
};

export const getLastDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);
  return await selectedModel.findOne(query).sort({ _id: -1, createAt: -1 });
};

export const getTodayVechicleCount = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);
  return await selectedModel.count(query);
};

export const sumTodayDatasService = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

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

export const sumTodayCategoryDatasService = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

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

export const sumTodayFuelTypeService = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

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

export const sumTodayStationDatasService = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

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

export const sumSevenDayPrevious = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

  const today = new Date();
  const pipeline: any = [];

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

export const getDailyReportDateForEachDayService = async (
  vehicleQuery: FilterQuery<detailSaleDocument>,
  pageNo: number,
  dbModel: string
) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

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
