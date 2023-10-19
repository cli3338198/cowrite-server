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

  constructor() {
    this.port = this.config();
    this.server = this.createServer();
    this.io = this.sockets();
    this.app = this.createApp();
    this.listen();
  }

  // ***************************************************************************

  // create app
  private createApp() {
    const app = express();
    app.use(cors());
    return app;
  }

  // set port
  private config() {
    return App.PORT;
  }

  // create server
  private createServer() {
    return new http.Server();
  }

  // create socket
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

  // ***************************************************************************

  // listen
  private listen() {
    this.server.listen(this.port, () =>
      console.log(`Listening on PORT ${this.port}`)
    );

    // client connects
    this.io.on(EventStrings.connect, (socket: Socket) => {
      new User(socket, this.io);

      this.io.fetchSockets().then((d) =>
        console.log(
          d.map((d) => d.id),
          "<--- on connect"
        )
      );
    });
  }
}

new App();
