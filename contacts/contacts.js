let contacts = [];
let contactColors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

async function loadContacts() {
    try {
        let response = await getItem('remoteContacts');
        contacts = JSON.parse(response);
        console.log(contacts);
    } catch (error) {
        console.log('No contacts stored in database');
    }
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
