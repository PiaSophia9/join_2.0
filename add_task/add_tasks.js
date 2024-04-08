let allTasks = [];
let priority;

async function init() {
  includeHTML();
  await loadAllTasks();
}

/**
 * This function gets the form elements values, pushes them into the array "allTasks" and saves them in the storage.
 *
 */
async function addTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let assignedTo = document.getElementById("taskAssigned").value;
  let category = document.getElementById("taskCategory").value;
  let subtasks = document.getElementById("taskSubtask").value;
  let status = "toDo";

  let task = {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    assignedTo: assignedTo,
    category: category,
    subtasks: subtasks,
    status: status,
  };

  enableButton();
  pushTask(task);
  await storeAllTasks();
}

function pushTask(task) {
  allTasks.push(task);
}

async function storeAllTasks() {
  await setItem("remoteTasks", allTasks);
}

/**
 * This function loads an array from the storage and parses it.
 *
 *
 */
async function loadAllTasks() {
  let response = await getItem("remoteTasks");
  allTasks = await JSON.parse(response);
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

function clearInputs() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("taskAssigned").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("taskSubtask").value = "";
}

function enableButton() {
  if (document.getElementById("taskTitle").value != "" && document.getElementById("taskDueDate").value != "" && document.getElementById("taskCategory").value != "") {
    document.getElementById("submit_task_button").removeAttribute("disabled");
  } else {
    document.getElementById("submit_task_button").setAttribute("disabled");
  }
}
