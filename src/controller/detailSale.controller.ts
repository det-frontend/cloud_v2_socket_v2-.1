import { Request, Response, NextFunction, query } from "express";
import fMsg, { previous } from "../utils/helper";
import {
  getDetailSale,
  addDetailSale,
  updateDetailSale,
  deleteDetailSale,
  detailSalePaginate,
  detailSaleByDate,
  detailSaleByDateAndPagi,
  getLastDetailSale,
  getTodayVechicleCount,
  sumTodayDatasService,
  sumTodayCategoryDatasService,
  sumTodayStationDatasService,
  sumSevenDayPrevious,
  getDailyReportDateForEachDayService,
  detailSaleWithoutPagiByDate,
  // detailSaleByDate,
} from "../service/detailSale.service";
import {
  addFuelBalance,
  calcFuelBalance,
  getFuelBalance,
} from "../service/fuelBalance.service";
import { fuelBalanceDocument } from "../model/fuelBalance.model";
import { addDailyReport, getDailyReport } from "../service/dailyReport.service";
import { getStationDetail } from "../service/stationDetail.service";
import { ObjectId } from "mongodb";
import { collectionGet } from "../service/collection.service";
import logger from "../utils/logger";
import moment from "moment";

export const getDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);
    if (!pageNo) throw new Error("You need page number");
    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }
    let { data, count } = await detailSalePaginate(pageNo, req.query, model);
    fMsg(res, "DetailSale are here", data, model, count);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const addDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = moment().format("YYYY-MM-DD HH:mm:ss");

  // logger.warn(`
  // ========== start ==========
  // Function: Request In DetailSale
  // Request Date: ${start}
  // Request Method: ${req.method}
  // Request URL: ${req.originalUrl}
  // Request Body: ${JSON.stringify(req.body)}
  // ========== ended ==========
  // `, { file: 'detailsale.log' });

  try {
    // //that is remove after pos updated
    let model = req.body.accessDb;
    // console.log(req.body, "this is req.body");

    let check = await getDetailSale({ vocono: req.body.vocono }, model);
    //console.log(check);
    if (check.length != 0) {
      fMsg(res);
      return;
    }

    let result = await addDetailSale(req.body, model);

    let checkDate = await getFuelBalance(
      {
        stationId: result.stationDetailId,
        createAt: result.dailyReportDate,
      },
      model
    );

    let checkRpDate = await getDailyReport(
      {
        stationId: result.stationDetailId,
        dateOfDay: result.dailyReportDate,
      },
      model
    );

    if (checkRpDate.length == 0) {
      await addDailyReport(
        {
          stationId: result.stationDetailId,
          dateOfDay: result.dailyReportDate,
        },
        model
      );
    }

    let station = await getStationDetail(
      {
        _id: result.stationDetailId,
      },
      model
    );

    // console.log('station', station);

    const tankCount = station[0].tankCount;

    if (checkDate.length == 0) {
      let prevDate = previous(new Date(req.body.dailyReportDate));
      let prevResult = await getFuelBalance(
        {
          stationId: result.stationDetailId,
          // createAt: prevDate,
        },
        model,
        tankCount
      );

      // get tank count from stationDetail

      // console.log('tankCount', tankCount);

      //.slice(0, 4)
      await Promise.all(
        prevResult?.map(async (ea: any) => {
          let obj: fuelBalanceDocument;
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
            } as fuelBalanceDocument;
          } else {
            obj = {
              stationId: ea.stationId,
              fuelType: ea.fuelType,
              capacity: ea.capacity,
              opening: ea.opening + ea.fuelIn - ea.cash,
              tankNo: ea.tankNo,
              createAt: req.body.dailyReportDate,
              nozzles: ea.nozzles,
              balance: ea.opening + ea.fuelIn - ea.cash,
            } as fuelBalanceDocument;
          }

          await addFuelBalance(obj, model);
        })
      );
    }

    await calcFuelBalance(
      {
        stationId: result.stationDetailId,
        fuelType: result.fuelType,
        createAt: result.dailyReportDate,
      },
      { liter: result.saleLiter },
      result.nozzleNo,
      model
    );

    fMsg(res, "New DetailSale data was added", result);
  } catch (e: any) {
    // logger.error(`
    // ========== start ==========
    // Function: Error in addDetailSaleHandler
    // Error: ${e.message}
    // Stack: ${e.stack}
    // ========== ended ==========
    // `, { file: 'detailsale.log' });
    next(new Error(e));
  }
};

export const updateDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    let result = await updateDetailSale(req.query, req.body, model);
    fMsg(res, "updated DetailSale data", result);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const deleteDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    await deleteDetailSale(req.query, model);
    fMsg(res, "DetailSale data was deleted");
  } catch (e: any) {
    next(new Error(e));
  }
};

// //get detail sale between two date

export const getDetailSaleByDateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

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

    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    //if date error ? you should use split with T or be sure detail Id
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);
    let result = await detailSaleByDate(query, startDate, endDate, model);
    fMsg(res, "detail sale between two date", result);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const getDetailSaleDatePagiHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;
    let pageNo: number = Number(req.params.page);
    const literGreater: string = req.query.literGreate as string;
    const amountGreater: string = req.query.amountGreate as string;
    const literAmount: number = parseInt(req.query.literAmount as string);
    const priceAmount: number = parseInt(req.query.priceAmount as string);

    delete req.query.sDate;
    delete req.query.eDate;

    delete req.query.literGreate;
    delete req.query.amountGreate;
    delete req.query.literAmount;
    delete req.query.priceAmount;

    let query = req.query;

    if (!sDate) {
      throw new Error("you need date");
    }
    if (!eDate) {
      eDate = new Date();
    }

    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    //if date error ? you should use split with T or be sure detail Id
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    let { data, count, sumTotalPrice, sumTotalLiter } =
      await detailSaleByDateAndPagi(
        query,
        startDate,
        endDate,
        pageNo,
        literGreater,
        literAmount,
        amountGreater,
        priceAmount,
        model
      );

    fMsg(
      res,
      "detail sale between two date",
      data,
      model,
      count,
      sumTotalPrice,
      sumTotalLiter
    );
  } catch (e: any) {
    next(new Error(e));
  }
};

// get detail sale with pagination handler
export const getDetailSaleWithoutPagiHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;
    const literGreater: string = req.query.literGreate as string;
    const amountGreater: string = req.query.amountGreate as string;
    const literAmount: number = parseInt(req.query.literAmount as string);
    const priceAmount: number = parseInt(req.query.priceAmount as string);

    delete req.query.sDate;
    delete req.query.eDate;
    delete req.query.literGreate;
    delete req.query.amountGreate;
    delete req.query.literAmount;
    delete req.query.priceAmount;

    let query = req.query;

    if (!sDate) {
      throw new Error("You need to provide a start date.");
    }
    if (!eDate) {
      eDate = new Date();
    }

    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    // Parse dates
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    // Call the non-paginated function
    let { data, sumTotalPrice, sumTotalLiter } = await detailSaleWithoutPagiByDate(
      query,
      startDate,
      endDate,
      literGreater,
      literAmount,
      amountGreater,
      priceAmount,
      model
    );

    // Respond with the data
    fMsg(
      res,
      "Detail sale between two dates",
      data,
      model,
      sumTotalPrice,
      sumTotalLiter
    );
  } catch (e: any) {
    next(new Error(e));
  }
}

//old version
// export const statementReportHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let sDate: any = req.query.sDate;
//     let eDate: any = req.query.eDate;

//     delete req.query.sDate;
//     delete req.query.eDate;

//     let query = req.query;

//     if (!req.query.stationDetailId) throw new Error("you need stataion");
//     if (!sDate) throw new Error("you need date");
//     if (!eDate) eDate = new Date();

//     const startDate: Date = new Date(sDate);
//     const endDate: Date = new Date(eDate);

//     let model: any;
//     if (req.query.accessDb) {
//       model = req.query.accessDb;
//     } else {
//       model = req.body.accessDb;
//     }

//     let stationDetail = await getStationDetail(
//       {
//         _id: req.query.stationDetailId,
//       },
//       model
//     );

//     let finalData: any = [];

//     for (let i: number = 1; i <= stationDetail[0].nozzleCount; i++) {
//       let noz = i.toString().padStart(2, "0");

//       query = {
//         ...query,
//         nozzleNo: noz,
//       };

//       // let result = await detailSaleByDate(query, startDate, endDate, model);
//       const value = await detailSaleByDate(query, startDate, endDate, model);
//       let result = value.reverse();

//       let count = result.length;

//       if (count == 0) {
//         query = {
//           ...query,
//           nozzleNo: noz,
//         };
//         let lastData = await getLastDetailSale(query, model);
//         // console.log(
//         //   lastData,
//         //   "this is last Data....................................................."
//         // );

//         if (lastData) {
//           let data = {
//             stationId: stationDetail[0].name,
//             station: stationDetail,
//             nozzle: noz,
//             price: "0",
//             fuelType: lastData?.fuelType,
//             totalizer_opening: lastData?.devTotalizar_liter,
//             totalizer_closing: lastData?.devTotalizar_liter,
//             totalizer_different: 0,
//             totalSaleLiter: 0,
//             totalSalePrice: 0,
//             other: 0,
//             pumptest: 0,
//           };

//           finalData.push(data);
//         } else {
//           let data = {
//             stationId: stationDetail[0].name,
//             station: stationDetail,
//             nozzle: noz,
//             price: "0",
//             fuelType: "-",
//             totalizer_opening: "0",
//             totalizer_closing: "0",
//             totalizer_different: 0,
//             totalSaleLiter: 0,
//             totalSalePrice: 0,
//             other: 0,
//             pumptest: 0,
//           };

//           finalData.push(data);
//         }

//         // return;
//       } else {
//         let totalSaleLiter: number = result
//           .map((ea) => ea["saleLiter"])
//           .reduce((pv: number, cv: number): number => pv + cv, 0);

//         let totalSalePrice: number = result
//           .map((ea) => ea["totalPrice"])
//           .reduce((pv: number, cv: number): number => pv + cv, 0);

//         let pumptest: number = result
//           .filter((ea) => ea.vehicleType == "Pump Test")
//           .map((ea) => ea.totalPrice)
//           .reduce((pv: number, cv: number): number => pv + cv, 0);

//         // console.log(
//         //   result[0].devTotalizar_liter,
//         //   result[count - 1].devTotalizar_liter,
//         //   result[count - 1].salePrice
//         // );

//         let otherCalcu =
//           (
//             Number(
//               result[count - 1].devTotalizar_liter -
//                 (result[0].devTotalizar_liter - result[0].saleLiter)
//             ) - Number(totalSaleLiter - pumptest)
//           ).toFixed(3) || "0";

//         let data = {
//           stationId: stationDetail[0].name,
//           station: stationDetail,
//           nozzle: noz,
//           fuelType: result[count - 1].fuelType,
//           price: result[count - 1].salePrice
//             ? result[count - 1].salePrice
//             : result[count - 2].salePrice,
//           totalizer_opening: Number(
//             (result[0].devTotalizar_liter - result[0].saleLiter).toFixed(3)
//           ),
//           totalizer_closing: Number(
//             result[count - 1].devTotalizar_liter.toFixed(3)
//           ),
//           totalizer_different: Number(
//             result[count - 1].devTotalizar_liter -
//               (result[0].devTotalizar_liter - result[0].saleLiter)
//           ).toFixed(3),
//           totalSaleLiter: Number((totalSaleLiter - pumptest).toFixed(3)),
//           totalSalePrice: Number(totalSalePrice.toFixed(3)),
//           other: Math.abs(
//             Number(
//               result[count - 1].devTotalizar_liter -
//                 (result[0].devTotalizar_liter - result[0].saleLiter)
//             ) - Number((totalSaleLiter - pumptest).toFixed(3))
//           ),
//           pumptest: pumptest,
//         };
//         finalData.push(data);
//       }
//     }

//     // console.log("0000000000");
//     // console.log(finalData);
//     // console.log("0000000000");

//     fMsg(res, "final data", finalData, model);
//   } catch (e) {
//     console.log(e);
//     next(new Error(e));
//   }
// };

//new version
// export const statementReportHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const sDate: any = req.query.sDate;
//     const eDate: any = req.query.eDate;

//     delete req.query.sDate;
//     delete req.query.eDate;

//     if (!req.query.stationDetailId) throw new Error("You need stationDetailId");
//     if (!sDate) throw new Error("You need start date");

//     const startDate: Date = new Date(sDate);
//     const endDate: Date = eDate ? new Date(eDate) : new Date();

//     const model: any = req.query.accessDb || req.body.accessDb;

//     const stationDetail = await getStationDetail(
//       {
//         _id: req.query.stationDetailId,
//       },
//       model
//     );

//     const finalData: { [date: string]: any[] } = {};

//     for (let i: number = 1; i <= stationDetail[0].nozzleCount; i++) {
//       const noz = i.toString().padStart(2, "0");

//       let query = {
//         ...req.query,
//         nozzleNo: noz,
//       };

//       const value = await detailSaleByDate(query, startDate, endDate, model);
//       const result = value.reverse();

//       // Organize data by date
//       const dateGroupedData: { [date: string]: any[] } = {};

//       for (const entry of result) {
//         const entryDate = new Date(entry.dailyReportDate).toISOString().split("T")[0]; // Extract date part (YYYY-MM-DD)

//         if (!dateGroupedData[entryDate]) {
//           dateGroupedData[entryDate] = [];
//         }

//         let data = {
//           stationId: stationDetail[0].name,
//           station: stationDetail,
//           nozzle: noz,
//           fuelType: entry.fuelType,
//           price: entry.salePrice,
//           totalizer_opening: entry.devTotalizar_liter - entry.saleLiter,
//           totalizer_closing: entry.devTotalizar_liter,
//           totalizer_different:
//             entry.devTotalizar_liter -
//             (entry.devTotalizar_liter - entry.saleLiter),
//           totalSaleLiter: entry.saleLiter,
//           totalSalePrice: entry.totalPrice,
//           // other: entry.other,
//           pumptest: entry.vehicleType === "Pump Test" ? entry.totalPrice : 0,
//         };

//         dateGroupedData[entryDate].push(data);
//       }

//       // Fill in data for dates with no transactions
//       for (const date in dateGroupedData) {
//         let totalSaleLiter = dateGroupedData[date].reduce(
//           (acc, item) => acc + item.totalSaleLiter,
//           0
//         );
//         let totalSalePrice = dateGroupedData[date].reduce(
//           (acc, item) => acc + item.totalSalePrice,
//           0
//         );
//         let pumptest = dateGroupedData[date].reduce(
//           (acc, item) => acc + item.pumptest,
//           0
//         );

//         finalData[date] = finalData[date] || [];

//         finalData[date].push({
//           stationId: stationDetail[0].name,
//           station: stationDetail,
//           nozzle: noz,
//           fuelType: dateGroupedData[date][0]?.fuelType || "-",
//           price: dateGroupedData[date][0]?.price || "0",
//           totalizer_opening: dateGroupedData[date][0]?.totalizer_opening || "0",
//           totalizer_closing: dateGroupedData[date][0]?.totalizer_closing || "0",
//           totalizer_different:
//             dateGroupedData[date][0]?.totalizer_closing -
//               dateGroupedData[date][0]?.totalizer_opening || "0",
//           totalSaleLiter: totalSaleLiter.toFixed(3),
//           totalSalePrice: totalSalePrice.toFixed(3),
//           other: 0, // Compute this if needed based on your logic
//           pumptest: pumptest.toFixed(3),
//         });
//       }
//     }

//     fMsg(res, "Final data by date", finalData, model);
//   } catch (e) {
//     console.log(e);
//     next(new Error(e));
//   }
// };

//latest pump report 
export const statementReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sDate: any = req.query.sDate;
    const eDate: any = req.query.eDate;

    delete req.query.sDate;
    delete req.query.eDate;

    if (!req.query.stationDetailId) throw new Error("You need stationDetailId");
    if (!sDate) throw new Error("You need start date");

    const startDate: Date = new Date(sDate);
    const endDate: Date = eDate ? new Date(eDate) : new Date();

    const model: any = req.query.accessDb || req.body.accessDb;

    const stationDetail = await getStationDetail(
      { _id: req.query.stationDetailId },
      model
    );

    const nozzleCount = stationDetail[0].nozzleCount;
    const finalData: any[] = []; // Array to store final results

    for (let i: number = 1; i <= nozzleCount; i++) {
      const noz = i.toString().padStart(2, "0");

      let query = {
        ...req.query,
        nozzleNo: noz,
      };

      // Fetch sales data for the current nozzle within the date range
      const sales = await detailSaleByDate(query, startDate, endDate, model);
      const result = sales.reverse();

      // If no data exists in the date range
      if (result.length === 0) {
        // Fetch the last known data for the nozzle
        const lastData = await getLastDetailSale(query, model);

        if (lastData) {
          finalData.push({
            date: "-",
            stationId: stationDetail[0].name,
            station: stationDetail,
            nozzle: noz,
            depNo: "-",
            price: "0",
            fuelType: lastData.fuelType,
            totalizer_opening: lastData.devTotalizar_liter,
            totalizer_closing: lastData.devTotalizar_liter,
            totalizer_different: 0,
            totalSaleLiter: 0,
            totalSalePrice: 0,
            other: 0,
            pumptest: 0,
          });
        } else {
          // If no data exists for the nozzle from the beginning
          finalData.push({
            message: `No sales data found for nozzle: ${noz}`,
            nozzle: noz,
          });
        }
        continue;
      }

      // Process sales data
      const dateGroupedData: { [date: string]: any[] } = {};

      for (const entry of result) {
        const entryDate = new Date(entry.dailyReportDate)
          .toISOString()
          .split("T")[0]; // Extract date part (YYYY-MM-DD)
        if (!dateGroupedData[entryDate]) {
          dateGroupedData[entryDate] = [];
        }
        dateGroupedData[entryDate].push(entry);
      }

      for (const date in dateGroupedData) {
        const entries = dateGroupedData[date];

        let totalSaleLiter = entries.reduce((acc, item) => acc + item.saleLiter, 0);
        let totalSalePrice = entries.reduce((acc, item) => acc + item.totalPrice, 0);
        let pumptest = entries
          .filter((item) => item.vehicleType === "Pump Test")
          .reduce((acc, item) => acc + item.saleLiter, 0);

        finalData.push({
          date,
          stationId: stationDetail[0].name,
          station: stationDetail,
          nozzle: noz,
          depNo: result.find((e) => e.nozzleNo == noz)?.depNo || "-",
          fuelType: entries[0]?.fuelType || "-",
          price: entries[0]?.salePrice || "0",
          totalizer_opening: entries[0]?.devTotalizar_liter - totalSaleLiter || "0",
          totalizer_closing: entries[entries.length - 1]?.devTotalizar_liter || "0",
          totalizer_different:
            (entries[entries.length - 1]?.devTotalizar_liter || 0) -
            (entries[0]?.devTotalizar_liter - totalSaleLiter || 0),
          totalSaleLiter: (totalSaleLiter - pumptest).toFixed(3),
          totalSalePrice: totalSalePrice.toFixed(3),
          pumptest: pumptest.toFixed(3),
          other: Math.abs(
            (entries[entries.length - 1]?.devTotalizar_liter || 0) -
              (entries[0]?.devTotalizar_liter - totalSaleLiter || 0) -
              totalSaleLiter
          ),
        });
      }
    }

    fMsg(res, "Final data by date", finalData, model);
  } catch (e: any) {
    next(new Error(e.message || "An error occurred while generating the report"));
  }
};



//.........

export const calculateTotalPerDayHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

    delete req.query.sDate;
    delete req.query.eDate;

    if (!sDate) throw new Error("you need date");
    if (!eDate) eDate = new Date();

    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    if (req.query.totalVehicle) {
      const vehicleQuery = { createAt: { $gt: startDate, $lt: endDate } };
      const result = await getTodayVechicleCount(vehicleQuery, model);
      if (result) fMsg(res, "Total Vehicle", result, model);
    } else if (req.query.fuelType) {
      const vehicleQuery = {
        createAt: { $gt: startDate, $lt: endDate },
        fuelType: req.query.fuelType,
      };
      const result = await sumTodayDatasService(vehicleQuery, model);
      if (result)
        fMsg(res, `Total FuelType ${req.query.fuelType}`, result, model);
    } else {
      const vehicleQuery = { createAt: { $gt: startDate, $lt: endDate } };
      const result = await sumTodayDatasService(vehicleQuery, model);
      if (result) fMsg(res, "Total Today Sum", result, model);
    }
  } catch (e: any) {
    next(new Error(e));
  }
};

export const calculateCategoriesTotalHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

    delete req.query.sDate;
    delete req.query.eDate;

    if (!sDate) throw new Error("you need date");
    if (!eDate) eDate = new Date();

    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    let vehicleTypes: any = req.query.vehicleType;

    vehicleTypes = vehicleTypes.split(",");

    const vehicleQuery = {
      createAt: { $gt: startDate, $lt: endDate },
      vehicleType: { $in: vehicleTypes },
    };

    const result = await sumTodayCategoryDatasService(vehicleQuery, model);

    if (result) fMsg(res, "Total Vehicle", result, model);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const calculateStationTotalHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

    delete req.query.sDate;
    delete req.query.eDate;

    if (!sDate) throw new Error("you need date");
    if (!eDate) eDate = new Date();

    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    const collection = await collectionGet({ collectionName: model });
    let stationIds: any = req.query.stations;

    const stationCollection = collection[0].stationCollection;

    const arryStationCollection: any = [];

    stationCollection.map((e: any) => {
      return arryStationCollection.push(new ObjectId(e.stationId));
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

    const result = await sumTodayStationDatasService(vehicleQuery, model);

    if (result) fMsg(res, "Total Stations", result, model);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const sevenDayPreviousTotalHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    function formatDate(date: any) {
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

    function getDates(
      startDate: string | number | Date,
      endDate: number | Date
    ) {
      const dates: any = [];
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

    const result = await sumTodayDatasService(query, model);

    if (result) fMsg(res, "Total seven day", result, model);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const calcualteDatasForEachDayHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getDailyReportDateForEachDayHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

    delete req.query.sDate;
    delete req.query.eDate;

    if (!sDate) throw new Error("you need date");
    if (!eDate) eDate = new Date();

    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);
    let pageNo: number = Number(req.params.page);

    let model = req.body.accessDb;

    const vehicleQuery = {
      createAt: { $gt: startDate, $lt: endDate },
      stationDetailId: new ObjectId(`${req.query.stationDetailId}`),
    };

    let result = await getDailyReportDateForEachDayService(
      vehicleQuery,
      pageNo,
      model
    );

    fMsg(res, "Daily Report Date For EachDay", result);
  } catch (e: any) {
    next(new Error(e));
  }
};
