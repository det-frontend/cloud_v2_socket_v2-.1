"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDbs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// const connectDbs = (dbUrl: string) => {
//   try {
//     const dbLink = config.get<string>(dbUrl); //get db url from config default
//     const connectionDb = mongoose.createConnection(dbLink, connectionOptions);
//     connectionDb.on("connected", () => {
//       console.log(`Connected to ${dbUrl} database`);
//     });
//     return connectionDb;
//   } catch (error) {
//     console.error(`Error:${error.message}`);
//     process.exit(1);
//   }
// };
function connectDbs(dbUrl) {
    const dbLink = config_1.default.get(dbUrl); //get db url from config default
    let cachedDb = mongoose_1.default.createConnection(dbLink, connectionOptions);
    cachedDb.once("open", () => {
        console.log(`Connected to ${dbUrl} database`);
    });
    return cachedDb;
}
exports.connectDbs = connectDbs;
exports.default = connectDbs;
