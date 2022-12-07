// const { Kafka, logLevel } = require('kafkajs');
import MessagesCollection from '../models/Messages';
const topic = 'message';
interface CosumerMessage {
  value: Buffer;
  size: number;
  topic: string;
  offset: number;
  partition: number;
  key: string;
  timestamp: Date;
}
// const consumer = new Kafka({
//   logLevel: logLevel.INFO,
//   // brokers: [`${host}:9092`],
//   brokers: ['cuapt-kafka.servicebus.windows.net:9093'],
//   clientId: 'example-consumer',
//   ssl: true,
//   sasl: {
//     mechanism: 'PLAIN',
//     username: '$ConnectionString', //do not replace $ConnectionString
//     password:
//       'Endpoint=sb://cuapt-kafka.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=p7fMhmwqIUo23OmjYB9JEbPyUYJOtwzu/shmU1EJF7A=',
//   },
// });

// const Transform = require('stream').Transform;
const Kafka = require('node-rdkafka');

const consumer_stream = Kafka.KafkaConsumer.createReadStream(
  {
    'metadata.broker.list': 'cuapt-kafka.servicebus.windows.net:9093', //REPLACE
    'group.id': '$Default', //The default consumer group for EventHubs is $Default
    'socket.keepalive.enable': true,
    'enable.auto.commit': false,
    'security.protocol': 'SASL_SSL',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': '$ConnectionString', //do not replace $ConnectionString
    'sasl.password':
      'Endpoint=sb://cuapt-kafka.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=p7fMhmwqIUo23OmjYB9JEbPyUYJOtwzu/shmU1EJF7A=',
  },
  {},
  {
    topics: topic,
    waitInterval: 0,
    objectMode: false,
  }
);

// consumer_stream.on('data', async (message: CosumerMessage) => {
//   // console.log('Got message');
//   // console.log(message.value.toString());
//   // msgs.push(message.value.toString());
//   const msg = message.value.toString().split(',');
//   console.log(msg);
//   const doc = await new MessagesCollection({
//     // ...review,
//     sender: msg[1],
//     receiver: msg[2],
//     content: msg[0],
//     // date: new Date(review.date),
//   }).save();
// });

export default consumer_stream;

// stream.on('error', function (err) {
//     if (err) console.log(err);
//     process.exit(1);
// });

// stream.pipe(process.stdout);

// stream.on('error', function (err) {
//     console.log(err);
//     process.exit(1);
// });

// stream.consumer.on('event.error', function (err) {
//     console.log(err);
// })

// const consume = async () => {
//   // first, we wait for the client to connect and subscribe to the given topic
//   await consumer.connect();
//   await consumer.subscribe({ topic });
//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }: any) => {
//       const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
//       console.log(`- ${prefix} ${message.key}#${message.value}`);
//       //   msgs.push(message.value.toString());
//       const msg = message.value.toString().split(',');
//       console.log(msg);
//       const doc = await new MessagesCollection({
//         // ...review,
//         sender: msg[1],
//         receiver: msg[2],
//         content: msg[0],
//         // date: new Date(review.date),
//       }).save();
//     },
//   });
// };

// module.exports = consume;
