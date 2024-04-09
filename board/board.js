let todos = [];
const CATEGORY_COLORS = {'Technical Task': '#1FD7C1', 'User Story': '#0038FF'}

let currentDraggedElement;

async function initBoard() {
    await loadAllTasks();
    updateHTML();
}

/**
 * This function loads the array "allTasks" from the server and assign it to the array "todos"
 */
async function loadAllTasks() {
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
        }
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${todos.indexOf(element)})" class="task">
            <span class="task-category" style="background-color: ${CATEGORY_COLORS[element.category]}">${element["category"]}</span>
            <span class="task-title">${element["title"]}</span>
            <span class="task-description fade">${element["description"]}</span>
        </div>
    `;
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
    await storeAllTasks();
    // load tasks from database
    await loadAllTasks();
    updateHTML();
}


function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}

async function storeAllTasks() {
    await setItem("remoteTasks", todos);
}
