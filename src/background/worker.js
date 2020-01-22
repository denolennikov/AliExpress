var kue = require('kue');
var Queue = kue.createQueue();

Queue.process("AliExpress", function(job, done){
    let { data } = job;
    done();
})