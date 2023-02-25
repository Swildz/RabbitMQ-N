const express = require("express");
const router = express();
const { TestProduceQueue } = require("../../controller/RabbitController");

router.get("/test-rabbitmq", TestProduceQueue);
module.exports = router;
