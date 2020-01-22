var kue = require('kue');
var Queue = kue.createQueue();

let scheduleJob = data => {
    var job = Queue.createJob(data.jobName, data.params)
    .attempts(3)
    .save()

    job.on('complete', function(result){
        console.log("Job complete", result);
    }).on('failed', function(){
        console.log("Job failed");
    }).on('progress', function(progress){
        process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
    });
};

module.exports = {
    scheduleJob
};