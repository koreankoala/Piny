const express = require("express");
const ws = require("ws");

const app = express();

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const httpServer = app.listen(3001, "0.0.0.0", (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log("Server is running on port 3001");
  }
});

const webSocketServer = new ws.Server({
  server: httpServer,
});

// Store connected clients
const clients = new Set();

// Store chat log
const chatLog = [];

webSocketServer.on("connection", (ws, request) => {
  const ip = request.connection.remoteAddress;

  // Add the new client to the set
  clients.add(ws);

  // Send the chat log to the new client
  chatLog.forEach((message) => {
    ws.send(message);
  });

  ws.on("message", (msg) => {
    console.log(`${msg} [${ip}]`);

    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(`User[${ip}]: ${msg}`);
      }
    });

    // Add the message to the chat log
    chatLog.push(`User[${ip}]: ${msg}`);
  });

  ws.on("close", () => {
    // Remove the disconnected client from the set
    clients.delete(ws);
  });
});
