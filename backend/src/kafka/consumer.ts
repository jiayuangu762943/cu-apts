// var Transform = require('stream').Transform;
// var Kafka = require('node-rdkafka');

// var stream = Kafka.KafkaConsumer.createReadStream(
//   {
//     'metadata.broker.list': 'cuapt-kafka-event-hub.servicebus.windows.net:8080', //REPLACE
//     'group.id': 'nodejs-cg', //The default consumer group for EventHubs is $Default
//     'socket.keepalive.enable': true,
//     'enable.auto.commit': false,
//     'security.protocol': 'SASL_SSL',
//     'sasl.mechanisms': 'PLAIN',
//     'sasl.username': '$ConnectionString', //do not replace $ConnectionString
//     'sasl.password':
//       'Endpoint=sb://cuapt-kafka-event-hub.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=p+rjmErS+zf6kWsOuWxdJbtFx19BjXCE9O18xYGfocg=',
//   },
//   {},
//   {
//     topics: 'test',
//     waitInterval: 0,
//     objectMode: false,
//   }
// );

// stream.on('error', function (err) {
//   console.log(err);
//   process.exit(1);
// });

// stream.pipe(process.stdout);

// stream.on('error', function (err) {
//   console.log(err);
//   process.exit(1);
// });

// stream.consumer.on('event.error', function (err) {
//   console.log(err);
// });
