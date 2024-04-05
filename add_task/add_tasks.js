let allTasks = [];

/**
 * This function gets value of input and select, creates an object with those values and the time, pushes the object into an array and saves this array in the local storage
 *
 */
function addTask() {
  let description = document.getElementById("description").value;
  let category = document.getElementById("category").value;

  let task = {
    description: description, // Eigentlich müsste es so aussehen mit Anführungszeichen: "description": description Leider entfernt mein Autoformatter diese aber.
    category: category,
    createdAt: new Date().getTime(),
  };

  allTasks.push(task);

  let allTasksAsString = JSON.stringify(allTasks);
  localStorage.setItem("allTasks", allTasksAsString);
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
