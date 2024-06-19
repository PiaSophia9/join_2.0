/**
 * Initializes the login process by loading all users and resetting the login form.
 *
 * @return {Promise<void>} A promise that resolves when the login initialization is complete.
 */
async function initLogIn() {
  await loadAllUsers();
  resetLogInForm();
}

/**
 * Loads all users from the "remoteUsers" storage and parses the response.
 */
async function loadAllUsers() {
  users = await getItem("remoteUsers");
}

/**
 * Asynchronously logs in the user by calling the `findUser` function.
 */
async function login() {
  findUser();
}

/**
 * Enables or disables the login button based on the values of the email and password fields.
 * If either field is empty, the button is disabled and its appearance is updated.
 * If both fields are filled, the button is enabled and its appearance is updated.
 *
 */
function disOrEnableLogInBtn() {
  if (document.getElementById("email").value == "" || document.getElementById("password").value == "") {
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

/**
 * Resets the login form by clearing all input fields.
 */
function resetLogInForm() {
  document.getElementById("logInForm").reset();
}

/**
 * Checks the state of the email and password fields in the login form and enables or disables the
 * "remember me" checkbox accordingly. If both fields are empty, the checkbox is disabled. If both
 * fields are filled, the checkbox is enabled and its appearance is updated. Additionally, if the
 * checkbox is enabled, the function saves the login information to local storage.
 *
 */
function checkBox() {
  if (document.getElementById("email").value == "" || document.getElementById("password").value == "") {
    if (document.getElementById("remember_me").hasAttribute("disabled")) {
    } else {
      document.getElementById("remember_me").setAttribute("disabled", "disabled");
    }
  } else {
    document.getElementById("remember_me").removeAttribute("disabled");
    policyCheckbox = document.getElementById("remember_me");
    policyCheckbox.src = "./assets/img/icons/check_full_no_padding.svg";
    saveLogInLocalStorage();
  }
}

/**
 * Saves the login information to the local storage.
 *
 * @param {string} email - The email entered by the user.
 * @param {string} password - The password entered by the user.
 */
function saveLogInLocalStorage() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  localStorage.setItem("userEmail", JSON.stringify(email));
  localStorage.setItem("userPassword", JSON.stringify(password));
}

/**
 * Loads the user's "remember me" data from local storage and populates the email and password fields.
 * Finally, it calls the function to enable or disable the login button based on the field values.
 */
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

/**
 * Finds a user in the users array based on the email and password entered by the user.
 * If a user is found, it saves the user's initials and name in the local storage and redirects to the summary page.
 * If no user is found, it validates the password and performs other actions based on the validation result.
 *
 */
function findUser() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find((u) => u.userEmail == email.value && u.userPassword == password.value);
  if (user) {
    saveInitialsInLocalStorageLogIn(user);
    saveNameAInLocalStorageLogIn(user);
    redirectToSummary();
  } else {
    validatePassword();
  }
}

/**
 * Saves the user's initials to the local storage.
 *
 * @param {Object} user - The user object containing userInitials.
 */
function saveInitialsInLocalStorageLogIn(user) {
  let userInitials = user["userInitials"];
  localStorage.setItem("userInitials", JSON.stringify(userInitials));
}

/**
 * Saves the user's name in the local storage.
 *
 * @param {Object} user - The user object containing the user's name.
 */
function saveNameAInLocalStorageLogIn(user) {
  let userName = user["userName"];
  localStorage.setItem("userName", JSON.stringify(userName));
}

/**
 * Validates the password entered by the user.
 *
 * @return {boolean} Returns true if the password is valid, false otherwise.
 */
function validatePassword() {
  let passwordError = document.getElementById("passwordError");
  let passwordInput = document.getElementById("password");
  let storedPassword = users.find((u) => u.userPassword);
  if (passwordInput.value == storedPassword) {
    passwordError.textContent = "";
    return true;
  } else {
    passwordError.style.display = "block";
    passwordError.style.color = "#ff7f8e";
    passwordError.textContent = "Wrong password Ups! Try again.";
    passwordInput.style.borderColor = "#ff7f8e";
    passwordInput.value = "";
  }
}

/**
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
  const targetUrl = "../summary/summary.html";
  window.location.href = targetUrl;
}

/**
 * Redirects the user to the sign up page.
 *
 * @return {void} This function does not return a value.
 */
function redirectToSignUp() {
  const targetUrl = "../sign_up/sign_up.html";
  window.location.href = targetUrl;
}
