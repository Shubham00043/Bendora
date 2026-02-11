
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { parse } from "node:url";
import { networkInterfaces } from "node:os";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("join_room", (matchId) => {
      socket.join(matchId);
      console.log(`User ${socket.id} joined room ${matchId}`);
    });

    socket.on("send_message", (data) => {
      // Broadcast to everyone in the room INCLUDING sender (or exclude sender if optimistic UI)
      // data should contain { matchId, content, senderId, ... }
      io.to(data.matchId).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
      
      const nets = networkInterfaces();
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]!) {
          if (net.family === 'IPv4' && !net.internal) {
            console.log(`> Network access: http://${net.address}:${port}`);
          }
        }
      }
    });
});
