let contacts = [];
const contactColors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];
let sortedStartingLetters = [];
let uniqueStartingLetters = [];


async function initContacts() {
    includeHTML();
    await loadContacts();
    displayContacts();
}


async function loadContacts() {
    try {
        let response = await getItem('remoteContacts');
        contacts = JSON.parse(response);
    } catch (error) {
        console.log('No contacts stored in database');
    }
}


function displayContacts() {
    let contactsContainer = document.getElementById('all-contacts');
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
            let contactsAtLetterContainer = document.getElementById(`contacts-at-letter${startingLetter}`)
            if(contact.contactName[0] == startingLetter) {
                contactsAtLetterContainer.innerHTML += /*html*/ `
                    <div class="contact" id="contact${i}" onclick="displayContactDetails(${i}); toggleActiveContact(${i})">
                        <div style="background-color: ${contact.contactColor}" class="initials_circle initials_circle_small"><span class="initials_span">${contact.contactInitials}</span></div>
                        <div class="name-and-mail">
                            <span id="contact-name${i}">${contact.contactName}</span>
                            <span class="contact-mail">${contact.contactMail}</span>
                        </div>
                    </div>
                `;
                break;  // if contact matches the starting letter, jump back to first for-loop
            }
        }
    } 
}


function toggleActiveContact(i) {
    let selectedContact = document.getElementById(`contact${i}`);
    let allContacts = document.querySelectorAll('.contact');

    allContacts.forEach(e => {e.classList.remove('contact-selected')});
    selectedContact.classList.add('contact-selected');
}


function displayContactDetails(i) {
    let contactContainer = document.getElementById('contact-container');
    let contact = contacts[i];
    let contactInformation = document.getElementById('contact-information');

    contactContainer.innerHTML = /*html*/ `
        <div style="background-color: ${contact.contactColor}" class="initials_circle"><span class="initials_span">${contact.contactInitials}</span></div>
        <div class="name-and-edit">
            <div class="name_container">
                <span class="contact_name">${contact.contactName}</span>
            </div>
            <div class="edit_delete_container">
                <button class="edit-button" onclick="editContact(${i})">Edit</button>
                <button class="edit-button" onclick="deleteContact(${i})">Delete</button>
            </div>
        </div>
    `;

    contactInformation.innerHTML = /*html*/ `
        <p>Contact Information</p>
        <h4>Email</h4>
        <a href="mailto: ${contact.contactMail}">${contact.contactMail}</a>
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
        sortedStartingLetters.push(contacts[i].contactName[0]);
    }
    uniqueStartingLetters = [...new Set(sortedStartingLetters)];
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
    contacts.push(contact);
    storeContacts();
    // clear contact form
    // show toast message that contact was successfully created
}


async function editContact(i) {

}


async function deleteContact(i) {

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
