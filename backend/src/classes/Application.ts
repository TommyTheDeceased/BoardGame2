import express, { Express } from "express";
import socketio from "socket.io";
import http, { Server } from "http";
import { join } from "path";

export default class Application {
  public app!: Express;
  public http!: Server;
  public io!: socketio.Server;

  constructor(private port: number) {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new socketio.Server(this.http);
    this.start();
  }

  start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(join(__dirname, "..", "..", "public")));
    this.http.listen(this.port, () => {
      console.log("connect to express backend");
    });
  }
}
