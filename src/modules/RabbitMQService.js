const Amqp = require("amqplib/callback_api");
const { isEmpty } = require("lodash");

const rabbitConfig = {
  url: "amqp://guest:guest@localhost",
  exchangeName: "ojt-siddiq-queue",
};

const connectRabbitmq = function (main) {
  Amqp.connect(rabbitConfig.url, function (err, conn) {
    if (err) console.log(err, "Connection Rabbit MQ Error");
    main(conn);
  });
};

const sentToQueue = function (
  conn,
  queueName,
  exchangeName,
  message,
  callback
) {
  return conn.createConfirmChannel(function (err, ch) {
    ch.assertExchange(exchangeName, "direct");
    const params = {
      message: message,
    };
    ch.publish(
      exchangeName,
      queueName,
      new Buffer(JSON.stringify({ request: message.request, params: params }))
    );
    return callback();
  });
};

const produceQueue = function (message, queueName, callback) {
  connectRabbitmq(function (conn) {
    return sentToQueue(
      conn,
      queueName,
      rabbitConfig.exchangeName,
      message,
      function () {
        console.log("Success send queue to message broker");
        return callback(null, "Transaction is being proccessedF");
      }
    );
  });
};

const consumeQueue = (queueName, receiveHandler) => {
  let prefetchMount = 3;
  connectRabbitmq((conn) => {
    const exName = rabbitConfig.exchangeName;
    conn.createChannel((err, ch) => {
      ch.assertExchange(exName, "direct");
      ch.assertQueue(queueName, { durable: true }, (err, q) => {
        if (err) {
          console.log(err, "Waiting for Queue Error");
          throw err;
        }
        ch.bindQueue(q.queue, exName, queueName);
        ch.prefetch(prefetchMount);
        ch.consume(
          q.queue,
          async (msg) => {
            try {
              if (isEmpty(msg)) {
                console.log("Waiting for Queue");
              } else {
                await receiveHandler(ch, msg);
              }
            } catch (error) {
              console.log(error, "Error When Consume Queue");
            }
          },
          {
            noAck: false,
          }
        );
      });
    });
  });
};

module.exports = {
  produceQueue,
  consumeQueue,
  sentToQueue,
};
