import { Socket, Server } from "socket.io";
import { EventStrings } from "../types/enums";

export default class Document {
  constructor(private socket: Socket, private io: Server) {
    this.socket = socket;
    this.io = io;
    this.listen();
  }

  // ***************************************************************************

  // text change
  private textChange(delta: string) {
    this.socket.broadcast.emit("textChange", delta);
  }

  // ***************************************************************************

  // listen
  private listen() {
    // text change
    this.socket.on(EventStrings.textChange, (delta: string) => {
      this.textChange(delta);
    });
  }
}
