let allTasks = [];
let priority;

// function overwriteAllTasks() {
//   allTasks = [];
//   console.log(allTasks);
// }

/**
 * This function gets value of input and select, creates an object with those values and the time, pushes the object into an array and saves this array in the local storage
 *
 */
async function addTask() {
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
    assignedTo: assignedTo,
    // createDate: new Date().getTime(),
    category: category,
    subtasks: subtasks,
  };

  // allTasks = [];
  console.log("task:", task);
  // await loadAllTasks();

  pushTask(task);
  await storeAllTasks();

  // console.log("All tasks before adding a new task: ", allTasks);
}

function pushTask(task) {
  // allTasks = JSON.parse(allTasks);
  // console.log("Tasks:", allTasks);
  allTasks.push(task);
}

async function storeAllTasks() {
  await setItem("remoteTasks", allTasks);
}

async function init() {
  includeHTML();
  await loadAllTasks();
}

/**
 * This function loads an array from the local storage and parses it.
 *
 *
 */
async function loadAllTasks() {
  // let allTasksAsString = localStorage.getItem("allTasks");

  // try {
  let response = await getItem("remoteTasks");
  allTasks = await JSON.parse(response);

  console.log("testTasks:", allTasks);
  // } catch (error) {
  //   console.error("Error loading tasks:", error);
  //   allTasks = [];
  // allTasks = JSON.parse(allTasksAsString);
  // }
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
