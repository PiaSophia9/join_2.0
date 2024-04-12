let users = [];
let emails = [];
let passwords = [];

async function initLogIn() {
  await loadAllUsers();
  loadLogInLocalStorage();
  resetLogInForm();
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
  findUser();
}

function disOrEnableLogInBtn() {
  // If all those two have value...
  if (document.getElementById("email").value == "" || document.getElementById("password").value == "") {
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

function saveLogInDataInArray() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  emails.push(email.value);
  passwords.push(password.value);
  
}
function resetLogInForm() {
document.getElementById('logInForm').reset();
}

function saveLogInLocalStorage() {
  emailsAsText  = JSON.stringify(emails);
  passwordsAsText = JSON.stringify(passwords);
  localStorage.setItem("userEmail" , emailsAsText );
  localStorage.setItem("userPassword" , passwordsAsText );
}

function loadLogInLocalStorage() {
  let emailsAsText =  localStorage.getItem("userEmail") ;
  let  passwordsAsText =  localStorage.getItem("userPassword") ;
  if (!emailsAsText || !passwordsAsText){return;}
  else{
    emails = JSON.parse(emailsAsText);
    passwords = JSON.parse(passwordsAsText);
  }
}

function checkBox() {
  let  policyCheckbox = document.getElementById("remember_me");
  policyCheckbox.src = "../assets/img/icons/checkbox_filled.png"
  saveLogInDataInArray();
  saveLogInLocalStorage();
}

//funktioniert noch nicht richtig // eckige klammern und "" müssen entfernt werden
function loadRememberMe() {
  let email = document.getElementById("email");
  let userEmail = localStorage.getItem("userEmail"); 
  email.value = userEmail; 

  let password = document.getElementById("password");
  let userPassword = localStorage.getItem("userPassword"); 
  password.value = userPassword; 
}


// funktion wird noch nicht benutzt 
function uncheckBox() {
  let policyCheckbox = document.getElementById("remember_me");
  policyCheckbox.src = "../assets/img/icons/checkbox.png";
}



// Validate user input before submitting the form - noch nicht fertig
// function validateInputs() {
// const urlParams = new URLSearchParams(window.location.search);
// const msg = urlParams.get("msg");

// if (msg) {
//   msgBox.innerHTML = msg;
// } else {
//   document.getElementById("msgBox").style.display = "none";
// }
// }


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
    //redirect to SignUp.html
  }
}

function redirectToSummary() {
  const targetUrl = '../summary/summary.html';
  window.location.href = targetUrl;
}
