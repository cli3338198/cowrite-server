import { Socket, Server } from "socket.io";
import { EEventStrings } from "../types/enums";
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

    this.io
      .to(this.socket.id)
      .emit("TEST", `Client ${this.socket.id} has connected!`);

    // listen for message and shoot right back
    this.socket.on("TEST", (msg: string) => {
      this.io
        .to(this.socket.id)
        .emit(
          "TEST",
          `This is ${this.socket.id}'s message: ${msg} right back at your`
        );
    });
  }
}
