
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID = "active_todos_list_div";
const COMPLETE_TODOS_LIST_ID = "complete_todos_list_div";
const DELETED_TODOS_LIST_ID = "deleted_todos_list_div";
const NEW_TODO_INPUT_ID = "new_todo_input";

window.onload = getTodosAJAX();

function addTodoElements(id1,id2,id3,todos_data_json){

    var parent1 = document.getElementById(id1);
    var parent2 = document.getElementById(id2);
    var parent3 = document.getElementById(id3);
    var todos = JSON.parse(todos_data_json);
    parent1.innerText = "";
    parent2.innerText = "";
    parent3.innerText = "";

    if(parent1 || parent2 ||parent3){
        Object.keys(todos).forEach(

            function(key)
            {
                var todo_element = createTodoElement(key,todos[key]);
                if(todos[key].status=="ACTIVE") {
                    parent1.appendChild(todo_element);
                }
                else if(todos[key].status=="COMPLETE") {
                    parent2.appendChild(todo_element);
                }
                if(todos[key].status=="DELETED") {
                    parent3.appendChild(todo_element);
                }
            })
    }
}

function createTodoElement(id,todo_object){

    var todo_element = document.createElement("div");

    todo_element.setAttribute("data-id",id);
    todo_element.setAttribute("class", todo_object.status);
    todo_element.setAttribute("class","todoStatus"+todo_object.status+" "+"breadthVertical");
    var complete_cb = document.createElement("input");

    if(todo_object.status!="DELETED")
    {
        complete_cb.type = "checkbox"
        complete_cb.id = id;
        complete_cb.value=todo_object.title;
        todo_element.appendChild(complete_cb);
        complete_cb.setAttribute("padding","2px");
        complete_cb.setAttribute("class", "breadthHorizontal");
        var label=document.createElement('text');
        label.innerText=todo_object.title;
        todo_element.appendChild(label);
        var delete_todo = document.createElement("label");
        delete_todo.innerText = "x";
        delete_todo.style.float = "right";
        delete_todo.style.marginRight = "30%";
        delete_todo.style.color= "#f00";
        delete_todo.setAttribute("onclick", "deleteTodoAJAX(" + id + ")");
        delete_todo.setAttribute("class", "breadthHorizontal");
        todo_element.appendChild(delete_todo);
    }


    if(todo_object.status=="ACTIVE"){
        complete_cb.checked=false;
        complete_cb.setAttribute("onchange","completeTodoAJAX("+id+")");
    }

    if(todo_object.status=="COMPLETE"){
        complete_cb.checked=true;
        complete_cb.setAttribute("onchange","activeTodoAJAX("+id+")");
    }


    if(todo_object.status=="DELETED") {
        var label=document.createElement('text');
        label.innerText=todo_object.title;
        todo_element.appendChild(label);
    }
    return todo_element;
}


function getTodosAJAX() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET","/api/todos",true);

    xhr.onreadystatechange = function() {

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements("active_todos_list_div","complete_todos_list_div","deleted_todos_list_div",xhr.responseText);
            }
        }
    }
    xhr.send(data=null);
}

function addTodoAJAX(){
    var title = document.getElementById(NEW_TODO_INPUT_ID).value;
    var xhr = new XMLHttpRequest();


    xhr.open("POST","/api/todos",true);
    // xhr paramenters - method , url , async or not

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    // HW : Read format of X-W-F-U-E
    // HW : Look up encodeURI


    var data = "todo_title="+encodeURI(title);

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {

                // xhr.responseText

                addTodoElements(TODOS_LIST_ID,COMPLETE_TODOS_LIST_ID,DELETED_TODOS_LIST_ID,xhr.responseText);

            }
            else
            {
                console.log(xhr.responseText);
            }
        }

    }

    xhr.send(data);
}

function deleteTodoAJAX(id) {

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/todos/" + id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=DELETED";

    xhr.onreadystatechange = function(){
        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements("active_todos_list_div","complete_todos_list_div","deleted_todos_list_div",xhr.responseText);
             }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function completeTodoAJAX(id) {

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/" + id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=COMPLETE";

    xhr.onreadystatechange = function(){
        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements("active_todos_list_div","complete_todos_list_div","deleted_todos_list_div",xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function activeTodoAJAX(id) {

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/" + id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=ACTIVE";

    xhr.onreadystatechange = function(){
        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements("active_todos_list_div","complete_todos_list_div","deleted_todos_list_div",xhr.responseText);
                console.log(xhr.responseText)
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function changeVisibility(source_id) {

    console.log("changing visibility ")
    var hidden_div_id =''; var src_label = '';
    if (source_id == 'hide_complete'){
        hidden_div_id = COMPLETE_TODOS_LIST_ID;
        src_label = 'hide_complete';
    }
    if(source_id == 'hide_deleted'){
        hidden_div_id = DELETED_TODOS_LIST_ID;
        src_label = 'hide_deleted';
    }
    var visibility = document.getElementById(hidden_div_id).style.display;

    if(visibility!='none'){
        document.getElementById(hidden_div_id).style.display = 'none';
        console.log("none");
        if(source_id == 'hide_deleted') {
            document.getElementById(src_label).innerText = 'Show Deleted Todos';
        }
        else if(source_id == 'hide_complete') {
            document.getElementById(src_label).innerText = 'Show Complete Todos';
        }
    }
    else {
        document.getElementById(hidden_div_id).style.display = 'block';
        console.log("block");
        if(source_id == 'hide_deleted')
        {
            document.getElementById(src_label).innerText = 'Hide Deleted Todos';
        }
        else if(source_id == 'hide_complete')
        {
            document.getElementById(src_label).innerText = 'Hide Complete Todos';
        }
    }
    document.getElementById(src_label).style.textDecoration = "underline";
    document.getElementById(src_label).style.fontSize = "10px";
}