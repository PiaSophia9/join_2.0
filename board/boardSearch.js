let matchingTodos = [];

function renderAllOrMatchingTodos() {
  if (saveInputValue() = ''){
    updateHTML(); 
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
  if (matchingTodos == []) {
    renderError();
  } else {
   updateHTML(matchingTodos); // ToDo
  }
}

function renderError() {
  let errorContent = document.getElementById("errorContainer");
  errorContent.innerHTML += `
  Keine Ergebnisse gefunden.
  `;
}


// async function initSearch() {
//   loadAllTasksBoard();
// }

// async function loadAllTasksBoard() {
//   let response = await getItem('remoteTasks');
//   todos = JSON.parse(response);
// }


// raus copiert von Board.js

// function updateHTMLX(arrayName) {
//   let todo = arrayName.filter((t) => t["status"] == "toDo");
//   let inProgress = arrayName.filter((t) => t["status"] == "in-progress");
//   let awaitFeedback = arrayName.filter((t) => t["status"] == "await-feedback");
//   let done = arrayName.filter((t) => t["status"] == "done");

//   updateArea("toDo", todo, arrayName);
//   updateArea("in-progress", inProgress, arrayName);
//   updateArea("await-feedback", awaitFeedback, arrayName);
//   updateArea("done", done, arrayName);
// }

// /**
// * In this function, the task-area first gets cleared. After that, if the areaArray is empty, the function "generateEmptyHTML" is called. This function just return a div with the text "no tasks here".
// * If the array isn't empty, the task-element for every task in the array is created by calling the function "generateTodoHTML"
// * @param {string} areaName 
// * @param {Array} areaArray 
// */
// function updateArea(areaName, areaArray, arrayName) {
//   document.getElementById(areaName).innerHTML = "";
//   if(areaArray.length == 0) {
//       document.getElementById(areaName).innerHTML += generateEmptyHTML();
//   } else {
//       for (let index = 0; index < areaArray.length; index++) {
//           const element = areaArray[index];
//           document.getElementById(areaName).innerHTML += generateTodoHTML(element, arrayName);
//           document.getElementById(`prio-image${arrayName.indexOf(element)}`).innerHTML += generatePrioImage(element);
//           createInitials(element, arrayName);
//       }
//   }
// }

// function generateTodoHTML(element, arrayName) {
//   return /*html*/ `
//       <div draggable="true" ondragstart="startDragging(${arrayName.indexOf(element)}); highlightAreas()" ondragend="removeHighlightAreas()" class="task" id="task${arrayName.indexOf(element)}">
//           <span class="task-category" style="background-color: ${CATEGORY_COLORS[element.category]}">${element["category"]}</span>
//           <span class="task-title">${element["title"]}</span>
//           <span class="task-description">${element["description"]}</span>
//           <!-- if there are no subtasks, the progress-bar should not be displayed -->
//           <div class="subtask-progress">
//               <progress class="progress-bar" value="${calculateSubtaskProgress(element)}" max="100"></progress>
//               <span>Subtasks</span>
//           </div>
//           <div class="user-and-prio">
//               <div class="assigned-to" id="assigned-to${arrayName.indexOf(element)}"></div>
//               <!-- image should change dynamically based on the priority -->
//               <div id="prio-image${arrayName.indexOf(element)}"></div>
//           </div>
//       </div>
//   `;
// }

// function startDragging(id) {
//   currentDraggedElement = id;
//   dragCardHighlight(currentDraggedElement);
// }

// function createInitials(element) {
//   if(element["assignedTo"] == "") {
//       return "";
//   } else {
//       for (let i = 0; i < element["assignedTo"].length; i++) {
//           let currentName = element["assignedTo"][i];
//           let currentNameAsString = currentName.toString();
//           let initials = currentNameAsString.match(/\b(\w)/g).join("");
//           let firstTwoInitials = initials.slice(0, 2);
          
//           document.getElementById(`assigned-to${arrayName.indexOf(element)}`).innerHTML += /*html*/ `
//               <span class="assigned-user">${firstTwoInitials}</span>
//           `;
//       }
//   }
// }

// function generatePrioImage(element) {
//   let imageContainer = document.getElementById(`prio-image${arrayName.indexOf(element)}`);
//   if(element["priority"] == undefined) {
//       imageContainer.style.display = "none";
//   } else {
//       return /*html*/ `
//           <img src="${PRIO_IMAGE_URLS[element.priority]}" alt="">
//       `; 
//   }
// }
