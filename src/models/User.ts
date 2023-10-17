import { Socket, Server } from "socket.io";
import { USERS } from "../types/users";
import { EventStrings } from "../types/enums";

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
    // TODO: fix so this only sends available users
    this.socket.on(EventStrings.getUsers, () => {
      // change this to get a list of available users
      this.io
        .to(this.socket.id)
        .emit(EventStrings.getUsers, JSON.stringify(USERS));
    });

    this.socket.on(EventStrings.textChange, (delta: string) => {
      this.socket.broadcast.emit("textChange", delta); // TODO: moves this to document class
    });
  }
}
