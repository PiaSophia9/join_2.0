let todos = [
    {
        id: 0,
        title: "Putzen",
        category: "todo",
    },
    {
        id: 1,
        title: "Kochen",
        category: "in-progress",
    },
    {
        id: 2,
        title: "Einkaufen",
        category: "done",
    },
    {
        id: 3,
        title: "Spazieren gehen",
        category: "await-feedback"
    }
];

let currentDraggedElement;

function updateHTML() {
    // Linker Container für Todos mit category == 'todo'
    let todo = todos.filter((t) => t["category"] == "todo");

    document.getElementById("todo").innerHTML = "";
    if(todo.length == 0) {
        document.getElementById("todo").innerHTML += generateEmptyHTML();
    } else {
        for (let index = 0; index < todo.length; index++) {
            const element = todo[index];
            document.getElementById("todo").innerHTML += generateTodoHTML(element);
        }
    }

    // zweiter Container für Todos mit category == 'in-progress'
    let inProgress = todos.filter((t) => t["category"] == "in-progress");

    document.getElementById("in-progress").innerHTML = "";
    if(inProgress.length == 0) {
        document.getElementById("in-progress").innerHTML += generateEmptyHTML();
    } else {
        for (let index = 0; index < inProgress.length; index++) {
            const element = inProgress[index];
            document.getElementById("in-progress").innerHTML += generateTodoHTML(element);
        }
    }

    // dritter Container für Todos mit category == 'await-feedback'
    let awaitFeedback = todos.filter((t) => t["category"] == "await-feedback");

    document.getElementById("await-feedback").innerHTML = "";
    if(awaitFeedback.length == 0) {
        document.getElementById("await-feedback").innerHTML += generateEmptyHTML();
    } else {
        for (let index = 0; index < awaitFeedback.length; index++) {
            const element = awaitFeedback[index];
            document.getElementById("await-feedback").innerHTML += generateTodoHTML(element);
        }
    }

    // vierter Container für Todos mit category == 'done'
    let done = todos.filter((t) => t["category"] == "done");

    document.getElementById("done").innerHTML = "";
    if(done.length == 0) {
        document.getElementById("done").innerHTML += generateEmptyHTML();
    } else {
        for (let index = 0; index < done.length; index++) {
            const element = done[index];
            document.getElementById("done").innerHTML += generateTodoHTML(element);
        }
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element["id"]})" class="todo">${element["title"]}</div>`;
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
