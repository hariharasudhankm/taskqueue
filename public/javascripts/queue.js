$(document).ready(function(){
    var socket = io.connect("/");

    socket.emit("init",null);

    socket.on("init_queue",function(data){
    	$.each(data,function(index,value){
    		add_to_queue(value);
    	})
    })

    socket.on("new-task",function(data){
    	add_to_queue(data);
    })

  function add_to_queue(task){
  	task = JSON.parse(task);
  	var template = "<tr id='QUEUE-{{id}}'><td>{{id}}</td><td>{{name}}</td><td>{{time}} s</td></tr>";
  	$('#queue-table tbody').append(Mustache.render(template,task));
  }




	$('#create-task').submit(function(e){
		e.preventDefault();
		var a = $(this)
		$.ajax({
			url:"/queue/push",
			method:"post",
			data:a.serializeArray(),
			success:function(response){
				alert("Task added to queue");
			},
			error:function(err){
				alert("Error adding task");
			}
		})
		
	})

})