import { Socket, Server } from "socket.io";
import { USERS } from "../types/users";

export default class User {
  constructor(private socket: Socket, private io: Server) {
    this.socket = socket;
    this.io = io;
    this.listen();
  }

  // user connects
  private listen() {
    console.log(`Client ${this.socket.id} joined!`);

    // TODO: fix this, on connect send user the list of hardcoded users

    this.socket.on("textChange", (delta: string) => {
      this.socket.broadcast.emit("textChange", delta);
    });
  }
}
