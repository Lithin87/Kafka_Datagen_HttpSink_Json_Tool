import  express from 'express';
import { requests } from './Kafka_Request.js';
import { getIPAddress } from './Kafka_Request_VM.js';
import cors from 'cors';
import dotenv from 'dotenv';
import http from  'http';
import WebSocketManager from './WebSocketManager.js';

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors({ origin: process.env.FRONTEND_HOST })); 
const server = http.createServer(app);
export default new WebSocketManager(server);


let services = [];
const questions = {
  1 : 'Create a VM',
  2 :'Get a list of all connector plugins',
  3 : 'Create a template connector based on Avro Schema',
  4 :'Create a template connector based on JSON message',
  5 :'Create a connector based on Configuration',
  6 : 'Delete a VM',
  7 :'Delete all the topics',
  8 :'Delete all the connector'
};



app.get('/services', (req, res) => {
  res.status(200).json(questions);
});

app.get('/services/ipaddress', async (req, res) => {
  await getIPAddress().then(  res.status(200).json(ips[1]) ).catch(m => {res.status(409); console.log("\nVM is NOT created : \n") } )
});

function checkSuccess(s) {
  if (s === undefined || (s.details && s.details.length == 0) || Object.keys(s).length === 0) s = "Already done";
  return s;
}

app.get('/services/:id', (req, res) => {
  const itemId = req.params.id;
  
  const printSuccess = s => {  res.status(200).json({ message: checkSuccess(s) })};
  const printError = error => {  res.status(400).json({ message: "Error occured. "+error})};

  switch (parseInt(itemId)) {
    case 1:
        requests[1]().then(printSuccess).catch(printError);
        break;
    case 2:
        requests[2]().then(printSuccess).catch(printError);
        break;
    case 6:
        requests[6]().then(printSuccess).catch(printError);
        break;
    case 7:
        requests[7]().then(printSuccess).catch(printError);
        break;
    case 8:
        requests[8]().then(printSuccess).catch(printError);
        break;
    case 10:
        requests[10]().then(printSuccess).catch(printError);
        break;
    default:
        res.status(404).json({ message: "Invalid index for GET. Use only 1,2,6,7,8,10"})
        console.log('Invalid index for GET. Use only 1,2,6,7,8,10');
        break;
}

});


app.post('/services/:id', (req, res) => {
  const itemId = req.params.id;
  const body = req.body;
  // console.dir(body, { depth : null});
  const rate = req.query.rate;
  const set = req.query.set;
  // console.log("SET"+set);
  const printSuccess = s => {  res.status(200).json({ message: s })};
  const printError = error => {  res.status(400).json({ message: "Error occured. "+error})};

  
    switch (parseInt(itemId)) {
      case 3:
          requests[3](body.schema,body.url,rate, set).then(printSuccess);
          break;
      case 4:
          requests[4](body.schema,body.url,rate, set).then(printSuccess).catch(printError);
          break;
      case 5:
          requests[5](body.schema).then(printSuccess).catch(printError);
          break;
      case 9:
          requests[9](body.schema).then(printSuccess).catch(printError);
          break;
      default:
        res.status(404).json({ message: "Invalid index for POST. Use only 3,4,5"})
        console.log('Invalid index for POST. Use only 3,4,5');
          break;
  }
  
});



app.use((req, res) => {
  res.status(404).json({ message: 'URL Route not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


