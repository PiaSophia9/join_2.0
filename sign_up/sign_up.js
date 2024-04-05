let users = [];

function addUser() {
  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let passwordConfirm = document.getElementById("password_confirm");

  let user = {
    "name": name.value,
    "email": email.value,
    "password": password.value,
    "passwordConfirm": passwordConfirm.value
  };

  users.push(user);

  console.log(users);

  name.value = '';
  email.value = '';
  password.value = '';
  passwordConfirm.value = '';
  // Weiterleitung zu Login Seite + Nachricht anzeigen: "Erfolgreiche Registrierung" auf login.html
  // window.location.href = "login.html?msg=Du hast dich erfolgreich registriert";
}
