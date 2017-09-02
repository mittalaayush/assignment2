var express = require("express");
var todos_db = require("./seed.js");
var bodyParser = require("body-parser");

var app = express();

app.use("/",express.static(__dirname+"/public"));

app.use("/",bodyParser.urlencoded({extended:false}));

app.get("/api/todos",function(req,res){
    res.json(todos_db.todos)
});

//delete a todo(with some id)
app.delete("/api/todos/:id",function(req,res){

    var del_id = req.params.id;
    var todo = todos_db.todos[del_id];

    if(!todo){
        res.status(400).json({err: "Todo doesn't exist"})
    }

    else
    {
        todo.status = todos_db.StatusENUMS.DELETED;
        //res.send(todos_db.todos.title + " deleted");
        res.json(todos_db.todos);

    }

});


//add a todo item
app.post("/api/todos", function(req,res){
    var todo = req.body.todo_title;

    if(!todo || todo=="" || todo.trim() ==""){
        res.status(400).json({error:"Todo title cannot be empty"});
    }

    else
    {
        var new_todo_object = {
            title : req.body.todo_title,
            status : todos_db.StatusENUMS.ACTIVE
        }
        todos_db.todos[todos_db.next_todo_id++] = new_todo_object;
        res.json(todos_db.todos);
    }

})


//modify/update a todo
app.put("/api/todos/:id",function(req,res){

    var mod_id = req.params.id;
    var todo = todos_db .todos[mod_id];

    if(!todo){
        res.status(400).json({error:"Can't modify a todo that doesnot exist"});
    }
    else{

        var todo_title =req.body.todo_title;

        if(todo_title && todo_title!="" && todo_title.trim() !=""){
            todo.title = todo_title
        }

        var todo_status = req.body.todo_status;
        if(todo_status && (todo_status==todos_db.StatusENUMS.ACTIVE || todo_status==todos_db.StatusENUMS.COMPLETE ))
        {
            todo.status = todo_status;
        }
        res.json(todos_db.todos);
    }

});


// GET /api/todos/active
app.get("/api/todos/active", function(req,res){
    var todos ={};
    for(var i=1 ; i<todos_db.next_todo_id;++i){
        if(todos_db.todos[i].status=="ACTIVE"){
            todos[i] = todos_db.todos[i];
        }
    }
    res.json(todos);
});

app.get("/api/todos/complete", function(req,res){
    var todos ={};
    for(var i=1 ; i<todos_db.next_todo_id;++i){
        if(todos_db.todos[i].status=="COMPLETE"){
            todos[i] = todos_db.todos[i];
        }
    }
    res.json(todos);
});

app.get("/api/todos/deleted", function(req,res){
    var todos ={};

    for(var i=1 ; i<todos_db.next_todo_id;++i){
        if(todos_db.todos[i].status=="DELETED"){
            todos[i] = todos_db.todos[i];
        }
    }

    res.json(todos);
});


// PUT /api/todos/complete/:id
app.put("/api/todos/complete/:id",function(req,res){
    var id = req.params.id;
    if(id && id != "" && id!=undefined){
        todos_db.todos[id].status = "COMPLETE";
    }
    else{
        res.status(400).json({error : "Could not find a todo with given id"});
    }
    res.json(todos_db.todos);
})

app.put("/api/todos/active/:id",function(req,res){
    var id = req.params.id;
    if(id && id != "" && id!=undefined){
        todos_db.todos[id].status = "ACTIVE";
    }
    else{
        res.status(400).json({error : "Could not find a todo with given id"});
    }
    res.json(todos_db.todos);
})


app.listen(3000);