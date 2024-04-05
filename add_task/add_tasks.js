let allTasks = [];
let priority;

/**
 * This function gets value of input and select, creates an object with those values and the time, pushes the object into an array and saves this array in the local storage
 *
 */
function addTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let assignedTo = document.getElementById("taskAssigned").value;
  let category = document.getElementById("taskCategory").value;
  let subtasks = document.getElementById("taskSubtask").value;

  let task = {
    // user: users.id,
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    // "urgent", 'medium', 'low'
    assignedTo: assignedTo,
    // createDate: new Date().getTime(),
    category: category,
    subtasks: subtasks,
  };

  pushTask(task);
  storeAllTasks(task);

  console.log(allTasks);
}

function pushTask(task) {
  allTasks.push(task);
}

function storeAllTasks(task) {
  setItem(task, allTasks);
}

/**
 * This function loads an array from the local storage and parses it.
 *
 *
 */
function loadAllTasks() {
  let allTasksAsString = localStorage.getItem("allTasks");
  allTasks = JSON.parse(allTasksAsString);
}

function setPrioUrgent() {
  priority = "urgent";
  console.log(priority);
}
function setPrioMedium() {
  priority = "medium";
  console.log(priority);
}
function setPrioLow() {
  priority = "low";
  console.log(priority);
}
