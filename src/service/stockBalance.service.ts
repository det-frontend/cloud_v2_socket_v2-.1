import { FilterQuery } from "mongoose";
import { csStockBalanceModel, ksStockBalanceModel, stockBalanceDocument } from "../model/stockBalance.model";
import { dBSelector, dbDistribution } from "../utils/helper";
import moment from "moment-timezone";
import config from 'config';

export const addStockBalanceService = async (body: any, dbModel: string) => {
    try {
        let selectedModel = dBSelector(dbModel, ksStockBalanceModel, csStockBalanceModel);

        //true
        const previousDate = moment().tz("Asia/Yangon").subtract(1, 'day').format("YYYY-MM-DD");

        //for test
        const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");

        const updateGLPre = await selectedModel.findOne({ realTime: previousDate, tank: body.tank });

      
        if (updateGLPre !== null) {
            body.totalGL += Number(updateGLPre.todayGL)
        }

        const result = selectedModel.create(body);
        if (!result) throw new Error("Stock Balance is failed!");
        return result;
    } catch (e) {
        throw new Error(e);
    }
};


export const findStockBalanceByDateService = async (
    query: FilterQuery<stockBalanceDocument>,
    dbModel: string
) => {
    try {
        let selectedModel = dBSelector(
            dbModel,
            ksStockBalanceModel,
            csStockBalanceModel
        );
        
        return await selectedModel
            .find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'stationId',
                model:dbDistribution({accessDb:dbModel})
            })
            .select("-__v");
        
    } catch (e) {
        throw new Error(e);
    }
};

export const findByoneAndUpdateMany = async (
    query: FilterQuery<stockBalanceDocument>,
    body:any,
    dbModel: string
) => {
    try {
        let selectedModel = dBSelector(
            dbModel,
            ksStockBalanceModel,
            csStockBalanceModel
        );
        
        const result = await selectedModel.find(query);


        body.adjust = result.adjust;
        body.totalGL = result.totalGL;
        
        return await selectedModel
            .updateMany(query,{$set:body})
            .populate({
                path: "stationId",
                model:dbDistribution({accessDb:dbModel})
            })
            .select("-__v");
        
    } catch (e) {
        throw new Error(e);
    }
};

export const findStockBalancePagiByDateService = async (
    query: FilterQuery<stockBalanceDocument>,
    pageNo: number,
    d1: Date,
    d2: Date,
    dbModel: string
): Promise<{ count: number; data: stockBalanceDocument[] }> => {

    const limitNo = config.get<number>("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;

    const filter: FilterQuery<stockBalanceDocument> = {
        ...query,
        updatedAt: {
            $gt: d1,
            $lt: d2
        }
    };


    let selectedModel = dBSelector(
        dbModel,
        ksStockBalanceModel,
        csStockBalanceModel
    );


    const data = await selectedModel
        .find(filter)
        .skip(skipCount)
        .limit(limitNo)
        .populate({
            path: 'stationId',
            model:dbDistribution({accessDb:dbModel})
        })
        .select("-__v")

    const count = await selectedModel.countDocuments(filter);



    return { data, count };
};

export const findByIdAndAdjust = async (
    query: FilterQuery<stockBalanceDocument>,
    payload: any,
    dbModel: string
) => {
     let selectedModel = dBSelector(
        dbModel,
        ksStockBalanceModel,
        csStockBalanceModel
     );
    
    
    const result = await selectedModel.findOne(query);

    result.totalGL += (Number(payload.adjust));
    result.adjust = payload.adjust;


    
    return await selectedModel.updateMany(query,result);
};