import http from "http";
import express, { Application } from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { EventStrings } from "./types/enums";
import User from "./models/User";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./types/interfaces";

class App {
  private static readonly PORT: number = +process.env.PORT! || 5000;
  private port: number | string;
  private server: http.Server;
  private io: Server;
  private app: Application;
  private users: User[];

  constructor() {
    this.port = this.config();
    this.server = this.createServer();
    this.io = this.sockets();
    this.app = this.createApp();
    this.listen();
    this.users = [];
  }

  // create app
  private createApp() {
    const app = express();
    app.use(cors());
    return app;
  }

  // set port
  private config() {
    return process.env.PORT || App.PORT;
  }

  // create http server
  private createServer() {
    return new http.Server();
  }

  // create socket server
  // set cors
  private sockets() {
    return new Server<
      ServerToClientEvents,
      ClientToServerEvents,
      InterServerEvents,
      SocketData
    >(this.server, {
      cors: { origin: "*" },
    });
  }

  // start server
  private listen() {
    this.server.listen(this.port, () =>
      console.log(`Listening on PORT ${this.port}`)
    );

    // client connects
    this.io.on(EventStrings.connect, (socket: Socket) => {
      this.users = [...this.users, new User(socket, this.io, this.users)];

      console.log(
        "connect",
        this.users.map((user) => user.id)
      );
    });

    // client disconnects
    // this.io.on(EventStrings.disconnect, (socket: Socket) => {
    //   console.log(socket.id);
    //   // TODO:
    //   this.users = this.users.filter((user: User) => user.id !== socket.id);
    //   console.log(
    //     "close",
    //     this.users.map((user) => user.id)
    //   );
    // });
  }
}

new App();
