let todos = [
  {
    id: 0,
    title: "Putzen",
    category: "open",
  },
  {
    id: 1,
    title: "Kochen",
    category: "open",
  },
  {
    id: 2,
    title: "Einkaufen",
    category: "closed",
  },
];

let currentDraggedElement;

function updateHTML() {
  // Oberer Container für Todos mit category == 'open'
  let open = todos.filter((t) => t["category"] == "open");

  document.getElementById("open").innerHTML = "";

  for (let index = 0; index < open.length; index++) {
    const element = open[index];
    document.getElementById("open").innerHTML += generateTodoHTML(element);
  }

  // Unterer Container für Todos mit category == 'closed'
  let closed = todos.filter((t) => t["category"] == "closed");

  document.getElementById("closed").innerHTML = "";

  for (let index = 0; index < closed.length; index++) {
    const element = closed[index];
    document.getElementById("closed").innerHTML += generateTodoHTML(element);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateTodoHTML(element) {
  return `<div draggable="true" ondragstart="startDragging(${element["id"]})" class="todo">${element["title"]}</div>`;
}

function allowDrop(ev) {
  ev.preventDefault();
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
