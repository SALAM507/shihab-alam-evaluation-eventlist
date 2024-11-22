// function to create a table row for toddo item
// I modified the function to create a 'tr' element instead of a li This is because i wanted to display the todos in a table formats making it easier to visaulize multiple columns (event name start date, end date, action)
function createTodoElem(todo) {
  const tr = document.createElement("tr");

  // event name cell
  // changd from "task" to "eventName" to make it more descriptive for event base todo.
  const taskTd = document.createElement("td");
  taskTd.textContent = todo.eventName;

  // Start Date cell
  const startDateTd = document.createElement("td");
  startDateTd.textContent = todo.startDate || ""; // added a default empty string to handle missng start date

  // End Date cell
  const endDateTd = document.createElement("td");
  endDateTd.textContent = todo.endDate || ""; // added a defalt empty string to handle missing end date

  // Actions cell
  const actionsTd = document.createElement("td");

  // Edit button
  // Added a edit button that allow user to modify there event
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  actionsTd.appendChild(editButton);
  actionsTd.appendChild(deleteButton);

  tr.appendChild(taskTd);
  tr.appendChild(startDateTd);
  tr.appendChild(endDateTd);
  tr.appendChild(actionsTd);

  // Delete functionality
  // Added delete functionality to remove the row from the table as well as delete the todo from the server.
  deleteButton.addEventListener("click", async () => {
    await todoAPI.deleteTodo(todo.id);
    tr.remove();
  });

  // Edit functionality
  // added a edit button that allow edit of the todo item row
  editButton.addEventListener("click", () => {
    editTodoRow(tr, todo);
  });

  return tr;
}
// Function to edit an existing row
// created a separate fuction to handle editing to keep the code modular and organize
function editTodoRow(tr, todo) {
  // Clear existing row content
  tr.innerHTML = "";
  // Event Name input cell
  // replaced statc text with input fields to allow users  modify the events,
  const taskTd = document.createElement("td");
  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.value = todo.eventName;
  taskTd.appendChild(taskInput);
  // Start date Input Cell
  const startDateTd = document.createElement("td");
  const startDateInput = document.createElement("input");
  startDateInput.type = "date";
  startDateInput.value = todo.startDate || "";
  startDateTd.appendChild(startDateInput);
  // End date input cell
  const endDateTd = document.createElement("td");
  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateInput.value = todo.endDate || "";
  endDateTd.appendChild(endDateInput);
  // Action cell with Save and Cancel buttons
  const actionsTd = document.createElement("td");
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  actionsTd.appendChild(saveButton);
  actionsTd.appendChild(cancelButton);
  tr.appendChild(taskTd);
  tr.appendChild(startDateTd);
  tr.appendChild(endDateTd);
  tr.appendChild(actionsTd);
  // save Functionality
  // calidate inputs and update the Todo item both on the ui an the server
  saveButton.addEventListener("click", async () => {
    // input validation to ensure all fields are filled out.
    if (!taskInput.value.trim() || !startDateInput.value || !endDateInput.value) {
      alert("All fields are required.");
      return;
    }
    const updatedTodo = {
      eventName: taskInput.value,
      startDate: startDateInput.value,
      endDate: endDateInput.value,
    };
    const savedTodo = await todoAPI.editTodo(todo.id, updatedTodo);
    // replace row with updat data
    const updatedTr = createTodoElem(savedTodo);
    tr.parentNode.replaceChild(updatedTr, tr);
  });

  // Cancel functionality
  // Restore the Original row sif the user decide to cance the edit
  cancelButton.addEventListener("click", () => {
    const originalTr = createTodoElem(todo);
    tr.parentNode.replaceChild(originalTr, tr);
  });
}
// Function to render the list of todos
// modified to clear existing row before Renderng to avoid duplicate entries.
function renderTodos(todos) {
  const todoListElem = document.getElementById("todo-list");
  todoListElem.innerHTML = ""; // clear Existng row

  for (const todo of todos) {
    const todoTr = createTodoElem(todo);
    todoListElem.appendChild(todoTr);
  }
}
// function to Add a New row with Blank field
// added this function to allow user add new events directly from the Ui
function addNewEventRow() {
  const todoListElem = document.getElementById("todo-list");
  const tr = document.createElement("tr");
  // event Name input Cell
  const taskTd = document.createElement("td");
  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.placeholder = "Event Name";
  taskTd.appendChild(taskInput);
  // start Date input cell.
  const startDateTd = document.createElement("td");
  const startDateInput = document.createElement("input");
  startDateInput.type = "date";
  startDateTd.appendChild(startDateInput);
  // end Date input cell
  const endDateTd = document.createElement("td");
  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateTd.appendChild(endDateInput);
  // Aaction cell with save and Cancel button.
  const actionsTd = document.createElement("td");
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  actionsTd.appendChild(saveButton);
  actionsTd.appendChild(cancelButton);
  tr.appendChild(taskTd);
  tr.appendChild(startDateTd);
  tr.appendChild(endDateTd);
  tr.appendChild(actionsTd);
  todoListElem.appendChild(tr);
  // Save functionality
  // validates inputs and saves the new todo both in the UI and on the server
  saveButton.addEventListener("click", async () => {
    // input validation to ensure all fields are filled out
    if (!taskInput.value.trim() || !startDateInput.value || !endDateInput.value) {
      alert("All fields are required.");
      return;
    }
    const newTodo = {
      eventName: taskInput.value,
      startDate: startDateInput.value,
      endDate: endDateInput.value,
    };
    // save new To do to server
    const savedTodo = await todoAPI.postTodo(newTodo);
    // rreplace row with save data.
    const newTr = createTodoElem(savedTodo);
    tr.parentNode.replaceChild(newTr, tr);
  });
  // cancel functionalit.
  // remove the row if the user decide not to aadd a new event
  cancelButton.addEventListener("click", () => {
    tr.remove();
  });
}
// Initialization function
// added an "add New event" button to allow uses to add events
(function initApp() {
  todoAPI.getTodos().then((todos) => {
    renderTodos(todos);
  });
  document.getElementById("add-row-btn").addEventListener("click", addNewEventRow);
})();
