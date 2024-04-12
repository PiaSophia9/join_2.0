let contacts = [];
const contactColors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];
let sortedStartingLetters = [];

async function initContacts() {
    includeHTML();
    await loadContacts();
    displayContacts();
}

async function loadContacts() {
    try {
        let response = await getItem('remoteContacts');
        contacts = JSON.parse(response);
        console.log(contacts);
    } catch (error) {
        console.log('No contacts stored in database');
    }
}

function displayContacts() {
    let contactsContainer = document.getElementById('all-contacts');
    sortContactsByInitials();

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        contactsContainer.innerHTML += createContactAlphabet(contact);
        for (let j = 0; j < contacts.length; j++) {
            let contactsByLetterContainer = document.getElementById('contacts-by-letter');
            contactsByLetterContainer.innerHTML += /*html*/ `
                <p>${contact.contactName}</p>
            `;
        }
    }
}

function sortContactsByInitials() {
    contacts.sort(function (a, b) {
        if (a.contactName < b.contactName) {
          return -1;
        }
        if (a.contactName > b.contactName) {
          return 1;
        }
        return 0;
    });
    console.log(contacts);
}

function createContactAlphabet(contact) {
    return /*html*/ `
        <h2>${contact.contactName[0]}</h2>
        <div id="contacts-by-letter"></div>
    `;
}

async function addContact() {
    let contactName = document.getElementById('name-input');
    let contactMail = document.getElementById('mail-input');
    let contactPhone = document.getElementById('phonenumber-input');
    let contactInitials = createContactInitials(contactName.value);
    let contactColor = createContactColor();

    let contact = {
        'contactName': contactName.value,
        'contactMail': contactMail.value,
        'contactPhone': contactPhone.value,
        'contactInitials': contactInitials,
        'contactColor': contactColor
    }
    console.log(typeof(contacts));
    contacts.push(contact);
    storeContacts();
    // clear contact form
    // show toast message that contact was successfully created
}

async function storeContacts() {
    setItem('remoteContacts', contacts);
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
    let modal = document.getElementById('modal-bg');
    modal.style.width = '100%';
    modal.style.left = 0;
}

function closeAddContact() {
    let modal = document.getElementById('modal-bg');
    modal.style.width = 0;
    modal.style.left = '100%';
}

window.addEventListener("click", function(event) {
    let modalBg = document.getElementById('modal-bg');
    if(event.target == modalBg) {
        modalBg.style.width = 0;
        modalBg.style.left = '100%';
    }   
})
