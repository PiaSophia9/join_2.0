let users = [];
let colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

async function initUser() {
  resetForm();
  await loadAllUsers();
  // signUpSuccessfullyInfo();
}

async function loadAllUsers() {
  let response = await getItem("remoteUsers");
  users = await JSON.parse(response);

  console.log("Loaded Users: ", users);
}

async function addUser() {
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
  await validatePassword(user);
  
}

function pushUsers(user) {
  users.push(user); 
}

function disOrEnableButton() {
  // If all those three have value...
  if (document.getElementById("username").value == "" || document.getElementById("email").value == "" || document.getElementById("password").value == "" || document.getElementById("password_confirm").value == "") {
    // In the beginning the button is disabled and nothin has to be done
    if (document.getElementById("registerBtn").hasAttribute("disabled")) {
      // This else-statement is used if the required inputs had values so that the button was enabled, but then one input was deleted. In this case the disabled attribute has to be set again and the button has to get back the css of the enabled button.
    } else {
      document.getElementById("registerBtn").setAttribute("disabled", "disabled");
      document.getElementById("registerBtn").classList.add("btn_dark_disabled");
      document.getElementById("registerBtn").classList.remove("btn_dark");
    }
    // If all inputs have values, the button is enabled.
  } else {
    document.getElementById("registerBtn").removeAttribute("disabled");
    document.getElementById("registerBtn").classList.remove("btn_dark_disabled");
    document.getElementById("registerBtn").classList.add("btn_dark");
  }
}
// password validation // 
async function validatePassword(user){
  let passwordInput = document.getElementById("password");
  let passwordConfirmInput = document.getElementById("password_confirm");
  let errorMessage = document.getElementById('passwordError');
  if(passwordInput.value !== passwordConfirmInput.value) {
    errorMessage.style.display = 'block';
    errorMessage.style.color = '#ff7f8e';
    passwordConfirmInput.style.borderColor = '#ff7f8e';
    errorMessage.textContent = 'Passwords do not match';
    // users = [];
    return false;
  } else {
    pushUsers(user);
  errorMessage.textContent = ''; // Fehlermeldung zurücksetzen
  await storeAllUsers();
  // signUpSuccessfullyInfo();
  redirectToLogin();
  }
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
// function acceptPolicy() {
//   checkBox();
// }

// function checkBox() {
//   let  policyCheckbox = document.getElementById("accept_policy");
//   policyCheckbox.src = "../assets/img/icons/checkbox_filled.png"
// }

// function uncheckBox() {
//   let policyCheckbox = document.getElementById("accept_policy");
//   policyCheckbox.src = "../assets/img/icons/checkbox_empty.png";
// }

function resetForm() {
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

function createInitials(userName) {
  let userNameAsString = userName.toString();
  let initials = userNameAsString.match(/\b(\w)/g).join("");
  let firstTwoInitials = initials.slice(0, 2);
  return firstTwoInitials;
}

function createColors() {
  let color = colors[generateRandomNumber()];
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 15);
}

