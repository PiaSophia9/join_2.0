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

// Sidebar

function unlogAllSidebarLinks() {
  document.getElementById("summarySidebar").classList.add("link_sidebar");
  document.getElementById("addTaskSidebar").classList.add("link_sidebar");
  document.getElementById("boardSidebar").classList.add("link_sidebar");
  document.getElementById("contactSidebar").classList.add("link_sidebar");
  document.getElementById("policySidebar").classList.add("legal_link");
  document.getElementById("legalSidebar").classList.add("legal_link");
}

function logSidebarLink(linkID) {
  if (linkID == "policySidebar" || linkID == "legalSidebar") {
    document.getElementById(`${linkID}`).classList.remove("legal_link");
    document.getElementById(`${linkID}`).classList.add("legal_link_active");
  } else {
    document.getElementById(`${linkID}`).classList.remove("link_sidebar");
    document.getElementById(`${linkID}`).classList.add("link_sidebar_active");
  }
}
