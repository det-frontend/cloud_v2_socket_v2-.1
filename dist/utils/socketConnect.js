"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const closePermission_service_1 = require("../service/closePermission.service");
function setupSocket(server) {
    const io = require("socket.io")(server, {
        allowEIO3: true // false by default
    });
    io.of("/change-mode").on("connection", (socket) => {
        socket.on("checkMode", async (data) => {
            try {
                let result = await (0, closePermission_service_1.getAClosePermissionService)("kyaw_san", { stationDetailId: data });
                if (result) {
                    await (0, closePermission_service_1.deletePermissionService)(data, "kyaw_san");
                    io.emit(data, result.stationDetailId);
                }
            }
            catch (error) {
                // Handle the error appropriately, for example, log it or send an error response to the client
                console.error("Error in checkMode:", error);
            }
        });
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
