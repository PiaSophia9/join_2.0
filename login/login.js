let users = [];

async function init() {
  await loadAllUsers();
}

async function loadAllUsers() {
  let response = await getItem("remoteUsers");
  users = await JSON.parse(response);

  console.log("Loaded Users: ", users);
}

// async function loadUsers() {
//   try {
//     users = JSON.parse(await getItem("users"));
//   } catch (e) {
//     console.error("Loading error:", e);
//   }
// }

// wird gerade nicht benutzt
async function login() {
  registerBtn.disabled = true;
  resetForm();
  findUser();
}

function checkBox() {
  let  policyCheckbox = document.getElementById("remember_me");
  policyCheckbox.src = "../assets/img/icons/checkbox_filled.png"
}

function resetForm() {
  email.value = "";
  password.value = "";
  registerBtn.disabled = false;
}

// Validate user input before submitting the form - noch nicht fertig
function validateInputs() {
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");

if (msg) {
  msgBox.innerHTML = msg;
} else {
  document.getElementById("msgBox").style.display = "none";
}
}


function findUser() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find( u => u.email == email.value && u.password == password.value);
  console.log(user);
  if (user) {
    console.log("user gefunden");
    redirectToSummary();
  } else {
    // Please sing up  / Passwort falsch / Email nicht vorhanden
    console.log("user muss sich noch registrieren");
  }
}

function redirectToSummary() {
  const targetUrl = '../summary/summary.html';
  window.location.href = targetUrl;
}
