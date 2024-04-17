let todos = [];


async function initSummary() {
    await includeHTML();
    await loadAllTasksSummary();
    loadUserName();
    loadUserInitials();
}

function loadUserName() {
    let loggedUser = document.getElementById('logged_user');
    let storedName = localStorage.getItem('userName');
    storedName = JSON.parse(storedName);
    console.log(storedName);
    loggedUser.innerHTML = storedName;
}

async function loadAllTasksSummary() {
    let response = await getItem('remoteTasks');
    todos = JSON.parse(response);
    console.log(todos);
}
     
function showToDo() {
    let todoAmount = document.getElementById('todo');
    let todoBoard = todos.filter((t) => t["status"] == "toDo");
    console.log(todoBoard);
    todoAmount.innerHTML = todoBoard.length;
}

const date = new Date();

function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

const formattedDate = formatDate();
document.getElementById('todaysDate').textContent = formattedDate;

function redirectToBoard() {
    const targetUrl = '../board/board.html';
    window.location.href = targetUrl;
  }