function initSummary() {
    loadUserName();
}

function loadUserName() {
    let loggedUser = document.getElementById('logged_user');
    let storedName = localStorage.getItem('userName');
    storedName = JSON.parse(storedName);
    console.log(storedName);
    loggedUser.innerHTML = storedName;
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