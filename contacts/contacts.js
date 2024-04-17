let contacts = [];
const contactColors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];
let sortedStartingLetters = [];
let uniqueStartingLetters = [];

async function initContacts() {
  includeHTML();
  await loadContacts();
  loadUserInitials();
  displayContacts();
}

async function loadContacts() {
  try {
    let response = await getItem("remoteContacts");
    contacts = JSON.parse(response);
  } catch (error) {
    console.log("No contacts stored in database");
  }
}

function displayContacts() {
  let contactsContainer = document.getElementById("all-contacts");
  contactsContainer.innerHTML = "";
  sortContactsByName();
  createStartingLetters();

  // display starting letters
  for (let i = 0; i < uniqueStartingLetters.length; i++) {
    let letter = uniqueStartingLetters[i];
    contactsContainer.innerHTML += /*html*/ `
            <h3 class="starting-letter">${letter}</h3>
            <div class="contacts-at-letter" id="contacts-at-letter${letter}"></div>
        `;
  }
  // put each contact under the correct starting letter
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    for (let j = 0; j < uniqueStartingLetters.length; j++) {
      let startingLetter = uniqueStartingLetters[j];
      let contactsAtLetterContainer = document.getElementById(`contacts-at-letter${startingLetter}`);
      if (contact.contactName[0] == startingLetter) {
        contactsAtLetterContainer.innerHTML += /*html*/ `
                    <div class="contact" id="contact${i}" onclick="displayContactDetails(${i}); toggleActiveContact(${i})">
                        <div style="background-color: ${contact.contactColor}" class="initials_circle initials_circle_small"><span class="initials_span">${contact.contactInitials}</span></div>
                        <div class="name-and-mail">
                            <span id="contact-name${i}">${contact.contactName}</span>
                            <span class="contact-mail">${contact.contactMail}</span>
                        </div>
                    </div>
                `;
        break; // if contact matches the starting letter, jump back to first for-loop
      }
    }
  }
}

function toggleActiveContact(i) {
  let selectedContact = document.getElementById(`contact${i}`);
  let allContacts = document.querySelectorAll(".contact");

  allContacts.forEach((e) => {
    e.classList.remove("contact-selected");
  });
  selectedContact.classList.add("contact-selected");
}

function displayContactDetails(i) {
  let contactContainer = document.getElementById("contact-container");
  let contact = contacts[i];
  let contactInformation = document.getElementById("contact-information");

  contactContainer.innerHTML = /*html*/ `
        <div style="background-color: ${contact.contactColor}" class="initials_circle initials_circle_big"><span class="initials_span">${contact.contactInitials}</span></div>
        <div class="name-and-edit">
            <div class="name_container">
                <span class="contact_name">${contact.contactName}</span>
            </div>
            <div class="edit_delete_container">
                <button class="edit-button" onclick="openEditContact(${i})">Edit</button>
                <button class="edit-button" onclick="deleteContact(${i})">Delete</button>
            </div>
        </div>
    `;

  contactInformation.innerHTML = /*html*/ `
        <p>Contact Information</p>
        <h4>Email</h4>
        <a class="contact-email" href="mailto: ${contact.contactMail}">${contact.contactMail}</a>
        <h4>Phone</h4>
        <span>${contact.contactPhone}</span>
    `;
}

function sortContactsByName() {
  contacts.sort(function (a, b) {
    if (a.contactName < b.contactName) {
      return -1;
    }
    if (a.contactName > b.contactName) {
      return 1;
    }
    return 0;
  });
}

function createStartingLetters() {
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    sortedStartingLetters.push(contact.contactName[0]);
  }
  uniqueStartingLetters = [...new Set(sortedStartingLetters)];
  uniqueStartingLetters.sort();
  sortedStartingLetters = [];
}

async function addContact() {
  let contactName = document.getElementById("name-input");
  let contactMail = document.getElementById("mail-input");
  let contactPhone = document.getElementById("phonenumber-input");
  let contactInitials = createContactInitials(contactName.value);
  let contactColor = createContactColor();

  let contact = {
    contactName: contactName.value,
    contactMail: contactMail.value,
    contactPhone: contactPhone.value,
    contactInitials: contactInitials,
    contactColor: contactColor,
  };

  contacts.push(contact);
  await storeContacts();
  closeAddContact();
  showSnackbar("Contact successfully created");
  displayContacts();
  displayContactDetails(contacts.indexOf(contact));
  toggleActiveContact(contacts.indexOf(contact));
  document.getElementById(`contact${contacts.indexOf(contact)}`).scrollIntoView(); // scroll to actual selected contact
}

async function editContact(i) {
  contacts[i].contactName = document.getElementById("name-input-edit").value;
  contacts[i].contactMail = document.getElementById("mail-input-edit").value;
  contacts[i].contactPhone = document.getElementById("phonenumber-input-edit").value;
  await storeContacts();
  closeEditContact();
  showSnackbar("Contact infos successfully changed");
  displayContactDetails(i);
  displayContacts();
  toggleActiveContact(i);
}

async function deleteContact(i) {
  contacts.splice(i, 1);
  document.getElementById("edit-contact-form").reset();
  await storeContacts();
  closeEditContact();
  showSnackbar("Contact successfully deleted");
  displayContactDetails(i - 1);
  displayContacts();
  toggleActiveContact(i - 1);
}

// function editContactCheckUnique() {
//     let contactMail = document.getElementById('mail-input-edit').value;
//     let contactPhone = document.getElementById('phonenumber-input-edit').value;

//     for (let i = 0; i < contacts.length; i++) {
//         const contact = contacts[i];
//         if(contact.contactMail == contactMail || contact.contactPhone == contactPhone) {
//             console.log("A user with this email-address or phonenumber already exists.");
//         }
//     }
// }

// function addContactCheckUnique() {
//     let contactMail = document.getElementById('mail-input').value;
//     let contactPhone = document.getElementById('phonenumber-input').value;

//     for (let i = 0; i < contacts.length; i++) {
//         const contact = contacts[i];
//         if(contact.contactMail == contactMail || contact.contactPhone == contactPhone) {
//             console.log("A user with this email-address or phonenumber already exists.");
//             return true;
//         }
//     }
// }

async function storeContacts() {
  setItem("remoteContacts", contacts);
}

function createContactInitials(contactName) {
  let contactAsString = contactName.toString();
  let initials = contactAsString.match(/\b(\w)/g).join("");
  let firstTwoInitials = initials.slice(0, 2);
  return firstTwoInitials;
}

function createContactColor() {
  let color = contactColors[generateRandomNumber()];
  return color;
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 15);
}

// open add-contact modal
function openAddContact() {
  let modal = document.getElementById("modal-bg-add");
  modal.style.width = "100%";
  modal.style.left = 0;
  document.getElementById("add-contact-form").reset();
}

function closeAddContact() {
  let modal = document.getElementById("modal-bg-add");
  modal.style.width = 0;
  modal.style.left = "100%";
}

window.addEventListener("click", function (event) {
  let modalBg = document.getElementById("modal-bg-add");
  if (event.target == modalBg) {
    modalBg.style.width = 0;
    modalBg.style.left = "100%";
  }
});

// open edit-contact modal
function openEditContact(i) {
  let modal = document.getElementById("modal-bg-edit");
  modal.style.width = "100%";
  modal.style.left = 0;

  let container = document.getElementById("form-and-image-edit");
  container.innerHTML = /*html*/ `
        <img src="../assets/img/icons/person.png" alt="">
        <form action="" class="add-contact-form" id="edit-contact-form" onsubmit="event.preventDefault(); editContact(${i})">
            <input type="text" name="name" id="name-input-edit" placeholder="Name" value="${contacts[i].contactName}">
            <input type="email" name="email" id="mail-input-edit" placeholder="Email" value="${contacts[i].contactMail}">
            <input type="tel" name="phonenumber" id="phonenumber-input-edit" placeholder="Phone" value="${contacts[i].contactPhone}">
            <div class="cancel-and-create-buttons">
                <button onclick="deleteContact(${i}); event.preventDefault()">Delete</button>   <!-- event.preventDefault() necessary because without it, the onsubmit-functions would be executed -->
                <button type="submit">Save</button>
            </div>
        </form>
    `;
}

function closeEditContact() {
  let modal = document.getElementById("modal-bg-edit");
  modal.style.width = 0;
  modal.style.left = "100%";
}

window.addEventListener("click", function (event) {
  let modalBg = document.getElementById("modal-bg-edit");
  if (event.target == modalBg) {
    modalBg.style.width = 0;
    modalBg.style.left = "100%";
  }
});

// Snackbar / Toastmessage
function showSnackbar(message) {
  let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  snackbar.innerHTML = message;
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

function renderErrorOrAddContact() {
  if (document.getElementById("name-input").value == "") {
    renderError();
  } else {
    addContact();
  }
}

function renderError() {
  document.getElementById("errorContainerContacts").innerHTML = `
    Please add your name. Email and phone are optional.
    `;
}

function removeError() {
  document.getElementById("errorContainerContacts").innerHTML = ``;
}

function checkIfInputHasValue() {
  if (document.getElementById("name-input").value !== "") {
    removeError();
  }
}
