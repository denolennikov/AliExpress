import express from "express";
import db from "../db/database";
import Store from "../domain/store";
// require("../background/worker");
// const kue = require("../background/kue");
var kue = require('kue');

import axios from "axios";
const queue = kue.createQueue();

const router = express.Router();

router.get("/", async (req, res, next) => {
    // let args = {
    //     jobName: "AliExpress",
    //     params:{}
    // }
    // // const job = kue.scheduleJob(args);
    // var job = Queue.createJob(args.jobName, args.params)
    // .attempts(3)
    // .save()

    // var job = Queue.process("AliExpress", function(job, done){
    //     let { data } = job;
    //     db.query(Store.getAllStoreSQL(), (err, data)=> {
    //         if(!err) {
    //             return data
    //         }
    //     });
    //     done();
    // })

    // job.on('complete', function(result){
    //     console.log("Job complete", result);
    //     res.status(200).json({message:"Stores listed."});
    // }).on('failed', function(){
    //     console.log("Job failed");
    // }).on('progress', function(progress){
    //     process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
    // });

    for (let i = 1; i <= 20; i++) {
      queue
        .create("queue example", {
          title: "This testing request",
          data: i
        })
        .priority("high")
        .save();
    }
    res.send("Hello World!");
  });
  queue.process("queue example", (job, done) => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/" + job.data.data)
      .then(result => {
        console.log(result.data);
        done();
        return result.data;
      })
      .catch(error => done(error));
  });

router.post("/add", (req, res, next) => {

    //read store information from request
    let store = new Store(
        req.body.storeId, 
        req.body.storeName,
        req.body.storeUrl,
        req.body.storeFeedbacks,
        req.body.sellerSince
    );

    db.query(store.getAddStoreSQL(), (err, data)=> {
        res.status(200).json({
            message:"Store added.",
            storeId: data.insertId
        });
    });
});

router.get("/:storeId", (req, res, next) => {
    let pid = req.params.storeId;

    db.query(Store.getStoreByIdSQL(pid), (err, data)=> {
        if(!err) {
            if(data && data.length > 0) {
                
                res.status(200).json({
                    message:"Store found.",
                    store: data
                });
            } else {
                res.status(200).json({
                    message:"Store Not found."
                });
            }
        }
    });
});

router.post("/delete", (req, res, next) => {

    var pid = req.body.storeId;

    db.query(Store.deleteStoreByIdSQL(pid), (err, data)=> {
        if(!err) {
            if(data && data.affectedRows > 0) {
                res.status(200).json({
                    message:`Store deleted with id = ${pid}.`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message:"Store Not found."
                });
            }
        } 
    });
});

module.exports = router;