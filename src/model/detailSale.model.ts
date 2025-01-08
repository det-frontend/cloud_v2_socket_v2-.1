import mongoose, { Connection, Schema } from "mongoose";
import { coustomerDocument } from "./coustomer.model";
import connectDbs from "../utils/connect";
import {
  csStationDetailModel,
  ksStationDetailModel,
} from "./stationDetail.model";
import { dbDistribution, virtualFormat } from "../utils/helper";

const kyawsanDb: Connection = connectDbs("kyawsan_DbUrl");
const commonDb: Connection = connectDbs("common_DbUrl");

export interface detailSaleDocument extends mongoose.Document {
  stationDetailId: string;//in
  dailyReportDate: string;//in
  vocono: string; // in
  carNo: string; //in
  cashType: string; // in
  casherCode: string; // in
  couObjId: coustomerDocument["_id"]; // in
  isError: string; // 
  accessDb: string;
  vehicleType: string;
  depNo: string;
  nozzleNo: string;
  fuelType: string;
  salePrice: number;
  saleLiter: number;
  totalPrice: number;
  totalizer_liter: number;
  devTotalizar_liter: number;
  tankBalance: number,
  tankNo: number,
  createAt: Date;
  asyncAlready: string,
  isSent: number,
}

const detailSaleSchema = new Schema({
  stationDetailId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: dbDistribution(this),
  },
  accessDb: { type: String, required: true },
  device: { type: String },
  preset:{type:String,default:null},

  asyncAlready: { type: String, required: true, default: "0" },
  vocono: { type: String, required: true, unique: true }, //g
  carNo: { type: String, default: null }, //g
  vehicleType: { type: String, default: "car" }, //g
  depNo: { type: String, default: '0'},
  nozzleNo: { type: String, required: true }, //g
  fuelType: { type: String, required: true }, //g
  //update
  cashType: {
    type: String,
    default: "Cash",
    // enum: ["Cash", "KBZ_Pay", "Credit", "FOC", "Debt", "Others"],
  },
  casherCode: { type: String, required: true },
  couObjId: { type: Schema.Types.ObjectId, default: null },
  isError: { type: String },
  salePrice: { type: Number, required: true },
  saleLiter: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  totalizer_liter: { type: Number, required: true },
  devTotalizar_liter: {type:Number},
  totalizer_amount: { type: Number, required: true },
  tankBalance: { type: Number, default: 0},
  tankNo: { type: Number, default: 0 },
  isSent: { type: Number, default: 0 },
  dailyReportDate: {
    type: String,
    default: new Date().toLocaleDateString(`fr-CA`),
  },
  createAt: { type: Date, default: new Date() },
});

virtualFormat(detailSaleSchema, [
  'saleLiter',
  'totalizer_liter',
  'devTotalizar_liter',
  'devTotalizar_amount',
  'tankBalance',
]);

// detailSaleSchema.pre("save", function (next) {
//  console.log(this);
//  if (this.createAt) {
//    console.log("wee zzoooo");
//  }
//   next();
// });

const ksDetailSaleModel = kyawsanDb.model<detailSaleDocument>(
  "detailSale",
  detailSaleSchema
);

const csDetailSaleModel = commonDb.model<detailSaleDocument>(
  "detailSale",
  detailSaleSchema
);

export { ksDetailSaleModel, csDetailSaleModel };
