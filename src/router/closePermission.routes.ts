import { addPermissionHandler, deletePermissionHandler, getClosePermissionHandler, updatePermissionHandler } from "../controller/closePermission.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { closePermissionShcema } from "../schema/scheama";


const closePermissionRoute = require("express").Router();

closePermissionRoute.get("/", validateToken, getClosePermissionHandler);

closePermissionRoute.post("/add-permission", validateToken,roleValidator(['admin']),validateAll(closePermissionShcema),addPermissionHandler);

closePermissionRoute.patch("/permission", validateToken, updatePermissionHandler);

closePermissionRoute.delete('/permission/delete', validateToken, roleValidator(['admin']), deletePermissionHandler
);



export default closePermissionRoute;``