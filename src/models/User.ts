import { Socket, Server } from "socket.io";
import { EEventStrings } from "../types/enums";
import { USERS } from "../types/users";

export default class User {
  constructor(private socket: Socket, private io: Server) {
    this.socket = socket;
    this.io = io;
    this.connect();
  }

  // user joins
  // send list of users
  private connect() {
    console.log(`Client ${this.socket.id} joined!`);

    this.socket.to(this.socket.id).emit("TEST", `${this.socket.id} joined!`);
  }

  // user selects a users
}
