let allTasks = [];
let priority;

async function init() {
  includeHTML();
  await loadAllTasks();
  renderContactsToAssign();
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

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

// Contacts to assign

function createInitials(i) {
  let currentName = contacts[i];
  let currentNameAsString = currentName.toString();
  let initials = currentNameAsString.match(/\b(\w)/g).join("");
  let firstTwoInitials = initials.slice(0, 2);
  return firstTwoInitials;
}

let contacts = ["Sofia Müller", "Anton Mayer", "Anja Schulz", "Benedikt Ziegler", "David Eisenberg"];

function renderContactsToAssign() {
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById("myDropdown").innerHTML += generateContactToAssign(i);
  }
}

function generateContactToAssign(i) {
  return `<div class="dropdown-content-div">
  <div class="dropdown_container">
    <div class="initials_circle"><span class="initials_span">${createInitials(i)}</span></div>
    ${contacts[i]}
  </div>
  <div id="checkboxContainer${i}"><img id="checkBoxImage${i}" src="../assets/img/icons/checkbox_empty.png" alt="" onclick='selectAssignedContact(${i})'/></div>
</div>`;
}

function selectAssignedContact(i) {
  document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_filled.png";
  // box-image ersetzen
  // Namen in ein array pushen
}
