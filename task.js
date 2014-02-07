var Queue  = require("./queue")
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

function live_task(data){

}

Task.fetch = function(cb){
	Queue.deque(function(err,data){

	})
}



Task.setTimeConsumed = function(id,consumed,cb){

}