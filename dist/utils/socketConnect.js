"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const closePermission_service_1 = require("../service/closePermission.service");
function setupSocket(server) {
    const io = require("socket.io")(server, {
        allowEIO3: true // false by default
    });
    io.of("/change-mode").on("connection", (socket) => {
        socket.on("checkMode", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield (0, closePermission_service_1.getAClosePermissionService)("kyaw_san", { stationDetailId: data });
                if (result) {
                    yield (0, closePermission_service_1.deletePermissionService)(data, "kyaw_san");
                    io.emit(data, result.stationDetailId);
                }
            }
            catch (error) {
                // Handle the error appropriately, for example, log it or send an error response to the client
                console.error("Error in checkMode:", error);
            }
        }));
    });
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    return io;
}
exports.default = setupSocket;
