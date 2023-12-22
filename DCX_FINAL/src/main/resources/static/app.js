// const express = require("express");
// const ws = require("ws");

// const app = express();

// // Define a simple route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// const httpServer = app.listen(3001, (err) => {
//   if (err) {
//     console.error('Error starting server:', err);
//   } else {
//     console.log("서버가 3001번 포트로 동작합니다.");
//   }
// });

// const webSocketServer = new ws.Server({
//   server: httpServer,
// });

// webSocketServer.on("connection", (ws, request) => {
//   // Extract the client's IP address from the request object
//   const ip = request.connection.remoteAddress;
  
//   ws.on("message", (msg) => {
//     console.log(`${msg} [${ip}]`);
//     ws.send(`${msg} 메세지를 확인했어요.`);
//   });
// });

const express = require("express");
const ws = require("ws");

const app = express();

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const httpServer = app.listen(3001, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log("서버가 3001번 포트로 동작합니다.");
  }
});

const webSocketServer = new ws.Server({
  server: httpServer,
});

webSocketServer.on("connection", (ws, request) => {
  // Extract the client's IP address from the request object
  const ip = request.connection.remoteAddress;
  
  ws.on("message", (msg) => {
    console.log(`${msg} [${ip}]`);
    
    // 클라이언트에서 메시지를 받으면, 다시 클라이언트에게 메시지를 보냅니다.
    ws.send(`서버에서 클라이언트로: ${msg} 메세지를 확인했어요.`);
  });

  // 클라이언트에게 메시지를 보내는 함수
  ws.sendToClient = (message) => {
    ws.send(message);
  };
});

// 예제: 서버에서 클라이언트로 메시지 보내기 (수동으로)
app.get('/sendToClient', (req, res) => {
  const message = req.query.message || '서버에서 보내는 메시지';
  webSocketServer.clients.forEach(client => {
    // 서버에서 클라이언트로 메시지를 수동으로 보내는 부분
    client.sendToClient(message);
  });
  res.send('메시지를 성공적으로 전송했습니다.');
});