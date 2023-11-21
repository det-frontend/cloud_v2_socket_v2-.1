import mongoose, { Connection, Schema } from "mongoose";
import { dbDistribution } from "../utils/helper";
import connectDbs from "../utils/connect";
import moment from "moment-timezone";



const kyawsanDb: Connection = connectDbs('kyawsan_DbUrl');
const chawsuDb: Connection = connectDbs('common_DbUrl');

export interface stockBalanceDocument extends mongoose.Document{
    stationId: string;
    tank: string,
    opening:number,
    adjust: number,
    issue: number,
    receive: number,
    balance: number,
    todayTank: number,
    yesterdayTank: number,
    totalIssue: number,
    todayGL: number,
    totalGL: number,
    accessDb: string,
    realTime: string,
    createdAt: Date,
    updatedAt:Date
};

const stockBalanceSchema = new Schema({
    stationId: {
        type: Schema.Types.ObjectId,
        ref: dbDistribution(this),
        require: true
    },
    tank: { type: String, required: true },
    opening: { type: Number, required: true },
    adjust: { type: Number, required: true },
    issue: { type: Number, required: true },
    receive: { type: Number, required: true },
    balance: { type: Number, required: true },
    todayTank: { type: Number, required: true },
    yesterdayTank: { type: Number, required: true },
    totalIssue: { type: Number, required: true },
    todayGL: { type: Number, required: true },
    totalGL: { type: Number, required: true },
    accessDb: { type: String, required: true },
    realTime: { type: String },
}, {
    timestamps:true
});



const ksStockBalanceModel = kyawsanDb.model<stockBalanceDocument>(
    "stockBalance",
    stockBalanceSchema
);
const csStockBalanceModel = chawsuDb.model<stockBalanceDocument>(
    "stockBalance",
    stockBalanceSchema
);



export { ksStockBalanceModel, csStockBalanceModel };