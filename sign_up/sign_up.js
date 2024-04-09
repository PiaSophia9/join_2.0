let users = [];

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
  validatePassword(password, passwordConfirm);
  pushUsers(user);
  await storeAllUsers();
  resetForm();
}

function pushUsers(user) {
  users.push(user); 
}

async function storeAllUsers() {
  await setItem("remoteUsers", users);
}

// funktion not in use at the moment
async function loadAllUsers() {
  let response = await getItem("remoteUsers");
  users = await JSON.parse(response);

  console.log("Loaded Users: ", users);
}

// password validation - funktioniert nicht
function validatePassword(password, passwordConfirm){
  if(password.value != passwordConfirm.value) {
    passwordConfirm.setCustomValidity("Passwords Don't Match");
  } else {
    passwordConfirm.setCustomValidity('');
  }
  password.onchange = validatePassword;
  passwordConfirm.onkeyup = validatePassword;
}

// checkbox  functionality - when required - does not work
function checkBox() {
  let  policyCheckbox = document.getElementById("accept_policy");
  policyCheckbox.src = "../assets/img/icons/checkbox_filled.png"
}

function resetForm() {
  userName.value = "";
  email.value = "";
  password.value = "";
  passwordConfirm.value = "";
  registerBtn.disabled = false;
}



