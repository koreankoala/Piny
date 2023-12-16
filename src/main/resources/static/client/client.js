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

const ws = new WebSocket("ws://localhost:3001");

ws.on("open", () => {
  console.log("WebSocket connection opened");
  ws.send("Hello, server!");
});

ws.on("message", (msg) => {
  console.log(`Received message from server: ${msg}`);
});

const axios = require('axios');

// Example usage
axios.get('http://localhost:3001/sendToClient', {
  params: {
    message: '안녕하세요 여기는 화재 알리미 피니 본부입니다',
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