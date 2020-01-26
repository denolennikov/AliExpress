import express from "express";
const worker = require('../background/worker');

const router = express.Router();
var Queue = require('bull');
const { setQueues } = require('bull-board')

router.post("/products", (req, res, next) => {
    
    var queue = new Queue('scrapping', {
        redis: {
          host: '127.0.0.1',
          port: 6379,
          password: 'password'
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
        await worker.scrappingWoker(job.data.products)
    })

    queue.on('completed', (job, result) => {
        res.status(200).json({
            message: "Ok"
        })
    })
})

module.exports = router;