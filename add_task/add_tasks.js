let allTasks = [];
let priority;

async function init() {
  includeHTML();
  await loadAllTasks();
  await loadContacts();
  // await loadAssignedContacts();
  // createAndPushInitials();
  // createAndPushColors();
  renderContactsToAssign();
  showAssignedtoContacts();
  console.log("allTasks on load:", allTasks);
}

/**
 * This function gets the form elements values, pushes them into the array "allTasks" and saves them in the storage.
 *
 */
async function addTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let category = document.getElementById("taskCategory").value;
  let status = "toDo";

  let task = {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    assignedTo: assignedContacts,
    category: category,
    subtasks: subtasks,
    status: status,
  };

  pushTask(task);
  // allTasks = [];
  await storeAllTasks();
  console.log(allTasks);
  clearInputs();
  clearContainers();
  console.log("allTasks after button clicked:", allTasks);
}

function pushTask(task) {
  allTasks.push(task);
}

async function storeAllTasks() {
  // assignedContacts = [];
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

// Prio Buttons

function setPrioUrgent() {
  priority = "urgent";
  document.getElementById("urgentButton").classList.add("urgent_button");
  document.getElementById("urgentImage").src = "../assets/img/icons/prio_urgent_white.svg";
  removeMediumPrio();
  removeLowPrio();
}

function setPrioMedium() {
  priority = "medium";
  document.getElementById("mediumButton").classList.add("medium_button");
  document.getElementById("mediumImage").src = "../assets/img/icons/prio_medium_white.svg";
  removeLowPrio();
  removeUrgentPrio();
}
function setPrioLow() {
  priority = "low";
  document.getElementById("lowButton").classList.add("low_button");
  document.getElementById("lowImage").src = "../assets/img/icons/prio_low_white.svg";
  removeMediumPrio();
  removeUrgentPrio();
}

function removeUrgentPrio() {
  document.getElementById("urgentButton").classList.remove("urgent_button");
  document.getElementById("urgentImage").src = "../assets/img/icons/prio_urgent_red.svg";
}

function removeMediumPrio() {
  document.getElementById("mediumButton").classList.remove("medium_button");
  document.getElementById("mediumImage").src = "../assets/img/icons/prio_medium_orange.svg";
}

function removeLowPrio() {
  document.getElementById("lowButton").classList.remove("low_button");
  document.getElementById("lowImage").src = "../assets/img/icons/prio_kow_green.svg";
}

function clearInputs() {
  document.getElementById("taskForm").reset();
}

function clearContainers() {
  document.getElementById("assignedtoContactsContainer").innerHTML = "";
  document.getElementById("subtasksRenderContainer").innerHTML = "";
}

// dis- or enable button if required inputs are filled

function disOrEnableButton() {
  // If all those three have value...
  if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("taskCategory").value == "") {
    // In the beginning the button is disabled and nothin has to be done
    if (document.getElementById("submit_task_button").hasAttribute("disabled")) {
      // This else-statement is used if the required inputs had values so that the button was enabled, but then one input was deleted. In this case the disabled attribute has to be set again and the button has to get back the css of the enabled button.
    } else {
      document.getElementById("submit_task_button").setAttribute("disabled", "disabled");
      document.getElementById("submit_task_button").classList.add("btn_dark_disabled");
      document.getElementById("submit_task_button").classList.remove("btn_dark");
    }
    // If all inputs have values, the button is enabled.
  } else {
    document.getElementById("submit_task_button").removeAttribute("disabled");
    document.getElementById("submit_task_button").classList.remove("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.add("btn_dark");
  }
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleDropdown() {
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

let assignedContacts = [];
let assignedContactInitials = [];
let assignedContactColors = [];

let colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

function addCheckboxImage(j) {
  for (let i = 0; i < assignedContacts.length; i++) {
    // muss hier nicht contacts rein??
    const assContact = assignedContacts[i];
    let contactsIndex = contacts.indexOf(assContact);
    // result is index in contacts OR -1
    if (contactsIndex == -1) {
      document.getElementById(`checkBoxImage${j}`).src = "../assets/img/icons/checkbox_empty.png";
    } else {
      document.getElementById(`checkBoxImage${contactsIndex}`).src = "../assets/img/icons/checkbox_filled.png";
    }
  }
}

// Render Dropdown mit contacts
function renderContactsToAssign() {
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById("myDropdown").innerHTML += generateContactToAssign(i);
    addCheckboxImage(i);
  }
}

function generateContactToAssign(i) {
  return `<div class="dropdown-content-div" onclick="stopPropagation()">
  <div class="dropdown_container">
    <div  style="background-color:${contacts[i].contactColor}" class="initials_circle"><span class="initials_span">${contacts[i].contactInitials}</span></div>
    <span id="contacts${i}">${contacts[i].contactName}</span>
  </div>
  <div id="checkboxContainer${i}"><img id="checkBoxImage${i}" src="../assets/img/icons/checkbox_empty.png" alt="" onclick='selectAssignedContact(${i})'/></div>
</div>`;
}

async function selectAssignedContact(i) {
  // function selectOrUnselectContact
  console.log("i: ", i);
  if (document.getElementById(`checkBoxImage${i}`).src.endsWith("/checkbox_filled.png")) {
    document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_empty.png";
    let currentContact = contacts[i];
    let indexInAssignedContact = assignedContacts.indexOf(currentContact);
    console.log("indexInAssignedContact:", indexInAssignedContact);
    assignedContacts.splice(indexInAssignedContact, 1); // aus dem array löschen
  } else {
    changeCheckboxImage(i);
    pushAssignedContacts(i);
  }
  // await storeAssignedContacts();
  showAssignedtoContacts();
  console.log("assignedContacts: ", assignedContacts);
}

function changeCheckboxImage(i) {
  document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_filled.png";
}

function pushAssignedContacts(i) {
  let assignedContact = contacts[i];
  assignedContacts.push(assignedContact);
  console.log("assignedContacts: ", assignedContacts);
}

function stopPropagation() {
  event.stopPropagation(onclick);
}

// async function storeAssignedContacts() {
//   // assignedContacts = [];
//   await setItem("remoteAssignedContacts", assignedContacts);
// }

// async function loadAssignedContacts() {
//   let response = await getItem("remoteAssignedContacts");
//   assignedContacts = await JSON.parse(response);
// }

function showAssignedtoContacts() {
  document.getElementById("assignedtoContactsContainer").innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    let j = contacts.indexOf(assignedContacts[i]);
    document.getElementById("assignedtoContactsContainer").innerHTML += generateInitialCircles(j);
  }
}

function generateInitialCircles(i) {
  return `
  <div id="initialCircle${i}" style="background-color:${contacts[i].contactColor}" class="initials_circle"><span class="initials_span">${contacts[i].contactInitials}</span></div>
  `;
}

// Subtasks

let subtasks = [];

function addBorderColorBlue() {
  document.getElementById("subtaskContainer").classList.add("subtask_container_blue_border");
}

function removeBorderColorBlue() {
  document.getElementById("subtaskContainer").classList.remove("subtask_container_blue_border");
}

window.addEventListener("click", function (e) {
  if (document.getElementById("subtaskContainer").contains(e.target)) {
    // Clicked in box
    addBorderColorBlue();
  } else {
    // Clicked outside the box
    removeBorderColorBlue();
  }
});

function showIconsSubtasks() {
  if (document.getElementById("taskSubtask").value !== "") {
    document.getElementById("iconsSubtasksContainer").classList.remove("d_none");
  } else {
    document.getElementById("iconsSubtasksContainer").classList.add("d_none");
  }
}

function clearSubtask() {
  document.getElementById("taskSubtask").value = "";
  document.getElementById("iconsSubtasksContainer").classList.add("d_none");
  removeBorderColorBlue();
  event.stopPropagation();
}

function addSubtask() {
  if (document.getElementById("taskSubtask").value) {
    let nameSubtask = document.getElementById("taskSubtask").value;
    let statusSubtask = "inProgress";

    let subtask = {
      nameSubtask: nameSubtask,
      statusSubtask: statusSubtask,
    };
    subtasks.push(subtask);
    console.log(subtasks);
    clearSubtask();
    renderSubtasks();
  }
  removeBorderColorBlue();
  event.stopPropagation();
}

function renderSubtasks() {
  document.getElementById("subtasksRenderContainer").innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    let subtaskName = subtasks[i].nameSubtask;
    document.getElementById("subtasksRenderContainer").innerHTML += generateSubtasks(i, subtaskName);
  }
}

function generateSubtasks(i, subtaskName) {
  return `<div id="renderedSubtask${i}" onclick="makeRenderedSubtasksEditable(${i})" onmouseover="showPenAndTrash(${i})" onmouseout="hidePenAndTrash(${i})" class="rendered_subtask">
  <div class="span_container ">
    <span class="rendered_subtasks_span">&#x2022</span>
    <span id="subtasName${i}"> ${subtaskName}</span>
  </div>
  <div id="containerPenAndTrash${i}" class="d_none">
    <img onclick="makeRenderedSubtasksEditable(${i})" id="pen${i}" src="../assets/img/icons/subtasks_pen.png" alt="">
    <img src="../assets/img/icons/subtask_line.png" alt="">
    <img onclick="deleteSubtask(${i})" id="trash${i}" src="../assets/img/icons/subtask_trash.png" alt="">
  </div>
  <div id="containerTrashAndCheck${i}" class="d_none">
    <img onclick="deleteRenderedSubtask(${i})" src="../assets/img/icons/subtask_trash.png" alt="">
    <img src="../assets/img/icons/subtask_line.png" alt="">
    <img onclick="overwriteSubtask(${i})" src="../assets/img/icons/subtask_check.png" alt="">
  </div>
</div>`;
}

function showPenAndTrash(i) {
  document.getElementById(`containerPenAndTrash${i}`).classList.remove("d_none");
}

function hidePenAndTrash(i) {
  document.getElementById(`containerPenAndTrash${i}`).classList.add("d_none");
}

function deleteSubtask(i) {
  subtasks.splice(i, 1);
  // Todo: push array in storage if add task is pressed
  renderSubtasks();
}

function makeRenderedSubtasksEditable(i) {
  document.getElementById(`renderedSubtask${i}`).setAttribute("contenteditable", true);
  document.getElementById(`renderedSubtask${i}`).onmouseover = function () {};
  showTrashAndCheck(i);
}

function showTrashAndCheck(i) {
  document.getElementById(`containerTrashAndCheck${i}`).classList.remove("d_none");
}

function deleteRenderedSubtask(i) {
  deleteSubtask(i);
}

function overwriteSubtask(i) {
  // In dieser Funktion passiert der Fehler
  let newValueSubtaskName = document.getElementById(`subtasName${i}`).innerText;
  subtasks[i].nameSubtask = newValueSubtaskName;
  renderSubtasks();
  // containerTrashAndCheck soll verschwinden - funktioniert nicht:
  document.getElementById(`containerTrashAndCheck${i}`).classList.add("d_none");
  // Die Funktion showPenAndTrash soll wieder onmouseover ausgeführt werden - funktioniert nicht:
  document.getElementById(`renderedSubtask${i}`).onmouseover = function () {
    showPenAndTrash(i);
  }; // funktioniert nicht
}
