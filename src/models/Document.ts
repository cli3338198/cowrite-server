import { Socket, Server } from "socket.io";

export default class Document {
  constructor(private socket: Socket, private io: Server) {
    this.socket = socket;
    this.io = io;
    this.listen();
  }

  private listen() {}
}
