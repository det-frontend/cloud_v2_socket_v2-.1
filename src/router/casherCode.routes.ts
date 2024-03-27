import { getAllCasherCodeHandler } from "../controller/casherCode.controller";
import { modelController } from "../middleware/modelControl";
import { validateToken } from "../middleware/validator";



const casherCodeRoute = require("express").Router();


casherCodeRoute.get(
    "/",
    validateToken,
    modelController,
    getAllCasherCodeHandler
)


export default casherCodeRoute;