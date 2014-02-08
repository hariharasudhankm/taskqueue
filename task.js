var Queue  = require("./queue")
var redis  = require("./redis")
var Task = exports = module.exports = {};


Task.push = function(task,cb){
	if(!task.hasOwnProperty('time') || task.time.length==0)
		task.time= 10;
	else
		task.time = parseInt(task.time);
	Queue.enque(task,cb);
}


Task.getAllTask = function(cb){
	Queue.all(cb);
}

Task.fetch = function(cb){
	Queue.deque(function(err,data){
		redis.hmset("job",data.id,data.time,"detail:"+data.id,data,function(err,data1){
			cb(err,data);	
		})
		
	});
}



Task.setTimeConsumed = function(id,consumed,cb){
	Task.getTimeConsumed(id,function(err,data){
		redis.hset("job",id,data-consumed);	
	})
	
}

Task.done = function(id,cb){
	redis.hdel("job",id);
	redis.hget("job","detail"+id,function(err,data){
		redis.lpush("FinishedJobs",data);
		redis.hdel("job","detail"+id);
		cb(err,data);
	})
}


Task.getTimeConsumed = function(id,cb){
	redis.hget("job",data.id,function(err,data){
		cb(err,data);
	})
}