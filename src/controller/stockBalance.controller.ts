import { NextFunction,Request,Response } from "express";
import { findByIdAndAdjust, findStockBalancePagiByDateService } from "../service/stockBalance.service";
import fMsg from "../utils/helper";


export const getStockBalanceDatePagiHandler = async (
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
            throw new Error("You need Date!");
        }
        if (!eDate) {
            eDate = new Date();
        }

        let model;

    if (req.query.accessDb) {
       model = req.query.accessDb;
    } else {
       model = req.body.accessDb;
    }
        delete req.query.accessDb;

        const startDate: Date = new Date(sDate);
        const endDate: Date = new Date(eDate);


        let { data, count } = await findStockBalancePagiByDateService(
            query,
            pageNo,
            startDate,
            endDate,
            model
        );


        fMsg(res, "Stock balance between date", data, model, count);


    } catch (e) {
        next(new Error(e));
    }
};

export const stockBalanceAdjustHandler = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        let query = req.query;
        let adjust = req.body.adjust;

        let payload = { adjust };
        

        let model = req.body.accessDb;

        const result = await findByIdAndAdjust(query, payload, model);


        fMsg(res, "Adjust Success!", result, model);

    } catch (e) {
        next(new Error(e));
    }
};