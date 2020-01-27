import express from "express";
require('dotenv').config()

const worker = require('../background/worker');

const router = express.Router();
var Queue = require('bull');
const { setQueues } = require('bull-board')

router.post("/products", (req, res, next) => {

    var queue = new Queue('extractProductQueue', {
        redis: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD
        }
    });
    setQueues([queue])

    const data = {
        products: req.body.products,
    }
      
    const options = {
        delay: 20,
        attempts: 3
    }

    queue.add(data, options);

    queue.process(async job => {
        await worker.aliExpressWorker(job.data.products)
    })

    queue.on('completed', (job, result) => {
        res.status(200).json({
            message: "Ok"
        })
    })
})

module.exports = router;