import { getStockBalanceDatePagiHandler, stockBalanceAdjustHandler } from "../controller/stockBalance.controller";
import { modelController } from "../middleware/modelControl";
import { hasAnyPermit } from "../middleware/permitValidator";
import { validateToken } from "../middleware/validator";


const stockBalanceRoute = require("express").Router();

stockBalanceRoute.get(
    "/bydate/pagi/:page",
    validateToken,
    hasAnyPermit(["view"]),
    modelController,
    getStockBalanceDatePagiHandler
);

stockBalanceRoute.patch(
    "/adjust",
    validateToken,
    hasAnyPermit(["add"]),
    modelController,
    stockBalanceAdjustHandler
)

export default stockBalanceRoute;