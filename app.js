
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var Task = require('./task');
var socketio = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3003);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


app.post('/queue/push',function(req,res){
	console.log("request",req.body);

	var tasks = req.body.tasks;


	if(tasks.constructor == Array){
		for(i=0;i<tasks.length;i++){
			Task.push(tasks[i],function(err,data){
				io.sockets.emit("new-task",JSON.stringify(data));
			});
		}

	}else{
		res.send(404,{err:JSON.stringify(tasks)+" is Not a valid reuest"})
	}
	res.json({success:1})
})

app.get("/queue/fetch",function(req,res){
	Task.fetch(function(err,data){
		res.json(JSON.stringify(data))
	})
})

var server = http.createServer(app);
var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
	socket.on("init",function(data){
		Task.getAllTask(function(err,list){
			socket.emit("init_queue",list);	
		})
		
	})
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
