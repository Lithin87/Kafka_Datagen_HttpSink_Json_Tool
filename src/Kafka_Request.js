import gaxios , {request} from 'gaxios';
import jp from 'jsonpath';
import ld from 'lodash';
import generate  from './Avro-schema-generator.js';
import { createInstance, deleteInstance } from './Kafka_Request_VM.js';
import { ChatGPTAPI } from 'chatgpt';

gaxios.instance.defaults = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': ['application/json']
  }
}


let template = {
  "name": "Datagen_pre_template",
  "config": {
    "connector.class": "io.confluent.kafka.connect.datagen.DatagenConnector",
    "name": "Datagen_pre_template",
    "schema.string": "{\"connect.name\":\"ust.boots\",\"fields\":[{\"name\":\"Name\",\"type\":{\"type\":\"string\",\"arg.properties\":{\"regex\":\"User_[1-9]{0,1}\"}}},{\"name\":\"office\",\"type\":\"string\"},{\"name\":\"user_id\",\"type\":\"string\"},{\"name\":\"employee_id\",\"type\":\"long\"},{\"name\":\"cubicle_num\",\"type\":\"int\"}],\"name\":\"boots\",\"namespace\":\"ust\",\"type\":\"record\"}",
    "tasks.max": "1",
    "kafka.topic": "Template_Schema",
    "max.interval" : "500"
  }
};

let file_schema = {
  "name": "Datagen_file_schema",
  "config": {
    "connector.class": "io.confluent.kafka.connect.datagen.DatagenConnector",
    "name": "Datagen_file_schema",
    "schema.string": "{\"connect.name\":\"ust.boots\",\"name\":\"boots\",\"namespace\":\"ust\",\"type\":\"record\",\"fields\":[{\"name\":\"store_id\",\"type\":{\"type\":\"int\",\"arg.properties\":{\"range\":{\"min\":1,\"max\":100}}}},{\"name\":\"order_lines\",\"type\":{\"type\":\"array\",\"items\":{\"name\":\"order_line\",\"type\":\"record\",\"fields\":[{\"name\":\"product_id\",\"type\":{\"type\":\"int\",\"arg.properties\":{\"range\":{\"min\":1,\"max\":100}}}},{\"name\":\"category\",\"type\":{\"type\":\"string\",\"arg.properties\":{\"regex\":\"User_[1-9]{0,1}\"}}},{\"name\":\"quantity\",\"type\":{\"type\":\"int\",\"arg.properties\":{\"range\":{\"min\":1,\"max\":100}}}},{\"name\":\"unit_price\",\"type\":{\"type\":\"float\",\"arg.properties\":{\"range\":{\"min\":0.1,\"max\":10}}}},{\"name\":\"net_price\",\"type\":{\"type\":\"float\",\"arg.properties\":{\"range\":{\"min\":0.1,\"max\":10}}}}]},\"arg.properties\":{\"length\":{\"min\":1,\"max\":5}}}}]}",
    "tasks.max": "1",
    "kafka.topic": "Template_Schema",
    "max.interval" : "500"
  }
};

let sink_url = {
  "name": "HttpSinkConnectorConnector_0",
  "config": {
    "value.converter.schema.registry.url": "http://schema-registry:8081",
    "name": "HttpSinkConnectorConnector_0",
    "connector.class": "io.confluent.connect.http.HttpSinkConnector",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "topics": "Template_Schema",
    "http.api.url": "https://target-400-bxlquyhk2q-uc.a.run.app",
    "request.method": "post",
    "reporter.result.topic.name": "success_topic",
    "reporter.result.topic.replication.factor": "1",
    "reporter.result.topic.partitions": "1",
    "reporter.error.topic.name": "error_topic",
    "reporter.error.topic.replication.factor": "1",
    "reporter.error.topic.partitions": "1",
    "reporter.bootstrap.servers": "broker:29092",
    "tasks.max": "1",
    "behavior.on.error": "log",
    "max.retries": "1",
    "retry.backoff.ms": "1",
    "consumer.max.poll.records":"1",
    "errors.deadletterqueue.topic.name": "dead_topic",
    "errors.deadletterqueue.topic.replication.factor": "1",
    "errors.tolerance": "all",
    "errors.retry.timeout": "0",
    "errors.retry.delay.max.ms": "0"
  }
};

function flattenObject(obj) {
  let result = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result = { ...result, ...flattenObject(obj[key]) };
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

const schema_replace_s = (schema,rate) => { 
  if( schema ) ld.set(template, ['config', 'schema.string'], schema); 
  if( rate ) ld.set(template, ['config', 'max.interval'], rate); 
  return JSON.stringify(template)}

const schema_replace_f = (json,rate) => {
   if( json ) ld.set(file_schema, ['config', 'schema.string'], JSON.stringify(generate(json)));  
   if( rate ) ld.set(file_schema, ['config', 'max.interval'], rate);  
   return JSON.stringify(file_schema) }

const schema_replace_t = (template_user) => { if( template_user ) return template_user; else  return JSON.stringify(template)}

const schema_replace_url = (url) => { if( url != "" && url != undefined) ld.set(sink_url, ['config', 'http.api.url'], url); return JSON.stringify(sink_url)}


const connector_call = (template) =>  request({ url: ips[0]+'/connectors', method: 'POST', data: template }).then(printData).catch(printError) 


const req1 =  () =>  createInstance().catch(e => {return e});
const req2 =   () => request({ url: ips[0]+'/connector-plugins' }).then( printDataFull ).catch(printError)    

const  req3 = async (schema,url,rate) =>     { 
const response = await delete_topics();
const SourceConnector  =  await connector_call(schema_replace_s(JSON.stringify(schema),rate));
const DestinationConnector = await (connector_call(schema_replace_url(url)));
return Object.entries({SourceConnector , DestinationConnector}).map(([key, value]) => `${key} : ${value[0]}`).join('\n');
}

const req4 = async (schema,url,rate) => { 
const response = await delete_topics();
if (typeof schema === 'object')  schema = JSON.stringify(schema);
const SourceConnector =  await connector_call(schema_replace_f(schema,rate));
const DestinationConnector = await (connector_call(schema_replace_url(url)));
return Object.entries({SourceConnector , DestinationConnector}).map(([key, value]) => `${key} : ${value[0]}`).join('\n');
}

const req5 = async (schema,url) => { 
const response = await delete_topics();
const SourceConnector =  await connector_call(schema_replace_t(schema));
const DestinationConnector = await (connector_call(schema_replace_url(url)));
return Object.entries({SourceConnector , DestinationConnector}).map(([key, value]) => `${key} : ${value[0]}`).join('\n');
}

async function delete_topics() {
  await get_clusterId();
  let error ="";
  await request({ url: ips[2] + '/subjects/' + "Template_Schema-value", method: 'DELETE' }).catch(s => error = s.code);
  return 0;
}

const req6 =  () =>   deleteInstance().catch(e => {return e}); 
const req7 =  () => error_page();
const req8 =  () =>  del_connectors() ;
const req9 = (msg) => chatgpt(msg) ;
const req10 = () => error_log() ;

export const requests = ["dum", req1, req2, req3, req4,req5, req6, req7 , req8, req9, req10];

const  del_connectors = async () => { 
  let TotalConnectors = 'No Connectors present';
  let STATUS =[];
  await get_clusterId();

  let topic_url =   ips[4] + "/v3/clusters/"+  cluster_id + "/topics/error_topic" ;
  await request({ url: topic_url , method: 'DELETE'}).catch(s=>  s);
 
  const response = await  request({ url: ips[0]+'/connectors'}).catch(s=> error.del_con = s);
  if ( response.data.length  !== 0)
  {
    response.data.forEach( (element) => {
       request({ url: ips[0]+`/connectors/${element}`, method: 'delete' }); 
       STATUS.push(element + " : DELETED")
      });
    return "SourceConnector : Deleted \nDestinationConnector : Deleted";
}
  return TotalConnectors;
}


const  error_page = async () => { return ips[1]+"/clusters/"+cluster_id+"/management/topics/error_topic/overview"}

const  error_log = async () => { 
  if ( cluster_id !== null)
  { 
    let error_topic_url =  ips[1]+"/2.0/metrics/"+ cluster_id+ "/topic/offsets/error_topic";
    let success_topic_url =  ips[1]+"/2.0/metrics/"+ cluster_id+ "/topic/offsets/success_topic";
    
    const response = await request({ url: error_topic_url }).catch(s=> error.del_con = s);
    const response1 = await request({ url: success_topic_url }).catch(s=> error.del_con = s);
    
    return [  response.data.offsets[0].endOffset  , response1.data.offsets[0].endOffset ] 
  }
}


const printError = (response) => { 
    let msg = jp.query(response, "$..response.data.message");
   if( msg.length != 0) 
      {console.dir(msg); 
        return msg; }
      else
      { let str = "Containers aren't up..Either start the containers or Wait";
        let str1 = "VM is deleted";
        if( ips === "")
        {console.log(str1);
        return str1;}
      else
        {console.log(str); 
        return str;}
      }
    }

    
const chatgpt = async (msg) =>  {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  // console.dir(msg, { depth : null});
  if (msg == null || Object.keys(msg).length === 0)  return "Pls send json data"; 
    msg = msg + ". Also return in json format "
    const res = await api.sendMessage(msg);
    const matches = res.text.match(/```([\s\S]*?)```/g);
    return matches[0].replace(/```/g, '').replace('json', '');
  }


const printData = (response) => { let gh = jp.query(response, "$..statusText",1) ; console.log(gh); return gh} ;

const printDataFull = (response) => { console.log(response.data);  return response.data} ; 

async function get_clusterId() {
  const response = await request({ url: ips[0] }).catch(s => error.del_con = s);
  if (response.data !== 0) {
    global.cluster_id = response.data.kafka_cluster_id;
  }
}

