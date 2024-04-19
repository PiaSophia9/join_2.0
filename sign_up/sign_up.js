let users = [];
let colors = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#9327FF",
  "#00BEE8",
  "#1FD7C1",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B",
];

async function initUser() {
  resetSignUpForm();
  await loadAllUsers();
  console.log(users);
  // signUpSuccessfullyInfo();
}

async function loadAllUsers() {
  let response = await getItem("remoteUsers");
  users = await JSON.parse(response);
}

function addUser() {
  let userName = document.getElementById("username").value;
  let userEmail = document.getElementById("email").value;
  let userPassword = document.getElementById("password").value;
  let userInitials = createInitials(userName);
  let userColor = createColors();

  let user = {
    userName: userName,
    userEmail: userEmail,
    userPassword: userPassword,
    userInitials: userInitials,
    userColor: userColor,
  };
  validatePassword(user);
}

function pushUsers(user) {
  users.push(user);
}

function saveNameAInLocalStorage() {
  let userName = document.getElementById("username").value;
  localStorage.setItem("userName", JSON.stringify(userName));
}

function createInitials(userName) {
  let userNameAsString = userName.toString();
  let initials = userNameAsString.match(/\b(\w)/g).join("");
  let firstTwoInitials = initials.slice(0, 2);
  saveInitialsInLocalStorage(firstTwoInitials);
  return firstTwoInitials;
}

function saveInitialsInLocalStorage(firstTwoInitials) {
  localStorage.setItem("userInitials", JSON.stringify(firstTwoInitials));
}

function disOrEnableSignUpBtn() {
  if (
    document.getElementById("username").value == "" ||
    document.getElementById("email").value == "" ||
    document.getElementById("password").value == "" ||
    document.getElementById("password_confirm").value == ""
  ) {
    if (document.getElementById("registerBtn").hasAttribute("disabled")) {
    } else {
      document.getElementById("registerBtn").setAttribute("disabled", "disabled");
      document.getElementById("registerBtn").classList.add("btn_dark_disabled");
      document.getElementById("registerBtn").classList.remove("btn_dark");
    }
  } else {
    document.getElementById("registerBtn").removeAttribute("disabled");
    document.getElementById("registerBtn").classList.remove("btn_dark_disabled");
    document.getElementById("registerBtn").classList.add("btn_dark");
  }
}

function validatePassword(user) {
  let passwordInput = document.getElementById("password");
  let passwordConfirmInput = document.getElementById("password_confirm");
  let errorMessage = document.getElementById("passwordError");
  if (passwordInput.value !== passwordConfirmInput.value) {
    errorMessage.style.display = "block";
    errorMessage.style.color = "#ff7f8e";
    passwordConfirmInput.style.borderColor = "#ff7f8e";
    errorMessage.textContent = "Passwords do not match";
    passwordInput.value = "";
    passwordConfirmInput.value = "";
  } else {
    pushUsers(user);
    saveNameAInLocalStorage();
    errorMessage.textContent = ""; // Fehlermeldung zurücksetzen
    // signUpSuccessfullyInfo();
    acceptPolicy();
    policyError.textContent = "";
    resetSignUpForm();
  }
}

async function storeAllUsers() {
  // users = [];
  await setItem("remoteUsers", users);
}

function redirectToLogin() {
  const targetUrl = "../login/login.html";
  window.location.href = targetUrl;
}

async function acceptPolicy() {
  let policyError = document.getElementById("policyError");
  if (
    document.getElementById("accept_policy").src.endsWith("/checkbox_filled.png")
  ) {
    await storeAllUsers();
    redirectToLogin();
  } else {
    policyError.style.display = "block";
    policyError.style.color = "#ff7f8e";
    policyError.textContent = "Please accept the Privat Policy";
  }
}

function checkBox() {
  let policyCheckbox = document.getElementById("accept_policy");
  policyCheckbox.src = "../assets/img/icons/checkbox_filled.png";
}
// funktioniert noch nicht
function uncheckBox() {
  let policyCheckbox = document.getElementById("accept_policy");
  policyCheckbox.src = "../assets/img/icons/checkbox_empty.png";
}

function resetSignUpForm() {
  document.getElementById("signUpForm").reset();
}

function signUpSuccessfullyInfo() {
  let modalBg = document.getElementById("modal-bg");
  let modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";
  modalBg.style.display = "block";
  modalContent.innerHTML = `
  <span id="msg">You Signed Up successfully</span>`;
  setTimeout(() => {
    modalContent.innerHTML = "";
    modalBg.style.display = "none";
  }, 3000);
}

function createColors() {
  let color = colors[generateRandomNumber()];
  return color;
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 15);
}
