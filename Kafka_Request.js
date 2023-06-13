import gaxios , {request} from 'gaxios';
import jp from 'jsonpath';
import Kafka from 'node-rdkafka';
import {  getIPAddress } from  './VM_Manager.js';

const adminClient = Kafka.AdminClient.create({
  'client.id': 'kafka-admin',
  'metadata.broker.list': '104.197.189.100:9101',
  'socket.timeout.ms': 5000, 
});

 
  

gaxios.instance.defaults = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': ['application/json']
  }
}

let pre_template = JSON.stringify({
  "name": "Datagen_pre_template",
  "config": {
    "connector.class": "io.confluent.kafka.connect.datagen.DatagenConnector",
    "name": "Datagen_pre_template",
    "schema.string": "{\"connect.name\":\"lithin.personal.ust_data\",\"fields\":[{\"name\":\"Name\",\"type\":{\"type\":\"string\",\"arg.properties\":{\"regex\":\"User_[1-9]{0,1}\"}}},{\"name\":\"office\",\"type\":\"string\"},{\"name\":\"user_id\",\"type\":\"string\"},{\"name\":\"employee_id\",\"type\":\"long\"},{\"name\":\"cubicle_num\",\"type\":\"int\"}],\"name\":\"ust_data\",\"namespace\":\"lithin.personal\",\"type\":\"record\"}",
    "tasks.max": "1",
    "kafka.topic": "Template_Schema"
  }
});

let file_schema = JSON.stringify({
  "name": "Datagen_file_schema",
  "config": {
    "connector.class": "io.confluent.kafka.connect.datagen.DatagenConnector",
    "name": "Datagen_file_schema",
    "schema.string": "{\"connect.name\":\"lithin.personal.ust_data\",\"name\":\"ust_data\",\"namespace\":\"lithin.personal\",\"type\":\"record\",\"fields\":[{\"name\":\"store_id\",\"type\":{\"type\":\"int\",\"arg.properties\":{\"range\":{\"min\":1,\"max\":100}}}},{\"name\":\"order_lines\",\"type\":{\"type\":\"array\",\"items\":{\"name\":\"order_line\",\"type\":\"record\",\"fields\":[{\"name\":\"product_id\",\"type\":{\"type\":\"int\",\"arg.properties\":{\"range\":{\"min\":1,\"max\":100}}}},{\"name\":\"category\",\"type\":{\"type\":\"string\",\"arg.properties\":{\"regex\":\"User_[1-9]{0,1}\"}}},{\"name\":\"quantity\",\"type\":{\"type\":\"int\",\"arg.properties\":{\"range\":{\"min\":1,\"max\":100}}}},{\"name\":\"unit_price\",\"type\":{\"type\":\"float\",\"arg.properties\":{\"range\":{\"min\":0.1,\"max\":10}}}},{\"name\":\"net_price\",\"type\":{\"type\":\"float\",\"arg.properties\":{\"range\":{\"min\":0.1,\"max\":10}}}}]},\"arg.properties\":{\"length\":{\"min\":1,\"max\":5}}}}]}",
    "tasks.max": "1",
    "kafka.topic": "Regex_Schema"
  }
});

let ConnectorBaseUrl;

const  del_connectors = (a) => { request({ url: a+'/connectors' }).then((response) => {
  if ( response.data.length  == 0)
  {console.log("No Connectors present")}
  else{
  response.data.forEach((element) => {
      request({ url: a+`/connectors/${element}`, method: 'delete' }).then(console.log(element + " : DELETED"));
  })}
})}


// Example request objects
const request1 = () => {getIPAddressURL().then(a => { request({ url: a+'/connector-plugins' }).then(printScreenData)  })}
const request2 = () => {getIPAddressURL().then(a => { request({ url: a+'/connectors', method: 'POST', data: pre_template }).then(printScreenData).catch(printScreen) })}
const request3 = () => {getIPAddressURL().then(a => { del_connectors(a) }   )}
const request4 = () => {getIPAddressURL().then(a => { request({ url: a+'/connectors', method: 'POST', data: file_schema }).then(printScreenData).catch(printScreen) })}
// const request4 = () => { method: 'POST', url: 'https://example.com/api/data2', body: { name: 'John', age: 30 } };
// const request5 = () => { method: 'POST', url: 'https://example.com/api/data2', body: { name: 'John', age: 30 } };
// const request6 = () => { method: 'POST', url: 'https://example.com/api/data2', body: { name: 'John', age: 30 } };
// const request7 = () => { method: 'POST', url: 'https://example.com/api/data2', body: { name: 'John', age: 30 } };
// const request8 = () => { method: 'POST', url: 'https://example.com/api/data2', body: { name: 'John', age: 30 } };



const requests = [request1, request2, request3, request4];


async function getIPAddressURL() {
  const ipAddress = await getIPAddress();
  const ConnectorBaseUrl = 'http://' + ipAddress + ':8083';
  const RestBaseUrl = 'http://' + ipAddress + ':8082';
  return ConnectorBaseUrl;
}

const printScreen = (response) => {      console.dir(jp.query(response, "$..response.data.message"))  }
const printScreenData = (response) => console.dir(response.data, { depth : null})  

export function selector(index)
{
  return requests[index];
}








