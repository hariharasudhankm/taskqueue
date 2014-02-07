var redis = require("./redis");

var Queue = exports = module.exports = {};

Queue.enque = function(data,cb){
	redis.incr('JobID',function(err,id){
		data.id = id;
		redis.rpush('JobQueue',JSON.stringify(data));	
		cb(null,data);
	})
	
};

Queue.all = function(cb){
	redis.lrange("JobQueue",0,-1,function(err,data){
		cb(err,data);
	})
}

Queue.deque = function(cb){
	redis.lpop('JobQueue',function(err,data){
		cb(err,data);
	})
}