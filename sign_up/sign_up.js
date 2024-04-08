let users = [];

function init() {
  registerBtn.disabled = true;
}

function addUser() {
  let userName = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let passwordConfirm = document.getElementById("password_confirm");

  let user = {
    "name": userName.value,
    "email": email.value,
    "password": password.value,
    "passwordConfirm": passwordConfirm.value
  };

  users.push(user);
  console.log(users);
  resetForm();
}


  function resetForm() {
    userName.value = '';
    email.value = '';
    password.value = '';
    passwordConfirm.value = '';
    registerBtn.disabled = false;
  
  // Weiterleitung zu Login Seite + Nachricht anzeigen: "Erfolgreiche Registrierung" auf login.html
  // window.location.href = "../login/login.html?msg=Du hast dich erfolgreich registriert";
}