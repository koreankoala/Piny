// const WebSocket = require("ws");

// const ws = new WebSocket("ws://localhost:3001");

// ws.on("open", () => {
//   console.log("WebSocket connection opened");
//   ws.send("Hello, server!");
// });

// ws.on("message", (msg) => {
//   console.log(`Received message from server: ${msg}`);
// });

// ws.on("close", (code, reason) => {
//   console.log(`WebSocket connection closed: ${code} - ${reason}`);
// });

const WebSocket = require("ws");

// 원래 작동
// const ws = new WebSocket("ws://localhost:3001");
// 서버 채팅
const ws = new WebSocket("ws://172.30.1.88:3001");

ws.on("open", () => {
  console.log("WebSocket connection opened");
  ws.send("Hello, server!");
});

ws.on("message", (msg) => {
  console.log(`Received message from server: ${msg}`);
});

const axios = require('axios');

// 알림 
axios.get('http://localhost:3001/sendToClient', {
  params: {
    message: '안녕하세요 여기는 화재 알리미 피니 본부입니다',
    message: '담배가 탐지 되었습니다'
  },
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });


ws.on("close", (code, reason) => {
  console.log(`WebSocket connection closed: ${code} - ${reason}`);
});