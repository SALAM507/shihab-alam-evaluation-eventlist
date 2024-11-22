function createTodoElem(todo) {
  const todoItemElem = document.createElement("li");
  const taskElem = document.createElement("div");

  // task elem
  taskElem.textContent = `Task: ${todo.task}`;
  const statusElem = document.createElement("div");
  statusElem.textContent = `Completed: ${todo.completed}`;

  // delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    const newTodo = await todoAPI.deleteTodo(todo.id);
    todo = newTodo;
    todoItemElem.remove();
  });

  // edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  // input element
  const inputElem = document.createElement("input");
  inputElem.value = todo.task;

  // save button
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";

  // cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";

  // add event listener to the edit and save button
  editButton.addEventListener("click", () => {
    // remove the other elements
    taskElem.remove();
    statusElem.remove();
    deleteButton.remove();
    editButton.remove();

    // add the input, save and cancel button
    todoItemElem.append(inputElem, saveButton, cancelButton);
  });

  saveButton.addEventListener("click", async () => {
    const updatedTodo = await todoAPI.editTodo(todo.id, {
      task: inputElem.value,
    });
    taskElem.textContent = `Task: ${updatedTodo.task}`;
    statusElem.textContent = `Completed: ${updatedTodo.completed}`;
    todoItemElem.append(taskElem, statusElem, deleteButton, editButton);
    inputElem.remove();
    saveButton.remove();
    cancelButton.remove();
  });

  cancelButton.addEventListener("click", () => {
    inputElem.value = todo.task;
    inputElem.remove();
    saveButton.remove();
    cancelButton.remove();
    todoItemElem.append(taskElem, statusElem, deleteButton, editButton);
  });

  todoItemElem.append(taskElem, statusElem, deleteButton, editButton);

  return todoItemElem;
}

function renderTodos(todos) {
  const todoListElem = document.getElementById("todo-list");

  for (const todo of todos) {
    const todoElem = createTodoElem(todo);
    todoListElem.appendChild(todoElem);

    // NOTE: below is not good practice to use innerHTML to append elements
    // 1. prone to HTML injection
    // 2. re-renders the whole list
    // 3. event listeners are lost

    // const todoItemElem = `<li>
    //     <div>Task: ${todo.task}</div>
    //     <div>Completed: ${todo.completed}</div>
    //     <button>Delete</button>
    // </li>`;
    // todoListElem.innerHTML += todoItemElem;
  }
}

function setUpFormEvent() {
  const form = document.getElementById("todo-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputElem = document.getElementById("new-todo");

    // we need to get to get the id of the new todo from the server
    const newTodo = await todoAPI.postTodo({
      task: inputElem.value,
      completed: false,
    });

    const todoListElem = document.getElementById("todo-list");
    const todoElem = createTodoElem(newTodo);
    todoListElem.appendChild(todoElem);

    inputElem.value = "";
  });
}

(function initApp() {
  setUpFormEvent();

  todoAPI.getTodos().then((todos) => {
    renderTodos(todos);
  });
})();
