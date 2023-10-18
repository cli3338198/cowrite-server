import { Socket, Server } from "socket.io";
import { USERS } from "../types/users";
import { EventStrings } from "../types/enums";
import { User as InterfaceUser } from "../types/interfaces";

export default class User {
  public id: Socket["id"];
  constructor(
    private socket: Socket,
    private io: Server,
    private users: User[]
  ) {
    this.socket = socket;
    this.io = io;
    this.id = socket.id;
    this.listen();
  }

  // remove the user when disconnects
  private removeUser() {
    this.users = this.users.filter((user) => user.id !== this.id);
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

    // select a user
    this.socket.on(EventStrings.selectUser, (id: InterfaceUser["id"]) => {
      // TODO: fix this, to make changes to database
      USERS.find((user) => user.id === id)!.isOnline = true;
      // send user data along with all user's documents to client

      // create a new document, make sure it's a new socket!
    });

    this.socket.on(EventStrings.textChange, (delta: string) => {
      this.socket.broadcast.emit("textChange", delta); // TODO: moves this to document class
    });

    // remove a user TEST: TODO:
    this.socket.on("TEST", (data: string) => {
      console.log(data, "did this trigger!");
      console.log(
        "disconnect before",
        this.users.map((u) => u.id)
      );
      this.removeUser();
      console.log(
        "disconnect after",
        this.users.map((u) => u.id)
      );
    });
  }
}
