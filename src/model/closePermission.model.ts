import mongoose,{Connection,Schema} from "mongoose";
import connectDbs from "../utils/connect";

const controlDb = connectDbs("controlDbUrl");



export interface closePermissionDocument extends mongoose.Document{
    stationDetailId:string,
    mode:string,
};

const closePermissionSchema = new Schema({
    stationDetailId: { type: String, required: true },
    mode: { type: String, required: true }
}, {
    timestamps:true
});

const closePermissionModel = controlDb.model<closePermissionDocument>(
    "closePermission",
    closePermissionSchema
);



export default closePermissionModel ;
