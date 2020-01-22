var kue = require('kue');
var Queue = kue.createQueue();
var getAll = require("../api/getAll");
Queue.process("AliExpress", function(job, done){
    console.log('------worker.js----5', job)
    let { data } = job;
    let a = getAll.getAll()
    a.then(function(result){
        console.log(result)
    })
    console.log('asdasdfasdfasdf', a)
    done();
})