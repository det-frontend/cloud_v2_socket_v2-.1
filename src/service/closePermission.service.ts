import { closePermissionDocument } from './../model/closePermission.model';
import closePermissionModel from "../model/closePermission.model";
import { FilterQuery } from 'mongoose';

export const getAllClosePermissionService = async (dbModel:string,query:FilterQuery<closePermissionDocument>)=>{
    let selectedModel = closePermissionModel;

    return await selectedModel.find(query); 
};

export const getAClosePermissionService = async (dbModel:string,query:object)=>{
    let selectedModel = closePermissionModel;
    

    return await selectedModel.findOne(query); 
};

export const addPerissionService = async (body:closePermissionDocument,dbModel: string) => {
    let selectedModel = closePermissionModel;
    
    return await new selectedModel(body).save();
};

export const updatePermissionService = async (body: closePermissionDocument, id: string, dbModel: string) => {
    let selectedModel = closePermissionModel;
    await selectedModel.findByIdAndUpdate({ _id: id }, body);
    return await selectedModel.find({ _id: id })
};

export const deletePermissionService = async (id: string, dbModel: string) => {
    let selectedModel = closePermissionModel;
    
    return await selectedModel.deleteOne({ stationDetailId: id });
};