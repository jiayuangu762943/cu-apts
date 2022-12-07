// const producer = new Kafka({
//   logLevel: logLevel.DEBUG,
//   // brokers: [`${host}:9092`],
//   brokers: [`cuapt-kafka.servicebus.windows.net:9093`],
//   clientId: 'example-producer',
//   ssl: true,
//   sasl: {
//     mechanism: 'PLAIN',
//     username: '$ConnectionString', //do not replace $ConnectionString
//     password:
//       'Endpoint=sb://cuapt-kafka.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=p7fMhmwqIUo23OmjYB9JEbPyUYJOtwzu/shmU1EJF7A=',
//   },
// });
const Kafka = require('node-rdkafka');
// import {type ConsumerStream} from 'node-rdkafka';

const producer = new Kafka.Producer({
  //'debug' : 'all',
  'metadata.broker.list': 'cuapt-kafka.servicebus.windows.net:9093',
  // dr_cb: true,
  'security.protocol': 'sasl_ssl',
  'sasl.mechanisms': 'PLAIN',
  'sasl.username': '$ConnectionString', //do not replace $ConnectionString
  'sasl.password':
    'Endpoint=sb://cuapt-kafka.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=p7fMhmwqIUo23OmjYB9JEbPyUYJOtwzu/shmU1EJF7A=',
});
producer.setPollInterval(100);

// var topicName = 'test';

//logging debug messages, if debug is enabled
// producer.on('event.log', function(log) {
//   console.log(log);
// });

//logging all errors
// producer.on('event.error', function(err) {
//   console.error('Error from producer');
//   console.error(err);
// });

//counter to stop this sample after maxMessages are sent
var counter = 0;
var maxMessages = 10;

producer.on('delivery-report', function (err: any, report: any) {
  console.log('delivery-report: ' + JSON.stringify(report));
  counter++;
});

//Wait for the ready event before producing

// producer.on('disconnected', function(arg) {
//   console.log('producer disconnected. ' + JSON.stringify(arg));
// });

//starting the producer
// producer.connect();

const topic = 'message';

// const produce = async (message: string, sender: string, receiver: string) => {
//   await producer.connect();
//   let i = 0;

//   // after the produce has connected, we start an interval timer
//   setInterval(async () => {
//     try {
//       // send a message to the configured topic with
//       // the key and value formed from the current value of `i`
//       await producer.send({
//         topic,
//         // messages: [
//         //     {
//         //         key: String(i),
//         //         value: "this is message " + i,
//         //     },
//         // ],

//         messages: [{ value: `${message},${sender},${receiver}` }],
//       });

//       // if the message is written successfully, log it and increment `i`
//       console.log('writes: ', i);
//       i++;
//     } catch (err) {
//       console.error('could not write message ' + err);
//     }
//   }, 1000);
// };

export default producer;
