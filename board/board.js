let todos = [];

let currentDraggedElement;

async function init() {
    await loadAllTasks();
    updateHTML();
}

async function loadAllTasks() {
    let response = await getItem('remoteTasks');
    todos = JSON.parse(response);
    console.log(todos);
}

function updateHTML() {
    let todo = todos.filter((t) => t["status"] == "todo");
    let inProgress = todos.filter((t) => t["status"] == "in-progress");
    let awaitFeedback = todos.filter((t) => t["status"] == "await-feedback");
    let done = todos.filter((t) => t["status"] == "done");

    updateArea("todo", todo);
    updateArea("in-progress", inProgress);
    updateArea("await-feedback", awaitFeedback);
    updateArea("done", done);
}

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
        <div draggable="true" ondragstart="startDragging(${element["category"]})" class="todo">
            <p>${element["title"]}</p>
        </div>
    `;
}

function generateEmptyHTML() {
    return `<div class="todo no-task">No tasks here</div>`
}

function allowDrop(event) {
    event.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]["category"] = category;
    //ZB Todo mit id 1: Das Feld 'category' ändert sich zu open oder closed
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}
