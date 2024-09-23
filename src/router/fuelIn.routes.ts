import {
  addAtgFuelInHandler,
  addFuelInHandler,
  deleteFuelInHandler,
  getFuelInByDateHandler,
  getFuelInHandler,
  getFuelInWithoutPagiByDateHandler,
  updateFuelInHandler,
} from "../controller/fuelIn.controller";
import {
  locSevModelControl,
  modelController,
} from "../middleware/modelControl";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId, fuelInSchema } from "../schema/scheama";
const fuelInRoute = require("express").Router();

fuelInRoute.get(
  "/pagi/:page",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getFuelInHandler
);

fuelInRoute.get(
  "/pagi/by-date/:page",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getFuelInByDateHandler
);

fuelInRoute.get(
  "/without-pagi/by-date/",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getFuelInWithoutPagiByDateHandler
);



fuelInRoute.post(
  "/",
  // validateToken,
  // roleValidator(["manager", "det"]), //In that one role is manager
  // hasAnyPermit(["add"]),
  validateAll(fuelInSchema),
  // modelController,
  locSevModelControl,
  addFuelInHandler
);

fuelInRoute.post(
  '/cloud/atg',
  validateAll(fuelInSchema),
  locSevModelControl,
  addAtgFuelInHandler
);



fuelInRoute.patch(
  "/",
  validateToken,
  roleValidator(["manager", "det"]),
  hasAnyPermit(["edit"]),
  validateAll(allSchemaId),
  modelController,
  updateFuelInHandler
);
fuelInRoute.delete(
  "/",
  validateToken,
  roleValidator(["manager", "det"]),
  hasAnyPermit(["delete"]),
  validateAll(allSchemaId),
  modelController,
  deleteFuelInHandler
);

export default fuelInRoute;
