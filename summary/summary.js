

function loadUserName() {

    if (loggedInUserId >= 0 && loggedInUserId < users.length) {
        return users[loggedInUserId].userName;
    } else {
        return 'Benutzer nicht gefunden';
    }
}

const userName = loadUserName();
console.log(userName); 
document.getElementById('logged_user').textContent = userName;
     
const date = new Date();

function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

const formattedDate = formatDate();
document.getElementById('todaysDate').textContent = formattedDate;
