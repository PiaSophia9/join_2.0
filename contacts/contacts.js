let contacts = [];

async function loadContacts() {
    contacts = await getItem('remoteContacts');
    console.log(contacts);
}

async function storeContacts() {

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
