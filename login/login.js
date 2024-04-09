let users = [];

async function init() {
  loadAllUsers();
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

async function login() {
  registerBtn.disabled = true;
  users.push({
    email: email.value,
    password: password.value,
  });
  await setItem("users", JSON.stringify(users));
  resetForm();
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

// Validate user input before submitting the form
function validateInputs() {
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");

if (msg) {
  msgBox.innerHTML = msg;
} else {
  document.getElementById("msgBox").style.display = "none";
}
}

// Falls hier was fehlt nochmal in Video 15 ab Minute 6.25 schauen.
// Function wird noch nicht verwendet:
function findUser() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find((u) => u.email == email.value && u.password == password.value);
  if (user) {
    // Todo Nachricht: User gefunden oder login erfolgreich oder einfach weiter auf die Seite leiten.
    console.log("user gefunden");
  } else {
    // Fehlermeldung
    console.log("user muss sich noch registrieren");
  }
}
