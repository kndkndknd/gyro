import Express from "express"; 
import Path from "path"
//import favicon from 'serve-favicon'
//const favicon = require('serve-favicon');
import Https from 'https'
//import SocketIo from 'socket.io'
import * as fs from 'fs'
//const socketio = require('socket.io')
//import * as socketio from 'socket.io'
//import {socketio} from 'socket.io'
//const Express = require('express')
//const Path = require('path')
const app: Express.Express = Express();
const port: number = 3000;

//const WebSocket = require('ws');
import * as WebSocket from 'ws'
const wss: WebSocket.Server = new WebSocket.Server({ port: 3333 });

//app.use(favicon(Path.join(__dirname, 'lib/favicon.ico')));
app.use(Express.static(Path.join(__dirname, 'client')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
  //res.render('./index.html')
});

const httpskey = {
  key: fs.readFileSync(process.env.HOME + '/keys/privkey.pem'),
  cert: fs.readFileSync(process.env.HOME + '/keys/cert.pem')
}

//const https = Https.Server(app)

//const server:Https.Server = Https.createServer(httpskey,app).listen(port);
const server:Https.Server = Https.createServer(httpskey,app)
server.listen(port);

wss.on('connection', function connection(ws:any) {
  console.log(ws)
  ws.on('message', function incoming(message:any) {
    const data = JSON.parse(message)
    console.log(data.message);
    switch(data.message) {
      default:
        console.log("year")
        break;
    }
  });
});
