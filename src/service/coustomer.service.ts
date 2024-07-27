import { FilterQuery } from "mongoose";
import coustomerModel, { coustomerDocument } from "../model/coustomer.model";
import { UpdateQuery } from "mongoose";
import { ParsedQs } from "qs";

export const getCoustomer = async (query: FilterQuery<coustomerDocument>) => {
  try {
    return await coustomerModel.find(query).lean().select("-__v");
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getCoustomerById = async (id: string) => {
  try {
    return await coustomerModel.findById(id).select("-__v");
  } catch (e: any) {
    throw new Error(e);
  }
};

export const addCoustomer = async (body: coustomerDocument) => {
  try {
    return await new coustomerModel(body).save();
  } catch (e: any) {
    throw new Error(e);
  }
};

export const updateCoustomer = async (
  id: string,
  body: UpdateQuery<coustomerDocument>
) => {
  try {
    await coustomerModel.findByIdAndUpdate(id, body).select("-password -__v");
    return await coustomerModel.findById(id).lean();
  } catch (e: any) {
    throw new Error(e);
  }
};

export const deleteCoustomer = async (
  query: FilterQuery<coustomerDocument>
) => {
  try {
    return await coustomerModel.deleteMany(query);
  } catch (e: any) {
    throw new Error(e);
  }
};

export const searchCoustomer = async (query: any) => {
  try {
    let key = query.key.toLowerCase();
    if (typeof key !== "string") {
      throw new Error("Invalid search key. Expected a string.");
    }
    let result = await coustomerModel.find({
      $or: [{ cou_name: { $regex: key } }],
    });
    return result;
  } catch (e: any) {
    throw new Error(e);
  }
};
