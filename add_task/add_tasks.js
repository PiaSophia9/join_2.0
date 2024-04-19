let allTasks = [];
let priority;
let categories = ["Technical Task", "User Story"];

async function init() {
  includeHTML();
  await loadAllTasks();
  await loadContacts();
  renderContactsToAssign('assignedToDropdown');
  renderCategories();
  showAssignedtoContacts('assignedtoContactsContainer');
  console.log("allTasks on load:", allTasks);
  unlogAllSidebarLinks();
  logSidebarLink("addTaskSidebar");
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

/**
 * This function gets the form elements values, pushes them into the array "allTasks" and saves them in the storage. It also clears the form and redirects to board.html
 *
 */
async function createTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let category = document.getElementById("buttonName").textContent;
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
  addTask(task);
}

async function addTask(task) {
  pushTask(task);
  // allTasks = [];
  await storeAllTasks();
  clearForm();
  redirectToBoard();
}

function pushTask(task) {
  allTasks.push(task);
}

async function storeAllTasks() {
  await setItem("remoteTasks", allTasks);
}

function clearForm() {
  document.getElementById("taskForm").reset();
  document.getElementById("assignedtoContactsContainer").innerHTML = "";
  document.getElementById("subtasksRenderContainer").innerHTML = "";
  document.getElementById("buttonName").textContent = "Select task Category";
  removeUrgentPrio();
  removeMediumPrio();
  removeLowPrio();
  clearArrays();
  renderContactsToAssignWithemptyCheckbox();
  turnDateColorGrey();
}

function clearArrays() {
  assignedContacts = [];
  priority = "";
  subtasks = [];
}

function redirectToBoard() {
  const targetUrl = "../board/board.html";
  window.location.href = targetUrl;
}

// Prio Buttons

function setPrioUrgent(buttonID, imageID) {
  priority = "urgent";
  document.getElementById(buttonID).classList.add("urgent_button");
  document.getElementById(imageID).src = "../assets/img/icons/prio_urgent_white.svg";
  removeMediumPrio();
  removeLowPrio();
}

function setPrioMedium(buttonID, imageID) {
  priority = "medium";
  document.getElementById("mediumButton").classList.add("medium_button");
  document.getElementById("mediumImage").src = "../assets/img/icons/prio_medium_white.svg";
  removeLowPrio();
  removeUrgentPrio();
}
function setPrioLow(buttonID, imageID) {
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

function makeIconClearButtonBright() {
  document.getElementById("clearButtonImage").src = "../assets/img/icons/addTask_x_bright.png";
}

function makeIconClearButtonDark() {
  document.getElementById("clearButtonImage").src = "../assets/img/icons/addTask_x_dark.png";
}

function turnDateColorBlack() {
  document.getElementById("taskDueDate").classList.remove("date");
  document.getElementById("taskDueDate").classList.add("date_after_change");
}

function turnDateColorGrey() {
  document.getElementById("taskDueDate").classList.add("date");
  document.getElementById("taskDueDate").classList.remove("date_after_change");
}

function borderRedIfTitleEmpty() {
  if (document.getElementById("taskTitle").value == "") {
    document.getElementById("taskTitle").style.borderColor = "#ff8190";
    document.getElementById("errorContainerTitle").classList.remove("hide_error");
    document.getElementById("errorContainerTitle").classList.add("error_container");
    disOrEnableButton();
  } else {
    document.getElementById("taskTitle").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerTitle").classList.add("hide_error");
    document.getElementById("errorContainerTitle").classList.remove("error_container");
    disOrEnableButton();
  }
}

function borderRedIfDateEmpty() {
  turnDateColorBlack();
  if (document.getElementById("taskDueDate").value == "") {
    document.getElementById("taskDueDate").style.borderColor = "#ff8190";
    document.getElementById("errorContainerDate").classList.remove("hide_error");
    document.getElementById("errorContainerDate").classList.add("error_container");
    disOrEnableButton();
  } else {
    document.getElementById("taskDueDate").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerDate").classList.add("hide_error");
    document.getElementById("errorContainerDate").classList.remove("error_container");
    disOrEnableButton();
  }
}

function borderRedIfCategoryEmpty() {
  if (document.getElementById("buttonName").textContent == "Select task Category") {
    document.getElementById("categoryButton").style.borderColor = "#ff8190";
    document.getElementById("errorContainerCategory").classList.remove("hide_error");
    document.getElementById("errorContainerCategory").classList.add("error_container");
    disOrEnableButton();
  } else {
    document.getElementById("categoryButton").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerCategory").classList.add("hide_error");
    document.getElementById("errorContainerCategory").classList.remove("error_container");
    disOrEnableButton();
  }
}

function checkRequiredFields() {
  if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("buttonName").textContent == "Select task Category") {
    borderRedIfTitleEmpty();
    borderRedIfDateEmpty();
    borderRedIfCategoryEmpty();
  } else {
    document.getElementById("submit_task_button").classList.remove("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.add("btn_dark");
    createTask();
    document.getElementById("submit_task_button").classList.add("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.remove("btn_dark");
  }
}

function disOrEnableButton() {
  if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("buttonName").textContent == "Select task Category") {
    document.getElementById("submit_task_button").classList.add("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.remove("btn_dark");
  } else {
    document.getElementById("submit_task_button").classList.remove("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.add("btn_dark");
  }
}

// Dropdowns

function toggleDropdownAssignedTo(id) {
  document.getElementById(id).classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    document.getElementById("categoryDropdown").classList.remove("show");
  }
  if (!event.target.matches(".dropbtnAssignedContact")) {
    document.getElementById("assignedToDropdown").classList.remove("show");
  }
};

function renderContactsToAssign(id) {
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById(id).innerHTML += generateContactToAssign(i);
    addCheckboxImage(i);
  }
}

function renderContactsToAssignWithemptyCheckbox() {
  document.getElementById("assignedToDropdown").innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById("assignedToDropdown").innerHTML += generateContactToAssign(i);
    emptyCheckboxImage(i);
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

function toggleDropdownCategory() {
  document.getElementById("categoryDropdown").classList.toggle("show");
}

function renderCategories() {
  for (let i = 0; i < categories.length; i++) {
    document.getElementById("categoryDropdown").innerHTML += generateCategories(i);
  }
}

function generateCategories(i) {
  return `<div class="dropdown-content-div" onclick="selectCategory(${i})">
  <div id='categoryName' class="dropdown_container">
  ${categories[i]}</div></div>
`;
}

function selectCategory(i) {
  document.getElementById("categoryButton").innerHTML = `
  <span id="buttonName">${categories[i]}</span>
  
  <img onclick="event.stopPropagation(); toggleDropdownCategory()" class="dropdown_arrow" src="../assets/img/icons/arrow_down_dropdown.png"/>
  `;
  borderRedIfCategoryEmpty();
}

// Contacts to assign

let assignedContacts = [];

function addCheckboxImage(j) {
  for (let i = 0; i < assignedContacts.length; i++) {
    const assContact = assignedContacts[i];
    let contactsIndex = contacts.indexOf(assContact);
    if (contactsIndex == -1) {
      document.getElementById(`checkBoxImage${j}`).src = "../assets/img/icons/checkbox_empty.png";
    } else {
      document.getElementById(`checkBoxImage${contactsIndex}`).src = "../assets/img/icons/checkbox_filled.png";
    }
  }
}

async function selectAssignedContact(i) {
  console.log("i: ", i);
  if (document.getElementById(`checkBoxImage${i}`).src.endsWith("/checkbox_filled.png")) {
    document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_empty.png";
    let currentContact = contacts[i];
    let indexInAssignedContact = assignedContacts.indexOf(currentContact);
    console.log("indexInAssignedContact:", indexInAssignedContact);
    assignedContacts.splice(indexInAssignedContact, 1);
  } else {
    fillCheckboxImage(i);
    pushAssignedContacts(i);
  }
  showAssignedtoContacts('assignedtoContactsContainer');
  console.log("assignedContacts: ", assignedContacts);
}

function fillCheckboxImage(i) {
  document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_filled.png";
}

function emptyCheckboxImage(i) {
  document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_empty.png";
}

function pushAssignedContacts(i) {
  let assignedContact = contacts[i];
  assignedContacts.push(assignedContact);
  console.log("assignedContacts: ", assignedContacts);
}

function stopPropagation() {
  event.stopPropagation(onclick);
}

function showAssignedtoContacts(containerID) {
  document.getElementById(containerID).innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    let j = contacts.indexOf(assignedContacts[i]);
    document.getElementById(containerID).innerHTML += generateInitialCircles(j);
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
    addBorderColorBlue();
  } else {
    removeBorderColorBlue();
  }
});

function showIconsSubtasks(subtaskID, containerID) {
  if (document.getElementById(subtaskID).value !== "") {
    document.getElementById(containerID).classList.remove("d_none");
  } else {
    document.getElementById(containerID).classList.add("d_none");
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
    renewSubtasks();
  }
  removeBorderColorBlue();
  event.stopPropagation();
}

function renewSubtasks() {
  clearSubtask();
  renderSubtasks();
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
  renderSubtasks();
  event.stopPropagation();
}

function makeRenderedSubtasksEditable(i) {
  document.getElementById(`renderedSubtask${i}`).setAttribute("contenteditable", true);
  document.getElementById(`renderedSubtask${i}`).onmouseover = function () {};
  hidePenAndTrash(i);
  showTrashAndCheck(i);
}

function showTrashAndCheck(i) {
  document.getElementById(`containerTrashAndCheck${i}`).classList.remove("d_none");
}

function deleteRenderedSubtask(i, event) {
  deleteSubtask(i);
  event.stopPropagation();
}

function overwriteSubtask(i) {
  let newValueSubtaskName = document.getElementById(`subtasName${i}`).innerText;
  subtasks[i].nameSubtask = newValueSubtaskName;
  renderSubtasks();
  document.getElementById(`containerTrashAndCheck${i}`).classList.add("d_none");
  event.stopPropagation();
  document.getElementById(`containerPenAndTrash${i}`).classList.add("d_none");
  event.stopPropagation();
}
