async function initSummary() {
  await includeHTML();
  await loadAllTasksSummary();
  loadUserName();
  loadUserInitials();
  showToDo();
  showDone();
  showUrgentTasks();
  showUrgentTaskDate();
  showAllTasks();
  showInProgress();
  showAwaitFeedback();
  unlogAllSidebarLinks();
  logSidebarLink("summarySidebar");
}

function loadUserName() {
  let loggedUser = document.getElementById("logged_user");
  let storedName = localStorage.getItem("userName");
  storedName = JSON.parse(storedName);
  console.log(storedName);
  loggedUser.innerHTML = storedName;
}

async function loadAllTasksSummary() {
  let response = await getItem("remoteTasks");
  todos = JSON.parse(response);
  console.log(todos);
}

function showUrgentTasks() {
  let urgentAmount = document.getElementById("urgent");
  let urgentBoard = todos.filter((t) => t["priority"] == "urgent");
  urgentAmount.innerHTML = urgentBoard.length;
}

//morgen debuggen
function showUrgentTaskDate() {
  let urgentDate = document.getElementById("urgentDate");
  let dueDate = todos.filter((t) => t["dueDate"] == "");
  let urgentDates = dueDate.map((t) => t["date"]);
  console.log(urgentDates);
  let urgentDatesSorted = urgentDates.sort();
  console.log(urgentDatesSorted);
  urgentDate.innerHTML = urgentDatesSorted[0];
}

function showToDo() {
  let todoAmount = document.getElementById("todo");
  let todoBoard = todos.filter((t) => t["status"] == "toDo");
  console.log(todoBoard);
  todoAmount.innerHTML = todoBoard.length;
}

function showDone() {
  let doneAmount = document.getElementById("done");
  let doneBoard = todos.filter((t) => t["status"] == "done");
  doneAmount.innerHTML = doneBoard.length;
}
function showAllTasks() {
  let allTasksAmount = document.getElementById("tasksInBoard");
  allTasksAmount.innerHTML = todos.length;
}

function showInProgress() {
  let inProgressAmount = document.getElementById("tasksInProgress");
  let inProgressBoard = todos.filter((t) => t["status"] == "in-progress");
  inProgressAmount.innerHTML = inProgressBoard.length;
}

function showAwaitFeedback() {
  let awaitingAmount = document.getElementById("awaitingFeedback");
  let awaitingBoard = todos.filter((t) => t["status"] == "await-feedback");
  awaitingAmount.innerHTML = awaitingBoard.length;
}

const date = new Date();

function formatDate(date) {
  const options = {month: "long", day: "numeric", year: "numeric"};
  return new Date().toLocaleDateString("en-US", options);
}

const formattedDate = formatDate();
document.getElementById("todaysDate").textContent = formattedDate;

function redirectToBoard() {
  const targetUrl = "../board/board.html";
  window.location.href = targetUrl;
}
