

function loadUserName() {
    let loggedUser = document.getElementById('logged_user');
    loggedUser.innerHTML = '';
    if (loggedInUserId >= 0 && loggedInUserId < users.length) {
        loggedUser.innerHTML = users[loggedInUserId].userName;
    } else {
        return 'Benutzer nicht gefunden';
    }
}
     
const date = new Date();

function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

const formattedDate = formatDate();
document.getElementById('todaysDate').textContent = formattedDate;
