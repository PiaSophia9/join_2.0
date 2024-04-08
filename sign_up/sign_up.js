let users = [];

// function init() {
//   registerBtn.disabled = true;
// }

async function addUser() {
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
  // registerBtn.disabled = false;
  console.log('users', users);
  pushUsers(user);
  await storeAllUsers();
}

function pushUsers(user) {
  users.push(user); 
}

async function storeAllUsers() {
  await setItem("remoteUsers", users);
}

async function loadAllUsers() {
  let response = await getItem("remoteUsers");
  users = await JSON.parse(response);

  console.log("Loaded Users: ", users);
  // resetForm();
}

  // function resetForm() {
  //   userName.value = '';
  //   email.value = '';
  //   password.value = '';
  //   passwordConfirm.value = '';
  //   registerBtn.disabled = true;
  // }
  
  // Weiterleitung zu Login Seite + Nachricht anzeigen: "Erfolgreiche Registrierung" auf login.html
  // window.location.href = "../login/login.html?msg=Du hast dich erfolgreich registriert";