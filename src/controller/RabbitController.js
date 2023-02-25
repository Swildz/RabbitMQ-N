const { get } = require("lodash");
const { produceQueue } = require("../modules/RabbitMQService");

const TestProduceQueue = async (req, res) => {
    try {
        const message = {name : 'siddiq'};
        produceQueue(message, 'Testing', (err, res) => {
            if(err){
                throw err
            }
            console.log(res);
        })
    } catch (error) {
        console.log(error);
    }
}

const ConsumerRabbitMQ = (ch,msg) => {
    console.log('Success Retrieve Queue');
    const message = JSON.parse(msg.content.toString())
    const mesageRabbitMQ = get(message, 'params.message')
    console.log('Message Retrieved : ', mesageRabbitMQ);
    ch.ack(msg)
}

module.exports = {
    TestProduceQueue,
    ConsumerRabbitMQ
}