import { NextFunction,Request,Response } from "express";
import { addPerissionService, deletePermissionService, getAClosePermissionService, getAllClosePermissionService, updatePermissionService } from "../service/closePermission.service";
import fMsg from "../utils/helper";
import io from '../app';

export const getClosePermissionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
    
    let model: any;
    if (req.query.accessDb) {
       model = req.query.accessDb;
    } else {
       model = req.body.accessDb;
    }
        
    let query;
    if (req.query.stationDetailId) {
            query = { stationDetailId: req.query.stationDetailId };
    }

        let result = await getAllClosePermissionService(model,query);
       
        fMsg(res, "close Permissions", result);

    } catch (e) {
        next(new Error(e));
    }
};

export const updatePermissionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
       let model: any;
    if (req.query.accessDb) {
       model = req.query.accessDb;
    } else {
       model = req.body.accessDb;
    }

        let result = await getAClosePermissionService(model, { _id: req.body._id });
        
        if (!result) return res.status(404);


        const succ = await updatePermissionService(req.body, req.body._id, model);

        const stationDetailId = succ[0].stationDetailId;
        const payload = succ[0];




        fMsg(res, "update Permissions", succ);

    } catch (e) {
        next(new Error(e));
    }
};

export const addPermissionHandler = async (req: Request, res: Response, next: NextFunction) => {
     try {
    
    let model: any;
    if (req.query.accessDb) {
       model = req.query.accessDb;
    } else {
       model = req.body.accessDb;
    }
        let result = await addPerissionService(req.body, model);
        io.of('/change-mode').emit(result.stationDetailId, result);
        fMsg(res, "add Permissions", result);

    } catch (e) {
        next(new Error(e));
    }
}
export const deletePermissionHandler = async (req: Request, res: Response, next: NextFunction) => {
     try {
    
    let model: any;
    if (req.query.accessDb) {
       model = req.query.accessDb;
    } else {
       model = req.body.accessDb;
    }
         const id = req.body.id;

        let result = await deletePermissionService(id,model);
       
        fMsg(res, "add Permissions", result);

    } catch (e) {
        next(new Error(e));
    }
}