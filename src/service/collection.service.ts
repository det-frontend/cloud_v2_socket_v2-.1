import { FilterQuery } from "mongoose";
import collectionModel, { collectionDocument } from "../model/collection.model";
import { stationDetailDocument } from "../model/stationDetail.model";

export const collectionGet = async (query: any) => {
  try {
    return await collectionModel
      .find(query)
      .lean()
      // .populate("stationCollection")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionAdd = async (body: collectionDocument) => {
  try {
    return await new collectionModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionDelete = async (
  query: FilterQuery<collectionDocument>
) => {
  try {
    return await collectionModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionAddStation = async (
  collectionId: FilterQuery<collectionDocument>,
  stationId: stationDetailDocument["_id"],
  name:string
) => {
  try {
    await collectionModel.findByIdAndUpdate(collectionId, {
      $push: { stationCollection: {stationId:stationId,stationName:name}},
    });
    return collectionModel.findById(collectionId);
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionRemoveStation = async (
  collectionId: FilterQuery<collectionDocument>,
  stationId: stationDetailDocument["_id"],
  name:string
) => {
  try {
    await collectionModel.findByIdAndUpdate(collectionId, {
      $pull: { stationCollection: {stationId:stationId,stationName:name}},
    });
    return collectionModel.findById(collectionId);
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionPPRDDPull = async (collectionId: FilterQuery<collectionDocument>,
  name: string
) => {
  try {
    await collectionModel.findByIdAndUpdate(collectionId, {
      $pull: { permission: name }
    });

    return collectionModel.findById(collectionId);
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionPPRDDPush = async (collectionId: FilterQuery<collectionDocument>,
  name: string
) => {
  try {
    await collectionModel.findByIdAndUpdate(collectionId, {
      $push: { permission: name }
    });

    return collectionModel.findById(collectionId);
  } catch (e) {
    throw new Error(e);
  }
};

// export const collectionIsPermission = async(name: string,id:string)=>{
//   try {
//     return await collectionModel
//       .find({
//         "permission": { $in: [name] },
//       })
//       .lean()
//       // .populate("stationCollection")
//       .select("-__v");
//   } catch (e) {
//     throw new Error(e);
//   }
// }