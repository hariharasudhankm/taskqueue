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



  	$('#fetch-task').on('click',function(event){
  		$.ajax({
  			url:"/queue/fetch",
  			method:'GET',
  			success:function(o){
  				alert("Task fetched and processing");
  				console.log(o);
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