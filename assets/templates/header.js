function loadUserInitials() {
    let loggedUserInitials = document.getElementById("user_initials");
    let storedInitials = localStorage.getItem("userInitials");
    storedInitials = JSON.parse(storedInitials);
    loggedUserInitials.innerHTML = storedInitials;
    return storedInitials;
}

function showNavHeader() {
    document.getElementById("myDropdown").classList.toggle("show_menu_header");
  }

//   window.onclick = function(event) {
//     if (!event.target.matches('.user_circle')) {
//       let dropdowns = document.getElementsByClassName("header_dropdown_content");
//       let i;
//       for (i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show')) {
//           openDropdown.classList.remove('show');
//         }
//       }
//     }
//   }

function logOut() {
    localStorage.removeItem("userPassword");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userInitials");
    window.location.href = "../../login/login.html";
}