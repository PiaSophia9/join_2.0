let todos = [];
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
    updateHTML();
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
function updateHTML() {
    let todo = todos.filter((t) => t["status"] == "toDo");
    let inProgress = todos.filter((t) => t["status"] == "in-progress");
    let awaitFeedback = todos.filter((t) => t["status"] == "await-feedback");
    let done = todos.filter((t) => t["status"] == "done");

    updateArea("toDo", todo);
    updateArea("in-progress", inProgress);
    updateArea("await-feedback", awaitFeedback);
    updateArea("done", done);
}

/**
 * In this function, the task-area first gets cleared. After that, if the areaArray is empty, the function "generateEmptyHTML" is called. This function just return a div with the text "no tasks here".
 * If the array isn't empty, the task-element for every task in the array is created by calling the function "generateTodoHTML"
 * @param {string} areaName 
 * @param {Array} areaArray 
 */
function updateArea(areaName, areaArray) {
    document.getElementById(areaName).innerHTML = "";
    if(areaArray.length == 0) {
        document.getElementById(areaName).innerHTML += generateEmptyHTML();
    } else {
        for (let index = 0; index < areaArray.length; index++) {
            const element = areaArray[index];
            document.getElementById(areaName).innerHTML += generateTodoHTML(element);
            document.getElementById(`prio-image${todos.indexOf(element)}`).innerHTML += generatePrioImage(element);
            createInitials(element);
        }
    }
}

function generateTodoHTML(element) {
    return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${todos.indexOf(element)}); highlightAreas()" ondragend="removeHighlightAreas()" class="task" id="task${todos.indexOf(element)}">
            <span class="task-category" style="background-color: ${CATEGORY_COLORS[element.category]}">${element["category"]}</span>
            <span class="task-title">${element["title"]}</span>
            <span class="task-description">${element["description"]}</span>
            <!-- if there are no subtasks, the progress-bar should not be displayed -->
            <div class="subtask-progress">
                <progress class="progress-bar" value="${calculateSubtaskProgress(element)}" max="100"></progress>
                <span>Subtasks</span>
            </div>
            <div class="user-and-prio">
                <div class="assigned-to" id="assigned-to${todos.indexOf(element)}"></div>
                <!-- image should change dynamically based on the priority -->
                <div id="prio-image${todos.indexOf(element)}"></div>
            </div>
        </div>
    `;
}

function startDragging(id) {
    currentDraggedElement = id;
    dragCardHighlight(currentDraggedElement);
}

function createInitials(element) {
    if(element["assignedTo"] == "") {
        return "";
    } else {
        for (let i = 0; i < element["assignedTo"].length; i++) {
            let currentName = element["assignedTo"][i];
            let currentNameAsString = currentName.toString();
            let initials = currentNameAsString.match(/\b(\w)/g).join("");
            let firstTwoInitials = initials.slice(0, 2);
            
            document.getElementById(`assigned-to${todos.indexOf(element)}`).innerHTML += /*html*/ `
                <span class="assigned-user">${firstTwoInitials}</span>
            `;
        }
    }
}

function generatePrioImage(element) {
    let imageContainer = document.getElementById(`prio-image${todos.indexOf(element)}`);
    if(element["priority"] == undefined) {
        imageContainer.style.display = "none";
    } else {
        return /*html*/ `
            <img src="${PRIO_IMAGE_URLS[element.priority]}" alt="">
        `; 
    }
}

function calculateSubtaskProgress(element) {
    let progress = (element["subtasks"].done / element["subtasks"].length) * 100;
    return progress;
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
    updateHTML();
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
    createAndPushInitials();
    createAndPushColors();
    renderContactsToAssign();
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
