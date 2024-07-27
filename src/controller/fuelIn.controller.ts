import { Request, Response, NextFunction, query } from "express";
import fMsg from "../utils/helper";
import {
  getFuelIn,
  addFuelIn,
  updateFuelIn,
  deleteFuelIn,
  fuelInPaginate,
  fuelInByDate,
  addAtgFuelIn,
} from "../service/fuelIn.service";
import { csFuelInModel, ksFuelInModel } from "../model/fuelIn.model";


export const getFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    let pageNo = Number(req.params.page);
    let { data, count } = await fuelInPaginate(pageNo, req.query, model);
    fMsg(res, "FuelIn are here", data, model, count);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const addFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    let result = await addFuelIn(req.body, model);
    fMsg(res, "New FuelIn data was added", result);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const updateFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    let result = await updateFuelIn(req.query, req.body, model);
    fMsg(res, "updated FuelIn data", result);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const deleteFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;
    await deleteFuelIn(req.query, model);
    fMsg(res, "FuelIn data was deleted");
  } catch (e: any) {
    next(new Error(e));
  }
};

export const getFuelInByDateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

    let pageNo: number = Number(req.params.page);

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
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    delete req.query.accessDb;

    let { data, count } = await fuelInByDate(
      query,
      startDate,
      endDate,
      pageNo,
      model
    );
    fMsg(res, "fuel balance between two date", data, model, count);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const addAtgFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;
    
    let result = await addAtgFuelIn(req.body, model);
    fMsg(res, "New FuelIn data was added", result);
  } catch (e: any) {
    next(new Error(e));
  }
}
