import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  addStationDetail,
  deleteStationDetail,
  getAllStationDetails,
  getStationDetail,
  permissionAddService,
  stationDetailPaginate,
  updateStationDetail,
} from "../service/stationDetail.service";
import {
  csStationDetailModel,
  ksStationDetailModel,
} from "../model/stationDetail.model";

// export const getAllStationDetailHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let ksData = await getStationDetail(req.query, ksStationDetailModel);
//     let csData = await getStationDetail(req.query, csStationDetailModel);

//     let result = [...ksData, ...csData];

//     fMsg(res, "StationDetail are here", result);
//   } catch (e) {
//     next(new Error(e));
//   }
// };

export const getStationDetailHandler = async (
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


    

    // console.log(model)

    let { data, count } = await stationDetailPaginate(pageNo, req.query, model);
    fMsg(res, "StationDetail are here", data, model, count);
  } catch (e) {
    next(new Error(e));
  }
};

export const addStationDetailHandler = async (
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

    // console.log(model)

    let result = await addStationDetail(req.body, model);
    fMsg(res, "New StationDetail data was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const updateStationDetailHandler = async (
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

    let result = await updateStationDetail({_id:req.query._id}, req.body, model);
    fMsg(res, "updated StationDetail data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteStationDetailHandler = async (
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
    await deleteStationDetail({_id:req.query._id}, model);
    fMsg(res, "StationDetail data was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const getAllStationHandler = async (
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
    // console.log(model)

    const name = req.query.name;

    let query;
    if (name === "user" || name === "pprd" || name === "manager") {
      query = { "permission": { $in: [name] } };
    } 






    let data = await getAllStationDetails(model,query);
    fMsg(res, "StationDetail are here", data, model);
  } catch (e) {
    next(new Error(e));
  }
};

export const allowPermissionDetailSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let model: any;
    if (req.query.accessDb) {
      model = req.query.accessDb;
    } else {
      model = req.body.accessDb;
    }

    let station = await getStationDetail({ _id: req.body._id }, model);

    if (!station) return res.status(409);

    const keye = req.body.keye;


    if (station[0].permission.includes(keye)) {
      let result = await permissionAddService(req.body._id, req.body.keye, model, { $pull: { permission: keye } });
    

    return fMsg(res, "pull permited!", result);

    } else {
      let result = await permissionAddService(req.body._id, req.body.keye, model, { $push: { permission: keye } });
      
     return fMsg(res, "push permited!", result);
    }


  } catch (e) {
    next(new Error(e));
  }
}