import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";

import {
  collectionAdd,
  collectionAddStation,
  collectionDelete,
  collectionGet,
  collectionPPRDDPull,
  collectionPPRDDPush,
  collectionRemoveStation,
} from "../service/collection.service";
import { getStationDetail } from "../service/stationDetail.service";
import {
  csStationDetailModel,
  ksStationDetailModel,
} from "../model/stationDetail.model";
import { collectionDocument } from "../model/collection.model";

export const getCollectionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const name = req.query.name;

    let query;
    if (name) {
      query = { "permission": { $in: [name] } };
    } else {
      query = req.query
    }

    // console.log(query)


    let result = await collectionGet(query);


    fMsg(res, "Collection are here", result);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const addCollectionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await collectionAdd(req.body);
    fMsg(res, "New Collection was added", result);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const deletCollectionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await collectionDelete(req.query);
    fMsg(res, "Collection was deleted");
  } catch (e: any) {
    next(new Error(e));
  }
};

export const collectionAddPermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let collection = await collectionGet({
      _id: req.body.collectionId,
    });

    let station;
    let ksStationDetail = await getStationDetail(
      { _id: req.body.stationId },
      'kyaw_san'
    );

    if (ksStationDetail.length == 0) {
      let csStationDetail = await getStationDetail(
        { _id: req.body.stationId },
        'common'
      );
      station = csStationDetail;
    } else {
      station = ksStationDetail;
    }

    if (collection.length == 0 || station.length == 0) {
      next(new Error("collection or station not found"));
    }
    let foundStation = collection[0].stationCollection.find(
      (ea: any) => ea._id == req.body.stationId
    );
    if (foundStation) {
      return next(new Error("station already in exist"));
    }
    console.log("wk");
    let result = await collectionAddStation(
      req.body.collectionId,
      req.body.stationId,
      req.body.stationName
    );
    fMsg(res, "station added ", result);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const collectionRemovePermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let collection = await collectionGet({
      _id: req.body.collectionId,
    });


    let foundStation = collection[0]["stationCollection"].find(
      (ea: { stationId: string }) => ea["stationId"] == req.body.stationId
    );
    if (!collection || !foundStation) {
      throw new Error("collection or station not found");
    }
    let result = await collectionRemoveStation(
      req.body.collectionId,
      req.body.stationId,
      req.body.stationName
    );
    fMsg(res, "station removed ", result);
  } catch (e: any) {
    next(new Error(e));
  }
};

export const collectionPPRDDo = async (req: Request, res: Response, next: NextFunction) => {
  try {

   let collection:any = await collectionGet({
      _id: req.body.collectionId,
   });

    let name = req.body.name;

    if (!name) return res.status(409);
    

    if (collection[0]?.permission?.includes('pprd')) {
      const data = await collectionPPRDDPull(req.body.collectionId, name);
      return fMsg(res, "pprd off", data);
    } else {
       const data = await collectionPPRDDPush(req.body.collectionId, name);
      return fMsg(res, "pprd on", data);
    }
    
    
    
  } catch (e: any) {
    next(new Error(e));
  }
}