const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./route/product/ProductrRoute");
const { consumeQueue } = require("./modules/RabbitMQService");
const { ConsumerRabbitMQ } = require("./controller/RabbitController");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/", router);
consumeQueue("Testing", ConsumerRabbitMQ);

app.listen(8082, () => {
    console.log('server run on port 8082')
})