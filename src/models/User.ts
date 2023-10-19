import { Socket, Server } from "socket.io";
import { USERS } from "../types/users";
import { EventStrings } from "../types/enums";
import { User as InterfaceUser } from "../types/interfaces";

export default class User {
  public id: Socket["id"];
  constructor(private socket: Socket, private io: Server) {
    this.socket = socket;
    this.io = io;
    this.id = socket.id;
    this.listen();
  }

  // ***************************************************************************

  // transmit client connect to documents with that client as an editor TODO:

  // transmit client disconnect to documents with that client as an editor TODO:

  // get users
  // TODO: fix this, on connect send user the list of hardcoded users
  // TODO: fix so this only sends available users
  private getUsers() {
    // change this to get a list of available users TODO:
    this.io
      .to(this.socket.id)
      .emit(EventStrings.getUsers, JSON.stringify(USERS));
  }

  // select user
  private selectUser(id: InterfaceUser["id"]) {
    // TODO: fix this, to make changes to database
    const user = USERS.find((user) => user.id === id)!;
    user.isOnline = true;

    // send user data along with all user's documents to client

    // create a new document, make sure it's a new socket!

    this.io.to(this.socket.id).emit(EventStrings.selectUser, user); // TODO:
  }

  // connect
  // TODO: broadcast to all documents that user is editor
  private connect() {}

  // disconnect
  private disconnect() {
    console.log(this.socket.id, "<==== this guy just logged off");

    // log all connected clients
    this.io.fetchSockets().then((d) =>
      console.log(
        d.map((d) => d.id),
        "<--- after disconnect"
      )
    );
  }

  // ***************************************************************************

  // listen
  private listen() {
    console.log(`Client ${this.socket.id} joined!`);

    // connect
    this.connect();

    // get users
    this.socket.on(EventStrings.getUsers, () => {
      this.getUsers();
    });

    // select user
    this.socket.on(EventStrings.selectUser, (id: InterfaceUser["id"]) => {
      this.selectUser(id);
    });

    // disconnect TODO: broadcast to all documents that user is editor
    this.socket.on(EventStrings.disconnect, () => {
      this.disconnect();
    });
  }
}
