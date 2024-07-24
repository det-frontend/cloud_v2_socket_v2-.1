import { FilterQuery, UpdateQuery } from "mongoose";
import { csTankDataModel, ksTankDataModel, tankDataDocument, tankDataInput } from "../model/tankData.Detail.model";
import { dBSelector, dbDistribution } from "../utils/helper";
import { csDetailSaleModel, ksDetailSaleModel } from "../model/detailSale.model";
import config from "config";
import moment from "moment-timezone";

const limitNo = config.get<number>('page_limit');

export const getTankData = async (
    query: FilterQuery<tankDataDocument>,
    dbModel: string
) => {
    let selectedModel = dBSelector(
        dbModel,
        ksTankDataModel,
        csTankDataModel
    );
      try {
        return await selectedModel.find(query).lean().select("-__v");
      } catch (e) {
        throw new Error(e);
      }
}

export const addTankDataService = async (body: any, dbModel: string) => { 
    try { 
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);

        body.dailyReportDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
        const result = await selectedModel.create(body);

        if (!result) throw new Error("Tank data save is failed!");

        return result;

    } catch (e) {
        throw new Error(e);
    }
};

export const updateExistingTankData = async (
    body: any,
    dbModel: string
) => {
    try {
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);
        

        const tankObject = {
            stationDetailId: body.stationDetailId,
            vocono: body.vocono,
            nozzleNo: body.nozzleNo,
            data: body.data,
            dailyReportDate: body.dateOfDay,
        }

        await selectedModel.findOneAndUpdate({ _id: body._id }, tankObject);

        const result = await selectedModel.find({ _id: body._id }).lean();
        if (!result) throw new Error("Tank data save is failed!");

        return result;
        
    } catch (e) {
        throw new Error(e);
    }
}

export const tankDataByDate = async (
    query: FilterQuery<tankDataDocument>,
    d1: Date,
    pageNo: number,
    dbModel: string
) => {
    let selectedModel = dBSelector(
        dbModel,
        ksTankDataModel,
        csTankDataModel
    );

    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    


    const data = await selectedModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(1)
        .populate({
            path: `stationDetailId`,
            model:dbDistribution({accessDb:dbModel})
        })
        .select("-__v");
        
    const count = await selectedModel.countDocuments();

    return { data, count };
};

export const tankDataByDates = async (
    query: FilterQuery<tankDataDocument>,
    d1: Date,
    d2: Date,
    dbModel: string
) => {
    
    try {
        const filter: FilterQuery<tankDataDocument> = {
            ...query,
            createdAt: {
                $gt: d1,
                $lt: d2,
            },
        };
        let selectedModel = dBSelector(
        dbModel,
        ksTankDataModel,
        csTankDataModel
        );

        
    
        return await selectedModel
        .find({createdAt: {
                $gt: d1,
                $lt: d2,
            }})
        .limit(1)    
        .sort({ createdAt: -1 })
        .populate({
            path: `stationDetailId`,
            model:dbDistribution({accessDb:dbModel})
        })
        .select("-__v");

    } catch (e) {
        throw new Error(e);
    }

};

export const getAllTankDataService = async (dbModel: string,pageNo:number) => {
    try {
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);

        const reqPage = pageNo == 1 ? 0 : pageNo - 1;
        const skipCount = limitNo * reqPage;

        const result = await selectedModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limitNo)
        if (!result) throw new Error("All of tank data can't!");
        return result;
    } catch (e) {
        throw new Error(e);
    }
};

export const deleteTankDataById = async (query: FilterQuery<tankDataDocument>, dbModel: string) => {
    try {
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);
        
        let tankData = await selectedModel.find(query);
        if (!tankData) throw new Error("No tank data with that id!");
        return await selectedModel.deleteMany(query);
    } catch (e) { throw new Error(e); }
};

export const updateTankDataService = async (query: FilterQuery<tankDataDocument>, body: UpdateQuery<tankDataDocument>, dbModel: string) => {
    try {
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);
         
        await selectedModel.updateMany(query, body);
        return await selectedModel.find(query).lean();

    } catch (e) {
        throw new Error(e);
    }
};

export const latestTankDataByStationId = async (query: FilterQuery<tankDataDocument>,dbModel:string) => {
     try {
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);

    return await selectedModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(1)
            .lean()
            .select("-__v")

    } catch (e) {
        throw new Error(e);
    }
}