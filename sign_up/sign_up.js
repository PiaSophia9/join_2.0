let users = [];

async function initUser() {
  await loadAllUsers();
  signUpSuccessfullyInfo();
}

async function loadAllUsers() {
  let response = await getItem("remoteUsers");
  users = await JSON.parse(response);

  console.log("Loaded Users: ", users);
}

async function addUser() {
  let userName = document.getElementById("username");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let passwordConfirm = document.getElementById("password_confirm");

  let user = {
    "name": userName.value,
    "email": email.value,
    "password": password.value,
    "passwordConfirm": passwordConfirm.value
  };
  pushUsers(user);
  await validatePassword();
}

function pushUsers(user) {
  users.push(user); 
}

// password validation // 
async function validatePassword(){
  let passwordInput = document.getElementById("password");
  let passwordConfirmInput = document.getElementById("password_confirm");
  let errorMessage = document.getElementById('passwordError');
  if(passwordInput.value !== passwordConfirmInput.value) {
    errorMessage.style.display = 'block';
    errorMessage.style.color = '#ff7f8e';
    passwordConfirmInput.style.borderColor = '#ff7f8e';
    return false;
  } 
  errorMessage.textContent = ''; // Fehlermeldung zurücksetzen
  await storeAllUsers();
  redirectToLogin();
}

async function storeAllUsers() {
  // users = [];
  await setItem("remoteUsers", users);
  console.log(users);
}

function redirectToLogin() {
  const targetUrl = '../login/login.html';
  window.location.href = targetUrl;
}

// checkbox  - mit Sophia besprechen 
function acceptPolicy() {
  checkBox();
  // uncheckBox();
}

function checkBox() {
  let  policyCheckbox = document.getElementById("accept_policy");
  policyCheckbox.src = "../assets/img/icons/checkbox_filled.png"
}

function uncheckBox() {
  let policyCheckbox = document.getElementById("accept_policy");
  policyCheckbox.src = "../assets/img/icons/checkbox_empty.png";
}

function resetForm() {
  userName.value = "";
  email.value = "";
  password.value = "";
  passwordConfirm.value = "";
}

function signUpSuccessfullyInfo() {
  let modalBg = document.getElementById("modal-bg");
  let modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";
  modalBg.style.display = "block";
  modalContent.innerHTML = `
  <p id="msg">You Signed Up successfully</p>`;
  signUpSuccessfullyAnimation(modalBg, modalContent);
}

function signUpSuccessfullyAnimation(modalBg, modalContent) {
  setTimeout(() => {
    modalContent.innerHTML = "";
    modalBg.style.display = "none";
  }, 1000);
}