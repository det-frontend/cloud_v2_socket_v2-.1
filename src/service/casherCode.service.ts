import { FilterQuery } from "mongoose";
import { dBSelector } from "../utils/helper";
import { csDetailSaleModel, ksDetailSaleModel } from "../model/detailSale.model";
import config from "config";

const limitNo = config.get<number>('page_limit');



export const getAllCasherCodeService = async(
    query:any,
    dbModel:string
    )=>{
 try{

  let selectedModel = dBSelector(
    dbModel,
    ksDetailSaleModel,
    csDetailSaleModel
  );



  const data = await selectedModel
  .distinct(query);
  
  let count = data.length


  return {data,count};

 }catch(e: any){
    throw new Error(e);
 }
}