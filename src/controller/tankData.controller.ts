import { Request, Response, NextFunction } from "express";
import { tankDataInput } from "../model/tankData.Detail.model";
import {
  addTankDataService,
  deleteTankDataById,
  getAllTankDataService,
  latestTankDataByStationId,
  tankDataByDate,
  updateTankDataService,
} from "../service/tankData.service";
import fMsg, {
  fuelBalanceCalculationForStockBalance,
  realTankCalculationForStockBalance,
} from "../utils/helper";
import { fuelBalanceForStockBalance } from "../service/fuelBalance.service";
import moment from "moment-timezone";
import {
  addStockBalanceService,
  findByoneAndUpdateMany,
  findStockBalanceByDateService,
} from "../service/stockBalance.service";

export const addTankDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
  const previousDate = moment()
    .tz("Asia/Yangon")
    .subtract(1, "day")
    .format("YYYY-MM-DD");
  const nextDate = moment(currentDate).add(1, "day").format("YYYY-MM-DD");

  try {
    let model = req.body.accessDb;
    let stationId = req.body.stationDetailId;

    //save tankData
    let result = await addTankDataService(req.body, model);
    console.log("work.....");
    //find fuel balance
    let fuelBalanceLatest = await fuelBalanceForStockBalance(
      currentDate,
      stationId,
      model
    );

    //find yesterday Tank
    let yesterdayTank = await latestTankDataByStationId(
      {
        stationDetailId: req.body.stationDetailId,
        dailyReportDate: previousDate,
      },
      model
    );

    console.log(fuelBalanceLatest, yesterdayTank)

    //realtime tank opening
    const datas = req.body.data;
    console.log(datas, "...............................")

    let yesterdayDatas = [];
    if (yesterdayTank.length == 1) {
      yesterdayDatas = yesterdayTank[0].data;
    } else {
      yesterdayDatas = [];
    }
    console.log("gg")

    const todayTankData = await realTankCalculationForStockBalance(datas);
    //realtime tank opening
    console.log("wkkkkkkkkkkkkkkkkk")
    //yesterday tank opening
    const yesterdayTankData = await realTankCalculationForStockBalance(
      yesterdayDatas
    );
    // yesterday tank opening
    // console.log(todayTankData, yesterdayTankData, "..............................");
    console.log(fuelBalanceLatest,"wk....");
    //fuel balance opening
    const {
      ron92_opening,
      ron92_cash,
      ron92_balance,
      ron92_receive,
      ron95_opening,
      ron95_cash,
      ron95_balance,
      ron95_receive,
      diesel_opening,
      diesel_cash,
      diesel_balance,
      diesel_receive,
      pDiesel_opening,
      pDiesel_cash,
      pDiesel_balance,
      pDiesel_receive,
    } = fuelBalanceCalculationForStockBalance(fuelBalanceLatest);

    console.log(
      ron92_opening,
      ron92_cash,
      ron92_balance,
      ron92_receive,
      ron95_opening,
      ron95_cash,
      ron95_balance,
      ron95_receive,
      diesel_opening,
      diesel_cash,
      diesel_balance,
      diesel_receive,
      pDiesel_opening,
      pDiesel_cash,
      pDiesel_balance,
      pDiesel_receive
    );

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
      todayGL: (
        ron92_cash -
        (yesterdayTankData.ron92 - todayTankData.ron92)
      ).toFixed(3),
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
      todayGL: (
        ron95_cash -
        (yesterdayTankData.ron95 - todayTankData.ron95)
      ).toFixed(3),
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
      todayGL: (
        diesel_cash -
        (yesterdayTankData.diesel - todayTankData.diesel)
      ).toFixed(3),
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
      totalIssue: (yesterdayTankData.pDiesel - todayTankData.pDiesel).toFixed(
        3
      ),
      todayGL: (
        pDiesel_cash -
        (yesterdayTankData.pDiesel - todayTankData.pDiesel)
      ).toFixed(3),
      totalGL: 0,
      accessDb: "kyaw_san",
      realTime: currentDate,
    };

    const isToday = await findStockBalanceByDateService(
      { realTime: currentDate },
      model
    );

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

      console.log("if block");
      dataWeMustSave.forEach(async (data, index) => {
        const result = await addStockBalanceService(data, model);
      });

      console.log("if block wk");

      fMsg(res, "Tank data add is successful!", result);
    } else {
      const result_1 = await findByoneAndUpdateMany(
        { tank: "001-Octane Ron(92)", realTime: currentDate },
        pureData92,
        model
      );
      if (!result_1) return next(new Error(result_1));

      const result_2 = await findByoneAndUpdateMany(
        { tank: "002-Octane Ron(95)", realTime: currentDate },
        pureData95,
        model
      );
      if (!result_2) return next(new Error(result_2));

      const result_3 = await findByoneAndUpdateMany(
        { tank: "005-Premium Diesel", realTime: currentDate },
        pureSuperDiesel,
        model
      );
      if (!result_3) return next(new Error(result_3));

      const result_4 = await findByoneAndUpdateMany(
        { tank: "004-Diesel", realTime: currentDate },
        pureDiesel,
        model
      );
      if (!result_4) return next(new Error(result_4));

      fMsg(res, "Tank data add is successful!", result);

      console.log("all successfully work");
    }
  } catch (e) {
    next(new Error(e));
  }
};

export const getAllTankDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;
    let pageNo: number = Number(req.params.page);
    let result = await getAllTankDataService(model, pageNo);
    fMsg(res, "All is tank data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const getTankDataByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let pageNo: number = Number(req.params.page);
    delete req.query.sDate;

    let query = req.query;
    if (!query.dailyReportDate) {
      throw new Error("you need date");
    }

    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    delete req.query.accessDb;

    const startDate: Date = new Date(sDate);
    let { data, count } = await tankDataByDate(query, startDate, pageNo, model);
    fMsg(res, "tank", data, model, count);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteTankDataIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;
    let result = await deleteTankDataById(req.query, model);
    if (!result) throw new Error("Tank data delete is failed!");
    fMsg(res, "Tank Data was deleted!");
  } catch (e) {
    next(new Error(e));
  }
};

export const updateTankDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    let result = await updateTankDataService(req.query, req.body, model);
    fMsg(res, "Updated tank data!", result);
  } catch (e) {
    next(new Error(e));
  }
};
