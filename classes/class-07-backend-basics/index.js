function addTodo(){
   
    const inputVal = document.getElementById("todoInput");
    const todo = inputVal.value;
    const newDiv = document.createElement("div");
    newDiv.innerHTML = todo;
    console.log(inputVal.value);
    const parentDiv = document.getElementById("list-todo");
    parentDiv.appendChild(newDiv);
    console.log(newDiv);
}