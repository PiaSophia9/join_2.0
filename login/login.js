let users = [];

async function initLogIn() {
  await loadAllUsers();
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

function resetLogInForm() {
  document.getElementById('logInForm').reset();
}


function checkBox() {
  if(document.getElementById("email").value == "" || document.getElementById("password").value == "") {
    if (document.getElementById("remember_me").hasAttribute("disabled")) {
    
    } else {
        document.getElementById("remember_me").setAttribute("disabled", "disabled");
    } 
    
  } else {
        document.getElementById("remember_me").removeAttribute("disabled");
        policyCheckbox = document.getElementById("remember_me");
        policyCheckbox.src = "../assets/img/icons/checkbox_filled.png"
        saveLogInLocalStorage();
      } 
    }



function saveLogInLocalStorage() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  localStorage.setItem("userEmail", JSON.stringify(email));
  localStorage.setItem("userPassword", JSON.stringify(password));
}

function loadRememberMe() {
  let email = document.getElementById("email");
  let response = localStorage.getItem("userEmail"); 
  userEmail = JSON.parse(response);
  email.value = userEmail; 

  let password = document.getElementById("password");
  let userPassword = localStorage.getItem("userPassword"); 
  userPassword = JSON.parse(userPassword);
  password.value = userPassword; 
  disOrEnableLogInBtn();
}


// funktion wird noch nicht benutzt 
function uncheckBox() {
  let policyCheckbox = document.getElementById("remember_me");
  policyCheckbox.src = "../assets/img/icons/checkbox.png";
  // remove local storage
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userPassword");
}

function findUser() {
 
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find( u => u.userEmail == email.value && u.userPassword == password.value);
  console.log(user);
  if (user) {
    console.log("user gefunden");
    loggedInUserId = users.indexOf(user);
    console.log(loggedInUserId);
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


