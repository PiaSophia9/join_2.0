function loadUserInitials() {
    let loggedUserInitials = document.getElementById("user_initials");
    let storedInitials = localStorage.getItem("userInitials");
    storedInitials = JSON.parse(storedInitials);
    loggedUserInitials.innerHTML = storedInitials;
    return storedInitials;
}

function showDropdown() {
    let dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");

    // Erstelle die Links
    let legalNoticeLink = document.createElement("a");
    legalNoticeLink.href = "#";
    legalNoticeLink.textContent = "legalNoticeLink";

    let privatPolicyLink = document.createElement("a");
    privatPolicyLink.href = "#";
    privatPolicyLink.textContent = "privatPolicyLink";

    const logOutLink = document.createElement("a");
    logOutLink.href = "#";
    logOutLink.textContent = "logOutLink";

    // Füge die Links zum Dropdown hinzu
    dropdown.appendChild(legalNoticeLink);
    dropdown.appendChild(privatPolicyLink);
    dropdown.appendChild(logOutLink);
}