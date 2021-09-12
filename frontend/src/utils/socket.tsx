import io from "socket.io-client";

export default class SocketManager {
  public socket = io("http://localhost:3001", {
    forceNew: true,
    transports: ["websocket"],
    timeout: 10000,
  });
}
