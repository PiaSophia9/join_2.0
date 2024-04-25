let allTasks = [];
let priority;
let categories = ["Technical Task", "User Story"];
let assignedContacts = [];

/**
 * Initializes the page by including HTML, loading all tasks, loading contacts, rendering contacts to assign,
 * rendering categories, showing assigned contacts, unlogging all sidebar links, logging the "addTaskSidebar" link,
 * setting the priority to medium, and loading the user's initials.
 *
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
  includeHTML();
  await loadAllTasks();
  await loadContacts();
  await renderContactsToAssign();
  renderCategories();
  showAssignedtoContacts();
  unlogAllSidebarLinks();
  logSidebarLink("addTaskSidebar");
  setPrioMedium();
  await loadUserInitials();
}

// Bitte nicht löschen! Kann später noch verwendet werden.
// input.addEventListener("keypress", function (event) {
//   if (event.keyCode == 13) {
//     addSubtask();
//   }
// });

/**
 * Loads all tasks from the "remoteTasks" storage and parses the response.
 *
 * @return {Promise<void>} A promise that resolves when the tasks are loaded and parsed.
 */
async function loadAllTasks() {
  let response = await getItem("remoteTasks");
  allTasks = await JSON.parse(response);
}

/**
 * Creates a task object with the values from the input fields and adds it to the task list.
 *
 * @return {Promise<void>} - A promise that resolves when the task is added to the list.
 */
async function createTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let category = document.getElementById("buttonName").textContent;
  let status = "todo";
  if (localStorage.getItem("status")) {
    status = localStorage.getItem("status");
  }

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
  if (localStorage.getItem("status")) {
    localStorage.removeItem("status");
  }
}

/**
 * Adds a task to the task list and performs related actions.
 *
 * @param {Object} task - The task object to be added.
 * @return {Promise<void>} - A promise that resolves when the task is added to the list.
 */
async function addTask(task) {
  document.getElementById("submit_task_button").setAttribute("disabled", true);
  await loadAllTasks();
  await loadContacts();
  pushTask(task);
  await storeAllTasks();
  showSnackbarAddTasks("Task added to board");
  clearForm();
  redirectToBoard();
}

/**
 * Displays a snackbar with the given message and hides it after 3 seconds.
 *
 * @param {string} message - The message to be displayed in the snackbar.
 * @return {void} This function does not return anything.
 */
function showSnackbarAddTasks(message) {
  let snackbarAddTask = document.getElementById("snackbarAddTask");
  snackbarAddTask.className = "show";
  snackbarAddTask.innerHTML = message;
  setTimeout(function () {
    snackbarAddTask.className = snackbarAddTask.className.replace("show", "");
  }, 3000);
}

/**
 * Adds a task to the allTasks array.
 *
 * @param {Object} task - The task object to be added.
 */
function pushTask(task) {
  allTasks.push(task);
}

/**
 * Asynchronously stores all tasks in the "remoteTasks" storage.
 *
 * @return {Promise<void>} A promise that resolves when the tasks are stored.
 */
async function storeAllTasks() {
  await setItem("remoteTasks", allTasks);
}

/**
 * Clears the task form and associated elements, resets button text, removes priorities, and renders contacts with checkboxes.
 *
 * @return {void} This function does not return anything.
 */
function clearForm() {
  document.getElementById("taskForm").reset();
  document.getElementById("assignedtoContactsContainer").innerHTML = "";
  document.getElementById("subtasksRenderContainer").innerHTML = "";
  document.getElementById("buttonName").textContent = "Select task Category";
  removeUrgentPrio();
  removeMediumPrio();
  removeLowPrio();
  setPrioMedium();
  clearArrays();
  renderContactsToAssignWithemptyCheckbox();
  turnDateColorGrey();
  setPrioMedium();
}

/**
 * Clears the assignedContacts, priority, and subtasks arrays.
 *
 * @return {void} This function does not return anything.
 */
function clearArrays() {
  assignedContacts = [];
  priority = "";
  subtasks = [];
}

/**
 * Redirects the user to the board page after a delay of 3 seconds.
 *
 * @param {string} targetUrl - The URL of the board page.
 * @return {void} This function does not return a value.
 */
function redirectToBoard() {
  const targetUrl = "../board/board.html";
  setTimeout(function () {
    window.location.href = targetUrl;
  }, 3000);
}

/**
 * Sets the priority of the task to "urgent" and updates the user interface accordingly.
 *
 * @return {undefined} This function does not return a value.
 */
function setPrioUrgent() {
  priority = "urgent";
  document.getElementById("urgentButton").classList.add("urgent_button");
  document.getElementById("urgentImage").src = "../assets/img/icons/prio_urgent_white.svg";
  removeMediumPrio();
  removeLowPrio();
}

/**
 * Sets the priority to "medium" and updates the corresponding button and image elements.
 *
 * @return {void} This function does not return a value.
 */
function setPrioMedium() {
  priority = "medium";
  document.getElementById("mediumButton").classList.add("medium_button");
  document.getElementById("mediumImage").src = "../assets/img/icons/prio_medium_white.svg";
  removeLowPrio();
  removeUrgentPrio();
}

/**
 * Sets the priority to low, adds a CSS class to the low button, changes the image source to a low priority icon, and removes any existing medium and urgent priorities.
 */
function setPrioLow() {
  priority = "low";
  document.getElementById("lowButton").classList.add("low_button");
  document.getElementById("lowImage").src = "../assets/img/icons/prio_low_white.svg";
  removeMediumPrio();
  removeUrgentPrio();
}

/**
 * Removes the "urgent" priority styling by removing the CSS class from the urgent button and changing the image source to a red priority icon.
 *
 * @return {undefined} This function does not return a value.
 */
function removeUrgentPrio() {
  document.getElementById("urgentButton").classList.remove("urgent_button");
  document.getElementById("urgentImage").src = "../assets/img/icons/prio_urgent_red.svg";
}

/**
 * Removes the medium priority from the button and updates the corresponding image source.
 *
 * @return {undefined} This function does not return a value.
 */
function removeMediumPrio() {
  document.getElementById("mediumButton").classList.remove("medium_button");
  document.getElementById("mediumImage").src = "../assets/img/icons/prio_medium_orange.svg";
}

/**
 * Removes the low priority styling by removing the CSS class from the low button and changing the image source to a green low priority icon.
 *
 * @return {undefined} This function does not return a value.
 */
function removeLowPrio() {
  document.getElementById("lowButton").classList.remove("low_button");
  document.getElementById("lowImage").src = "../assets/img/icons/prio_kow_green.svg";
}

/**
 * Sets the source of the "clearButtonImage" element to the bright version of the addTask_x icon.
 *
 * @return {void} This function does not return a value.
 */
function makeIconClearButtonBright() {
  document.getElementById("clearButtonImage").src = "../assets/img/icons/addTask_x_bright.png";
}

/**
 * Sets the source of the "clearButtonImage" element to the dark version of the addTask_x icon.
 *
 * @param {type} None - No parameters needed.
 * @return {type} None - No return value.
 */
function makeIconClearButtonDark() {
  document.getElementById("clearButtonImage").src = "../assets/img/icons/addTask_x_dark.png";
}

/**
 * Changes the color of the task due date to black by removing the 'date' class and adding the 'date_after_change' class.
 *
 * @return {undefined} This function does not return a value.
 */
function turnDateColorBlack() {
  document.getElementById("taskDueDate").classList.remove("date");
  document.getElementById("taskDueDate").classList.add("date_after_change");
}

/**
 * Sets the color of the "taskDueDate" element to grey by adding the "date" class and removing the "date_after_change" class.
 *
 * @return {void} This function does not return a value.
 */
function turnDateColorGrey() {
  document.getElementById("taskDueDate").classList.add("date");
  document.getElementById("taskDueDate").classList.remove("date_after_change");
}

/**
 * Sets the border color of the "taskTitle" element to red and shows an error message if the title is empty.
 *
 * @return {undefined} This function does not return a value.
 */
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

/**
 * Sets the border color of the "taskDueDate" element to red if it is empty and to grey otherwise.
 *
 * @return {void} This function does not return a value.
 */
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

/**
 * Sets the border color of the "categoryButton" element to red if the button name is "Select task Category" and shows an error message,
 * otherwise sets the border color to grey.
 *
 * @return {void} This function does not return a value.
 */
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

/**
 * Checks if the required fields in the task form are filled. If any of the fields are empty,
 * it applies red border and shows error messages. If all fields are filled, it enables the
 * submit button and calls the createTask function.
 *
 * @return {void} This function does not return a value.
 */
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

/**
 * Toggles the disabled state of the submit task button based on the values of the task title, task due date, and selected task category fields.
 *
 * @return {void} This function does not return a value.
 */
function disOrEnableButton() {
  if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("buttonName").textContent == "Select task Category") {
    document.getElementById("submit_task_button").classList.add("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.remove("btn_dark");
  } else {
    document.getElementById("submit_task_button").classList.remove("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.add("btn_dark");
  }
}

/**
 * Toggles the visibility of the dropdown menu for assigned to contacts.
 *
 * @return {void} This function does not return anything.
 */
function toggleDropdownAssignedTo() {
  document.getElementById("assignedToDropdown").classList.toggle("show");
}

/**
 * Renders the contacts to assign in the "assignedToDropdown" element.
 *
 * @return {Promise<void>} A promise that resolves when the rendering is complete.
 */
async function renderContactsToAssign() {
  document.getElementById("assignedToDropdown").innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById("assignedToDropdown").innerHTML += generateContactToAssign(i);
    addCheckboxImage(i);
  }
}

/**
 * Renders the contacts to assign with an empty checkbox for each contact.
 *
 * @return {void} This function does not return anything.
 */
function renderContactsToAssignWithemptyCheckbox() {
  document.getElementById("assignedToDropdown").innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById("assignedToDropdown").innerHTML += generateContactToAssign(i);
    emptyCheckboxImage(i);
  }
}

/**
 * Generates the HTML code for a contact to be assigned.
 *
 * @param {number} i - The index of the contact in the contacts array.
 * @return {string} The generated HTML code for the contact.
 */
function generateContactToAssign(i) {
  return `<div class="dropdown-content-div" onclick="selectAssignedContact(${i}), stopPropagation()">
  <div class="dropdown_container">
    <div  style="background-color:${contacts[i].contactColor}" class="initials_circle"><span class="initials_span">${contacts[i].contactInitials}</span></div>
    <span id="contacts${i}">${contacts[i].contactName}</span>
  </div>
  <div id="checkboxContainer${i}"><img id="checkBoxImage${i}" src="../assets/img/icons/checkbox_empty.png" alt=""></div>
</div>`;
}

/**
 * Toggles the visibility of the dropdown menu for task categories.
 *
 * @return {void} This function does not return anything.
 */
function toggleDropdownCategory() {
  document.getElementById("categoryDropdown").classList.toggle("show");
}

/**
 * Renders the categories in the "categoryDropdown" element.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function renderCategories() {
  document.getElementById("categoryDropdown").innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    document.getElementById("categoryDropdown").innerHTML += generateCategories(i);
  }
}

/**
 * Generates the HTML code for a category dropdown item.
 *
 * @param {number} i - The index of the category in the categories array.
 * @return {string} The generated HTML code for the category dropdown item.
 */
function generateCategories(i) {
  return `<div class="dropdown-content-div" onclick="selectCategory(${i})">
  <div id='categoryName' class="dropdown_container">
  ${categories[i]}</div></div>
`;
}

/**
 * Updates the category button with the selected category and toggles the dropdown category.
 *
 * @param {number} i - The index of the selected category.
 * @return {void} This function does not return a value.
 */
function selectCategory(i) {
  document.getElementById("categoryButton").innerHTML = `
  <span id="buttonName">${categories[i]}</span>
  
  <img onclick="event.stopPropagation(); toggleDropdownCategory()" class="dropdown_arrow" src="../assets/img/icons/arrow_down_dropdown.png"/>
  `;
  borderRedIfCategoryEmpty();
}

function addCheckboxImage(j) {
  for (let i = 0; i < assignedContacts.length; i++) {
    const assContact = assignedContacts[i];
    const contact = contacts[j];

    if (assContact.contactMail == contact.contactMail) {
      document.getElementById(`checkBoxImage${j}`).src = "../assets/img/icons/checkbox_filled.png";
    }
  }
}

async function selectAssignedContact(i) {
  if (document.getElementById(`checkBoxImage${i}`).src.endsWith("/checkbox_filled.png")) {
    document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_empty.png";
    let currentContact = contacts[i];
    for (let j = 0; j < assignedContacts.length; j++) {
      let assignedContact = assignedContacts[j];
      if (assignedContact.contactMail == currentContact.contactMail) {
        assignedContacts.splice(j, 1);
      }
    }
  } else {
    fillCheckboxImage(i);
    pushAssignedContacts(i);
  }
  showAssignedtoContacts();
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
}

function stopPropagation() {
  event.stopPropagation(onclick);
}

function showAssignedtoContacts() {
  document.getElementById("assignedtoContactsContainer").innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    let assignedContact = assignedContacts[i];
    let foundIndex = -1;
    for (let j = 0; j < contacts.length; j++) {
      if (contacts[j].contactName === assignedContact.contactName) {
        foundIndex = j;
        break;
      }
    }
    if (foundIndex !== -1) {
      document.getElementById("assignedtoContactsContainer").innerHTML += generateInitialCircles(foundIndex);
    }
  }
}

function generateInitialCircles(i) {
  return `
  <div id="initialCircle${i}" style="background-color:${contacts[i].contactColor}" class="initials_circle"><span class="initials_span">${contacts[i].contactInitials}</span></div>
  `;
}

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
  return `<div id="renderedSubtask${i}" onclick="makeRenderedSubtasksEditable(${i})" onmouseover="showPenAndTrash(${i})" onmouseout="hidePenAndTrash(${i})" class="rendered_subtask" contenteditable="true">
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

function deleteRenderedSubtask(i) {
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
