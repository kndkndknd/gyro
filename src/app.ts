import Express from "express"; 
import Path from "path"
import Https from 'https'
import * as fs from 'fs'
const app: Express.Express = Express();
const port: number = 3000;

import * as WebSocket from 'ws'
const wss: WebSocket.Server = new WebSocket.Server({ port: 3333 });


app.use(Express.static(Path.join(__dirname, 'client')));

const viewPath:string = '/home/knd/gits/gyro/view'
app.get('/', function(req, res) {
  res.sendFile(viewPath + '/index.html')
});

const httpskey = {
  key: fs.readFileSync(process.env.HOME + '/keys/privkey.pem'),
  cert: fs.readFileSync(process.env.HOME + '/keys/cert.pem')
}

const server:Https.Server = Https.createServer(httpskey,app)
server.listen(port);

wss.on('connection', function connection(ws:any) {
  console.log(ws)
  ws.on('message', function incoming(message:any) {
    const data = JSON.parse(message)
    console.log(data.message);
    switch(data.message) {
      default:
        console.log(data)
        break;
    }
  });
});
