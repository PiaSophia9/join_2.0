function loadUserInitials() {
    let loggedUserInitials = document.getElementById("user_initials");
    let storedInitials = localStorage.getItem("userInitials");
    storedInitials = JSON.parse(storedInitials);
    loggedUserInitials.innerHTML = storedInitials;
    return storedInitials;
}

function showDropdown() {
    let headerDropdown = document.getElementById('header_dropdown');
    headerDropdown.innerHTML = /*html*/`
    <div class="header_dropdown_content">
        <p onclick="redirectToLegalNotice()">Legal Notice</p>
        <p onclick="redirectToPrivatPolicy()">Privacy Policy</p>
        <p onclick="LogOut()">Log out</p>
    </div>
    `;
}