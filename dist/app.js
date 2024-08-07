"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const user_routes_1 = __importDefault(require("./router/user.routes"));
const fuelIn_routes_1 = __importDefault(require("./router/fuelIn.routes"));
const role_routes_1 = __importDefault(require("./router/role.routes"));
const permit_routes_1 = __importDefault(require("./router/permit.routes"));
const stationDetail_routes_1 = __importDefault(require("./router/stationDetail.routes"));
const dailyReport_routes_1 = __importDefault(require("./router/dailyReport.routes"));
const detailSale_routes_1 = __importDefault(require("./router/detailSale.routes"));
const fuelBalance_routes_1 = __importDefault(require("./router/fuelBalance.routes"));
const checkStation_routes_1 = __importDefault(require("./router/checkStation.routes"));
const temp_routes_1 = __importDefault(require("./router/temp.routes"));
const collection_routes_1 = __importDefault(require("./router/collection.routes"));
const tankData_routes_1 = __importDefault(require("./router/tankData.routes"));
const stockbalance_routes_1 = __importDefault(require("./router/stockbalance.routes"));
const closePermission_routes_1 = __importDefault(require("./router/closePermission.routes"));
const socketConnect_1 = __importDefault(require("./utils/socketConnect"));
const casherCode_routes_1 = __importDefault(require("./router/casherCode.routes"));
const logMiddleware_1 = require("./middleware/logMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)());
app.use((0, cors_1.default)({ origin: "*" }));
app.use(logMiddleware_1.requestLogger);
app.use(logMiddleware_1.dbLogger);
app.use(logMiddleware_1.errorLogger);
const server = require("http").createServer(app);
//require data
const port = config_1.default.get("port");
const host = config_1.default.get("host");
// request routes
app.get("/api", (req, res, next) => {
    res.send("ok");
});
//app => routes => controller => service => model
//control db
app.use("/api/user", user_routes_1.default);
app.use("/api/role", role_routes_1.default);
app.use("/api/permit", permit_routes_1.default);
app.use("/api/collection", collection_routes_1.default);
app.use("/api/check-station", checkStation_routes_1.default);
app.use("/api/temp", temp_routes_1.default);
// each station db route
app.use("/api/station-detail", stationDetail_routes_1.default); //that for define station's detail
app.use("/api/detail-sale", detailSale_routes_1.default); //need station
app.use("/api/fuelIn", fuelIn_routes_1.default); //need station
app.use("/api/daily-report", dailyReport_routes_1.default); //need station *
app.use("/api/fuel-balance", fuelBalance_routes_1.default); //need station *
app.use("/api/tank-data", tankData_routes_1.default);
app.use("/api/stock-balance", stockbalance_routes_1.default);
app.use("/api/close-permission", closePermission_routes_1.default);
app.use("/api/casher-code", casherCode_routes_1.default);
// app.use("/api/debt", debtRoute);
// app.use("/api/customer", coustomerRoute);
//Error Routes
app.use((err, req, res, next) => {
    err.status = err.status || 409;
    res.status(err.status).json({
        con: false,
        msg: err.message,
    });
});
//migrate
// migrate();
// // back up
// backup(dbUrl);
const memoryUsage = process.memoryUsage();
console.log(`Memory usage: ${memoryUsage.rss / 1024 / 1024} MB`);
let io = (0, socketConnect_1.default)(server);
server.listen(port, () => console.log(`server is running in  http://${host}:${port}`));
exports.default = io;
