let todos = [];
let todo = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];
let matchingTodos = [];
const CATEGORY_COLORS = {'Technical Task': '#1FD7C1', 'User Story': '#0038FF'};
const PRIO_IMAGE_URLS = {
    'low': '../assets/img/icons/prio_kow_green.svg', 
    'medium': '../assets/img/icons/prio_medium_orange.svg', 
    'urgent': '../assets/img/icons/prio_urgent_red.svg'
}
let currentDraggedElement;

async function initBoard() {
    await loadAllTasksBoard();
    loadUserInitials()
    updateHTML(todos);
}

/**
 * This function loads the array "allTasks" from the server and assign it to the array "todos"
 */
async function loadAllTasksBoard() {
    let response = await getItem('remoteTasks');
    todos = JSON.parse(response);
}

/**
 * This function updates the task areas. 
 * The todo-Array is filtered for each status and a new array for the tasks at this specific status is given back.
 * Then, these arrays are passed into the function "updateArea"
 */
function updateHTML(arrayName) {
    todo = arrayName.filter((t) => t["status"] == "toDo");
    inProgress = arrayName.filter((t) => t["status"] == "in-progress");
    awaitFeedback = arrayName.filter((t) => t["status"] == "await-feedback");
    done = arrayName.filter((t) => t["status"] == "done");

    updateArea("toDo", todo, arrayName);
    updateArea("in-progress", inProgress, arrayName);
    updateArea("await-feedback", awaitFeedback, arrayName);
    updateArea("done", done, arrayName);
}

/**
 * In this function, the task-area first gets cleared. After that, if the areaArray is empty, the function "generateEmptyHTML" is called. This function just return a div with the text "no tasks here".
 * If the array isn't empty, the task-element for every task in the array is created by calling the function "generateTodoHTML"
 * @param {string} areaName 
 * @param {Array} areaArray 
 */
function updateArea(areaName, areaArray, arrayName) {
    document.getElementById(areaName).innerHTML = "";
    if(areaArray.length == 0) {
        document.getElementById(areaName).innerHTML += generateEmptyHTML();
    } else {
        for (let index = 0; index < areaArray.length; index++) {
            const element = areaArray[index];
            document.getElementById(areaName).innerHTML += generateTodoHTML(element, arrayName);
            document.getElementById(`prio-image${arrayName.indexOf(element)}`).innerHTML += generatePrioImage(element, arrayName);
            createInitials(element, arrayName);
            if(element.subtasks.length != 0) {
                document.getElementById(`subtask-progress${arrayName.indexOf(element)}`).style.display = "flex";
            }
        }
    }
}

function generateTodoHTML(element, arrayName) {
    return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${arrayName.indexOf(element)}); highlightAreas()" ondragend="removeHighlightAreas()" class="task" id="task${arrayName.indexOf(element)}" onclick="openTaskDetails(${arrayName.indexOf(element)})">
            <span class="task-category" style="background-color: ${CATEGORY_COLORS[element.category]}">${element["category"]}</span>
            <span class="task-title">${element["title"]}</span>
            <span class="task-description">${element["description"]}</span>
            <!-- if there are no subtasks, the progress-bar should not be displayed -->
            <div class="subtask-progress" id="subtask-progress${arrayName.indexOf(element)}" style="display: none">
                <progress class="progress-bar" style="width: ${calculateSubtaskProgress(element)}" value="${calculateSubtaskProgress(element)}" max="100"></progress>
                <span>${checkSubtaskStatus(element)}/${element.subtasks.length} Subtasks</span>
            </div>
            <div class="user-and-prio">
                <div class="assigned-to" id="assigned-to${arrayName.indexOf(element)}"></div>
                <div id="prio-image${arrayName.indexOf(element)}"></div>
            </div>
        </div>
    `;
}

function startDragging(id) {
    currentDraggedElement = id;
    dragCardHighlight(currentDraggedElement);
}

function createInitials(element, arrayName) {
    if(element["assignedTo"] == "") {
        return "";
    } else {
        for (let i = 0; i < element.assignedTo.length; i++) {
            document.getElementById(`assigned-to${arrayName.indexOf(element)}`).innerHTML += /*html*/ `
                <span class="assigned-user" style="background-color: ${element.assignedTo[i].contactColor}">${element.assignedTo[i].contactInitials}</span>
            `;
        }
    }
}

function generatePrioImage(element, arrayName) {
    let imageContainer = document.getElementById(`prio-image${arrayName.indexOf(element)}`);
    if(element["priority"] == undefined) {
        imageContainer.style.display = "none";
    } else {
        return /*html*/ `
            <img src="${PRIO_IMAGE_URLS[element.priority]}" alt="">
        `; 
    }
}

function checkSubtaskStatus(element) {
    if(element.subtasks.length != 0) {
        let subtasksDone = 0;
        element.subtasks.forEach(subtask => {
            if(subtask.subtaskStatus == "done") {
                subtasksDone++;
            }
        });
        return subtasksDone;
    } 
}

function calculateSubtaskProgress(element) {
    // calculate progress if one ore more subtasks are marked done
}

function generateEmptyHTML() {
    return `<div class="task no-task">No tasks here</div>`
}

function allowDrop(event) {
    event.preventDefault();
}

async function moveTo(status) {
    todos[currentDraggedElement]["status"] = status;
    // update status in database
    await storeAllTasksBoard();
    // load tasks from database
    await loadAllTasksBoard();
    updateHTML(todos);
}

function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

function highlightAreas() {
    let dragAreas = document.getElementsByClassName('drag-area');
    for (let i = 0; i < dragAreas.length; i++) {
        dragAreas[i].classList.add("drag-area-highlight");
    }
}

function removeHighlightAreas() {
    let dragAreas = document.getElementsByClassName('drag-area');
    for (let i = 0; i < dragAreas.length; i++) {
        dragAreas[i].classList.remove("drag-area-highlight");
    }
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}

function dragCardHighlight(currentDraggedElement) {
    document.getElementById(`task${currentDraggedElement}`).classList.add("on-drag-highlight");
}

async function storeAllTasksBoard() {
    await setItem("remoteTasks", todos);
}

// open addTask popup
async function openAddTask() {
    let modalBg = document.getElementById('modal-bg');
    modalBg.style.width = '100%';
    modalBg.style.left = 0;
    await loadAllTasks();
    // get actual functions from add_task.js
    await loadContacts();
    renderContactsToAssign();
    renderCategories();
    showAssignedtoContacts();
}

function closeModal() {
    let modalBg = document.getElementById('modal-bg');
    modalBg.style.width = 0;
    modalBg.style.left = '100%';
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
    let modalBg = document.getElementById('modal-bg');
    if (event.target == modalBg) {
        modalBg.style.width = 0;
        modalBg.style.left = '100%';
    }
});

// create fullscreen tasks
function openTaskDetails(index) {
    let modalBg = document.getElementById('modal-bg-details');
    modalBg.style.width = '100%';
    modalBg.style.left = 0;
    let taskDetailsContainer = document.getElementById('task-details');
    taskDetailsContainer.innerHTML = "";
    taskDetailsContainer.innerHTML += createTaskDetailsHtml(index);
    displayAssignedContacts(todos[index]);
    displaySubstasks(todos[index]);
}

function createTaskDetailsHtml(index) {
    let task = todos[index];
    return /*html*/ `
        <div class="details-top">
            <span class="task-category" style="background-color: ${CATEGORY_COLORS[task.category]}">${task.category}</span>
            <span id="close-modal" class="close-modal" onclick="closeModalDetails()">&times;</span>
        </div>
        <div class="details-bottom">
            <h1>${task.title}</h1>
            <p>${task.description}</p>
            <div class="due-date">
                <p>Due date:</p>
                <p>${task.dueDate}</p>
            </div>
            <div class="priority-container">
                <p>Priority:</p>
                <div class="priority">
                    <p>${task.priority}</p>
                    <p>${generatePrioImage(task, todos)}</p>
                </div>
            </div>
            <div class="assigned-to-container">
                <p>Assigned to:</p>
                <div class="assigned-to-contacts" id="assigned-to-contacts"></div>
            </div>
            <div class="subtasks-container">
                <p>Subtasks:</p>
                <div class="subtasks" id="subtasks"></div>
            </div>
            <div class="edit-and-delete-buttons">
                <button>Delete</button>
                <button>Edit</button>
            </div>
        </div>
    `;
}

function displaySubstasks(task) {
    let subtasksContainer = document.getElementById('subtasks');
    subtasksContainer.innerHTML = "";
    for (let i = 0; i < task['subtasks'].length; i++) {
        const subtask = task['subtasks'][i];
        // wenn Status == done, gefüllte Checkbox rendern, anonsten leere
        if(subtask.statusSubtask == 'inProgress') {
            subtasksContainer.innerHTML += /*html*/ `
                <div class="subtask">
                    <img src="../assets/img/icons/check_box_empty.png" alt="" onclick="toggleCheckbox(${i}, ${todos.indexOf(task)})" id="subtask-checkbox${i}">
                    <p class="subtask-text">${subtask.nameSubtask}</p>
                </div>
            `;
        } else {
            subtasksContainer.innerHTML += /*html*/ `
                <div class="subtask">
                    <img src="../assets/img/icons/checkbox_filled.png" alt="" id="checkbox-filled${i}" onclick="toggleCheckbox(${i}, ${todos.indexOf(task)})">
                    <p class="subtask-text">${subtask.nameSubtask}</p>
                </div>
            `;
        }
        
    }
}

function toggleCheckbox(i, taskIndex) {
    if(todos[taskIndex].subtasks[i].statusSubtask == 'inProgress') {
        todos[taskIndex].subtasks[i].statusSubtask = 'done';
        storeAllTasksBoard();
        displaySubstasks(todos[taskIndex]);
    } else {
        todos[taskIndex].subtasks[i].statusSubtask = 'inProgress';
        storeAllTasksBoard();
        displaySubstasks(todos[taskIndex]);
    }
}

function displayAssignedContacts(task) {
    let assignedContactContainer = document.getElementById('assigned-to-contacts');

    for (let i = 0; i < task['assignedTo'].length; i++) {
        const assignedContact = task['assignedTo'][i];
        
        assignedContactContainer.innerHTML += /*html*/ `
        <div class="assigned-to-contact">
            <p class="initials_circle" style="background-color: ${assignedContact.contactColor}">${assignedContact.contactInitials}</p>
            <p>${assignedContact.contactName}</p>
        </div>
    `;
    }
    
}

function closeModalDetails() {
    let modalBg = document.getElementById('modal-bg-details');
    modalBg.style.width = 0;
    modalBg.style.left = '100%';
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
    let modalBg = document.getElementById('modal-bg-details');
    if (event.target == modalBg) {
        modalBg.style.width = 0;
        modalBg.style.left = '100%';
    }
});

// search function
function renderAllOrMatchingTodos() {
    findMatchingTitles();
    document.getElementById("errorContainer").innerHTML = "";
  if (saveInputValue() == ''){
    updateHTML(todos); // Todo
  } else {
    renderErrorOrMatchingDodos();
  };
}

async function findMatchingTitles() {
  await pushMatchingTodos(saveInputValue());
}

function saveInputValue() {
  let search = document.getElementById("searchfield").value;
  return search.toLowerCase();
}

async function pushMatchingTodos(search) {
  matchingTodos = [];
  for (let index = 0; index < todos.length; index++) {
    let title = todos[index].title;
    let description = todos[index].description;
    if (title.toLowerCase().includes(search) || description.toLowerCase().includes(search)) {
      matchingTodos.push(todos[index]);
    }
  }
}

function renderErrorOrMatchingDodos() {
  if (matchingTodos.length == 0) {
    renderErrorBoard();
    updateHTML(matchingTodos);
  } else {
   updateHTML(matchingTodos); // ToDo
  }
}

function renderErrorBoard() {
  let errorContent = document.getElementById("errorContainer");
  errorContent.innerHTML += `
  Keine Ergebnisse gefunden.
  `;
}