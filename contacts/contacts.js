let contacts = [];
let tasks = [];
const contactColors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];
let sortedStartingLetters = [];
let uniqueStartingLetters = [];

async function initContacts() {
  includeHTML();
  await loadContacts();
  await loadAllTasksContacts();
  loadUserInitials();
  displayContacts();
  unlogAllSidebarLinks();
  logSidebarLink("contactSidebar");
}

async function loadContacts() {
  try {
    let response = await getItem("remoteContacts");
    contacts = JSON.parse(response);
  } catch (error) {
    console.log("No contacts stored in database");
  }
}

async function loadAllTasksContacts() {
  let response = await getItem("remoteTasks");
  tasks = await JSON.parse(response);
}

function displayContacts() {
  let contactsContainer = document.getElementById("all-contacts");
  contactsContainer.innerHTML = "";
  sortContactsByName();
  createStartingLetters();
  displayStartingLetters(contactsContainer);
  renderContactUnderStartingLetter();
}

function displayStartingLetters(contactsContainer) {
  for (let i = 0; i < uniqueStartingLetters.length; i++) {
    let letter = uniqueStartingLetters[i];
    contactsContainer.innerHTML += /*html*/ `
            <h3 class="starting-letter">${letter.toUpperCase()}</h3>
            <div class="contacts-at-letter" id="contacts-at-letter${letter}"></div>
        `;
  }
}

function renderContactUnderStartingLetter() {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    for (let j = 0; j < uniqueStartingLetters.length; j++) {
      let startingLetter = uniqueStartingLetters[j];
      let contactsAtLetterContainer = document.getElementById(`contacts-at-letter${startingLetter}`);
      if (contact.contactName[0] == startingLetter) {
        contactsAtLetterContainer.innerHTML += generateContactUnderStartingLetter(contact, i);
        break;
      }
    }
  }
}

function generateContactUnderStartingLetter(contact, i) {
  return `
    <div class="contact" id="contact${i}" onclick="displayContactDetails(${i}); toggleActiveContact(${i})">
        <div style="background-color: ${contact.contactColor}" class="initials_circle initials_circle_small"><span class="initials_span">${contact.contactInitials}</span></div>
        <div class="name-and-mail">
            <span class="contact_name_left_section" id="contact-name${i}">${contact.contactName}</span>
            <span class="contact-mail">${contact.contactMail}</span>
        </div>
    </div>
 `;
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
        <div style="background-color: ${contact.contactColor}" class="initials_circle initials_circle_overview"><span class="initials_span">${contact.contactInitials}</span></div>
        <div class="name-and-edit">
            <div class="name_container">
                <span class="contact_name">${contact.contactName}</span>
            </div>
            <div class="edit_delete_container">

                <button class="edit-button" onclick="openEditContact(${i})" onmouseover="turnBlue('penContacts', 'edit_blue.svg')" onmouseleave="turnBlack('penContacts', 'edit.svg')">
                  <img id="penContacts" class="penContacts" src="../assets/img/icons/edit.svg" alt="">
                  Edit
                </button>
                <button class="edit-button" onclick="deleteContactInOverview(${i})" onmouseover="turnBlue('trashContacts', 'delete_blue.svg')" onmouseleave="turnBlack('trashContacts', 'delete.svg')">
                  <img id="trashContacts" src="../assets/img/icons/delete.svg" alt="">
                  Delete
                </button>
            </div>
        </div>
        <div id="editDeleteButtonContainer" class="edit_delete_button_container d_none">
          <button class="edit_mobile_button" type="button" onclick="openEditContact(${i})">Edit</button>
          <button class="delete_mobile_button" type="button" onclick="deleteContactInOverview(${i})">Delete</button>
        </div>
    `;

  contactInformation.innerHTML = /*html*/ `
        <p>Contact Information</p>
        <h4>Email</h4>
        <a class="contact-email" href="mailto: ${contact.contactMail}">${contact.contactMail}</a>
        <h4>Phone</h4>
        <span>${contact.contactPhone}</span>
    `;
  if (window.innerWidth < 900) {
    document.getElementById("leftSection").classList.add("d_none");
    document.getElementById("rightSection").classList.add("d_block");
    document.getElementById("backButtonContacts").classList.remove("d_none");
    document.getElementById("personButtonContacts").classList.add("d_none");
    document.getElementById("threeDotsButtonContacts").classList.remove("d_none");
  }
}

function showLeftSection() {
  document.getElementById("leftSection").classList.remove("d_none");
  document.getElementById("rightSection").classList.remove("d_block");
  document.getElementById("backButtonContacts").classList.add("d_none");
  document.getElementById("personButtonContacts").classList.remove("d_none");
  document.getElementById("threeDotsButtonContacts").classList.add("d_none");
}

function openEditDeleteMenu() {
  document.getElementById("editDeleteButtonContainer").classList.remove("d_none");
  event.stopPropagation();
}

function turnBlue(imageID, sourceSnippet) {
  document.getElementById(`${imageID}`).src = `../assets/img/icons/${sourceSnippet}`;
}

function turnBlack(imageID, sourceSnippet) {
  document.getElementById(`${imageID}`).src = `../assets/img/icons/${sourceSnippet}`;
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
  document.getElementById(`contact${contacts.indexOf(contact)}`).scrollIntoView();
}

async function editContact(i) {
  if (document.getElementById("name-input-edit").value == "") {
    renderError("errorContainerEditContacts");
  } else {
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
}

async function deleteContact(i) {
  await deleteContactFromTasks(i);
  contacts.splice(i, 1);
  document.getElementById("edit-contact-form").reset();
  await storeContacts();
  closeEditContact();
  showSnackbar("Contact successfully deleted");
  if (i == 0) {
    displayContactDetails(i);
    displayContacts();
    toggleActiveContact(i);
  } else {
    displayContactDetails(i - 1);
    displayContacts();
    toggleActiveContact(i - 1);
  }
}

async function deleteContactFromTasks(i) {
  await loadAllTasksContacts();
  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    if (task.assignedTo.length != 0) {
      await checkIfContactAssigned(task, i);
    }
  }
}

async function checkIfContactAssigned(task, i) {
  for (let j = 0; j < task.assignedTo.length; j++) {
    const assignedContact = task.assignedTo[j];
    if (assignedContact.contactName == contacts[i].contactName) {
      let contactIndex = task.assignedTo.indexOf(assignedContact);
      task.assignedTo.splice(contactIndex, 1);
      await storeAllTasksContacts();
      initContacts();
    }
  }
}

async function storeAllTasksContacts() {
  await setItem("remoteTasks", tasks);
}

async function deleteContactInOverview(i) {
  await deleteContactFromTasks(i);
  contacts.splice(i, 1);
  await storeContacts();
  showSnackbar("Contact successfully deleted");
  if (i == 0) {
    displayContactDetails(i);
    displayContacts();
    toggleActiveContact(i);
  } else {
    displayContactDetails(i - 1);
    displayContacts();
    toggleActiveContact(i - 1);
  }
}

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

function openEditContact(i) {
  setModalSizeAndPosition();
  generateModalContent(i);
}

function setModalSizeAndPosition() {
  let modal = document.getElementById("modal-bg-edit");
  modal.style.width = "100%";
  modal.style.left = 0;
}

function generateModalContent(i) {
  let container = document.getElementById("form-and-image-edit");
  container.innerHTML = /*html*/ `
          <div style="background-color: ${contacts[i].contactColor}" class="initials_circle initials_circle_big margin_right inicials_circle_edit_contact_mobile"><span class="initials_span">${contacts[i].contactInitials}</span></div>
          <div class="form_container">
            <form action="" class="add-contact-form" id="edit-contact-form" onsubmit="event.preventDefault(); editContact(${i})">
              <div class="contact_input_container">

                <input  class="newContactName" type="text" name="name" id="name-input-edit" placeholder="Name" value="${contacts[i].contactName}" onkeyup="checkIfInputHasValue()">
                <input class="newContactEmail" type="email" name="email" id="mail-input-edit" placeholder="Email" value="${contacts[i].contactMail}">
                <input class="newContactPhone" type="tel" name="phonenumber" id="phonenumber-input-edit" placeholder="Phone" value="${contacts[i].contactPhone}">
              </div>
              <div class="cancel-and-create-buttons">
                <button class="btn_bright" onclick="deleteContact(${i}); event.preventDefault()">Delete
                </button>
                <button class="btn_dark" type="submit">Save
                  <img src="../assets/img/icons/white_check.svg" alt="">
                </button>
              </div>
              <div id="errorContainerEditContacts">
              </div>
            </form>
          </div>

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

function showSnackbar(message) {
  let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  snackbar.innerHTML = message;
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

function renderErrorOrAddContact(id) {
  if (document.getElementById("name-input").value == "") {
    renderError(id);
  } else {
    addContact();
  }
}
function renderError(id) {
  document.getElementById(id).innerHTML = `
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
