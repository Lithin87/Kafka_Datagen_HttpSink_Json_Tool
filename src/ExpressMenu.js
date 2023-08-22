import  express from 'express';
import { requests } from './Kafka_Request.js';

const app = express();
app.use(express.json());


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


app.get('/services/:id', (req, res) => {
  const itemId = req.params.id;

const printSuccess = success => { res.status(200).json({ message: success })};
const printError = error => {  res.status(400).json({ message: "Error occured. "+error})};

  switch (parseInt(itemId)) {
    case 1:
        requests[1]().then(printSuccess).catch(printError);
        break;
    case 2:
        requests[2]().then(printSuccess).catch(printError);
        break;
    case 3:
        requests[3](schema,url);
        break;
    case 4:
        requests[4](schema,url);
        break;
    case 5:
        requests[5](schema,url);
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
    default:
        console.log('Invalid index');
        break;
}

});


app.post('/services/:id', (req, res) => {
  const newItem = req.body;
  const itemId = req.params.id;
  const category = req.query.category;
  const printError = error => {  res.status(400).json({ message: "Error occured" })};
  const printSuccess = success => { res.status(200).json({ message: gh })};
  
    switch (parseInt(itemId)) {
      case 3:
          requests[3](schema,url);
          break;
      case 4:
          requests[4](schema,url);
          break;
      case 5:
          requests[5](schema,url);
          break;
      default:
          console.log('Invalid index');
          break;
  }
  
});



app.use((req, res) => {
  res.status(404).json({ message: 'URL Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
