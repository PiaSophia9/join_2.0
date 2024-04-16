function loadUserInitials() {
    let loggedUserInitials = document.getElementById("user_initials");
    let storedInitials = localStorage.getItem("userInitials");
    storedInitials = JSON.parse(storedInitials);
    loggedUserInitials.innerHTML = storedInitials;
    return storedInitials;
}