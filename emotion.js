'use strict';

const five = require('johnny-five');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = 'AC64f049394dd29fb60d3329f11ee97af7';
const TWILIO_AUTH_TOKEN = 'a49efeb6d7e4c8da0b152cdc557cf5ed';
const chat = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// let led = null;
var switch_joy = 1;
var switch_surprise = 1;
var switch_sadness = 1;
var switch_disgust = 1;
var switch_anger = 1;
var force = 0;
var message = 'I miss you there! I feel alright';
var iteration = 0;

app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

var SerialPort = require("serialport");
var serialport = new SerialPort("/dev/cu.usbmodem389", {
  parser: SerialPort.parsers.readline('\n'),
  baudRate: 9600
});

var serialport_bluetooth = new SerialPort("/dev/cu.usbmodem390", {
  parser: SerialPort.parsers.readline('\n'),
  baudRate: 115200
});

serialport.on('open', function(err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }

  io.on('connection', function(client) {
    client.on('join', function(handshake) {
      // console.log(location);
    });

    client.on('joy', function(data) {
      // console.log("joy: " + String(data));
      if (data > 90) {
        if (switch_joy == 1){
          serialport.write('J');
          message ='I miss you.. I feel 😀 😬 😁 😂 😃 😄 😅 😆 😇 😉 😊 🙂 🙃 😋 😌 😍 😘'
          switch_joy = 0;
          iteration += 1;
        }
      } else {
      }
      client.emit('joy', data);
      client.broadcast.emit('joy', data);
    });

    client.on('sadness', function(data) {
      // console.log("sadness: " + String(data));
      if (data > 30) {
        if (switch_sadness == 1){
          serialport.write('U');
          message ='I miss you.. I feel 😦 😧 😢 😥 😪 😓 😭 😵 😲 🤐 😷 🤒 🤕 😴 💤 💩 😈 👿'
          switch_sadness = 0;
          iteration += 1;
        }
      } else {
      }
      client.emit('sadness', data);
      client.broadcast.emit('sadness', data);
    });

    client.on('surprise', function(data) {
      // console.log("surprise: " + String(data));
      if (data > 90) {
        if (switch_surprise == 1){
          serialport.write('S');
          message ='I miss you.. I feel 😱 😱 😱 😱 😱'
          switch_surprise = 0;
          iteration += 1;
        }
      } else {
      }
      client.emit('surprise', data);
      client.broadcast.emit('surprise', data);
    });

    client.on('anger', function(data) {
      // console.log("anger: " + String(data));
      if (data > 40) {
        if (switch_anger == 1){
          serialport.write('A');
          message ='I dont miss you.. I feel 😡 😡 😡 😡 😡 😡 '
          switch_anger = 0;
          iteration += 1;
        }
      } else {
      }
      client.emit('surprise', data);
      client.broadcast.emit('surprise', data);
    });

    client.on('disgust', function(data) {
      // console.log("disgust: " + String(data));
      if (data > 50) {
        if (switch_disgust == 1){
          serialport.write('D');
          message ='I miss you.. I feel 😐 😑 😒'
          switch_disgust = 0;
          iteration += 1;
        }
      } else {
      }
      client.emit('surprise', data);
      client.broadcast.emit('surprise', data);
    });

    if (iteration >= 2) {
      iteration = 0;
      switch_surprise = 1;
      switch_sadness = 1;
      switch_joy = 1;
      switch_anger = 1;
      switch_disgust = 1;
    }

  });

  if (iteration >= 2) {
    iteration = 0;
    switch_surprise = 1;
    switch_sadness = 1;
    switch_joy = 1;
    switch_anger = 1;
    switch_disgust = 1;
  }
});

serialport.on('data', function (data) {
  force = data;
  console.log(force);
  if (force > 700) {
    chat.sendMessage({
        to: '+12064996068',
        from: '+12065390232',
        body: message
    });
  }
});

//
// var index_d = 0;
// serialport_bluetooth.on('data', function (data) {
//   if(data.indexOf(".")==-1){
//     index_d = 0;
//   }
//   var location = [];
//   if (index_d == 0) {
//     index_d = 1;
//     if (data.length == 5){
//       location.push(data);
//     }
//   } else if (index_d === 1) {
//     index_d = 2;
//     if (data.length == 5){
//       location.push(data);
//     }
//   }
// });

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Server listening on http://localhost:${port}`);

//
// five.Board().on('ready', function() {
//   console.log('Arduino is ready.');
//   var led = new five.Led(13);
//   var switch_ = 1;
//
//   io.on('connection', function(client) {
//     client.on('join', function(handshake) {
//       // console.log(handshake);
//     });
//
//     client.on('joy', function(data) {
//       console.log("joy: " + String(data));
//       if (data > 90) {
//         led.on();
//         if (switch_ == 1){
//           chat.sendMessage({
//               to: '+12064996068',
//               from: '+12065390232',
//               body: '😀 😬 😁 😂 😃 😄 😅 😆 😇 😉 😊 🙂 🙃 😋 😌 😍 😘'
//           });
//           switch_ = 0;
//         }
//       } else {
//         led.off();
//       }
//       client.emit('joy', data);
//       client.broadcast.emit('joy', data);
//     });
//
//     client.on('sadness', function(data) {
//       console.log("sadness: " + String(data));
//       if (data > 90) {
//         led.on();
//         if (switch_ == 1){
//           chat.sendMessage({
//               to: '+12064996068',
//               from: '+12065390232',
//               body: '😦 😧 😢 😥 😪 😓 😭 😵 😲 🤐 😷 🤒 🤕 😴 💤 💩 😈 👿 '
//           });
//           switch_ = 0;
//         }
//       } else {
//         led.off();
//       }
//       client.emit('sadness', data);
//       client.broadcast.emit('sadness', data);
//     });
//
//     client.on('surprise', function(data) {
//       console.log("surprise: " + String(data));
//       if (data > 90) {
//         led.on();
//         if (switch_ == 1){
//           chat.sendMessage({
//               to: '+12064996068',
//               from: '+12065390232',
//               body: '😱 😱 😱 😱 😱 😱 😱 😱 😱 😱 😱 😱 😱 😱 😱 😱'
//           });
//           switch_ = 0;
//         }
//       } else {
//         led.off();
//       }
//       client.emit('surprise', data);
//       client.broadcast.emit('surprise', data);
//     });
//
//   });
// });
