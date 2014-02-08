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
    console.log(task)
  	task = JSON.parse(task);
  	var template = "<tr id='QUEUE-{{id}}'><td>{{id}}</td><td>{{name}}</td><td>{{time}} s</td></tr>";
  	$('#queue-table tbody').append(Mustache.render(template,task));
  }

  function add_to_task(task){
    task = JSON.parse(task);
    var template = '<tr id="TASK-ROW-{{id}}"><td>{{id}}</td><td>{{name}}</td><td>{{time}}s</td><td>0s</td><td>{{time}}s</td><td><div class="progress progress-striped active"><div class="progress-bar" id="TASK-{{id}}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"><span class="sr-only">45% Complete</span></div></div></div></td></tr>';
    $('#task-table tbody').append(Mustache.render(template,task)); 
  }

  function processTask(task){
    if(task.remain !=0){
      setTimeout(function(){
        task.remain = task.remain-1;
        socket.emit("task-live",task);
        processTask(task);
      },1000)
    }else{
      socket.emit("task-done",task);
    }
  }

  socket.on("task-fetched",function(task){
    task = JSON.parse(task);
    $('#QUEUE-'+task.id).remove();
    add_to_task(task);
  })

  socket.on('task-update',function(task){
    task = JSON.parse(task);
    $('#TASK-'+task.id).css('width',((task.time-task.remain)*100/task.time).toString()+"%")
  })

  	$('#fetch-task').on('click',function(event){
  		$.ajax({
  			url:"/queue/fetch",
  			method:'GET',
  			success:function(o){
          o = JSON.parse(o);
          o.remain = o.time;  
          processTask(o);
  				alert("Task fetched and processing");
  				
  			},
  			error:function(o){
  				alert("Unable to fetch tasks");
  			}
  		})
  	});


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

	$('#create-task').submit(function(e){
		e.preventDefault();
		var a = $(this)
		console.log({"tasks":[a.serializeObject()]});
		$.ajax({
			url:"/queue/push",
			method:"post",
      contentType: "application/json",
			data:JSON.stringify({"tasks":[a.serializeObject()]}),
			success:function(response){
				alert("Task added to queue");
			},
			error:function(err){
				alert("Error adding task");
			}
		})
		
	})

})