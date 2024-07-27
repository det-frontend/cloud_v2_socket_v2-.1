import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { getAClosePermissionService,deletePermissionService } from '../service/closePermission.service';


 
function setupSocket(server: Server): SocketIOServer {
  const io = require("socket.io")(server, {
  allowEIO3: true // false by default
});

  io.of("/change-mode").on("connection", (socket: any) => {
  socket.on("checkMode", async (data: any) => {
    try {
      let result = await getAClosePermissionService("kyaw_san", { stationDetailId: data });
      if (result) {
        await deletePermissionService(data, "kyaw_san");
        io.emit(data, result.stationDetailId);
      }
    } catch (error) {
      // Handle the error appropriately, for example, log it or send an error response to the client
      console.error("Error in checkMode:", error);
    }
  });
  });
    
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
}

export default setupSocket;
