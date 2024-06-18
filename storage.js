const BASE_URL = "https://joinremotestorage-1e9f0-default-rtdb.europe-west1.firebasedatabase.app/";

let usersX = [];
let tasksX = [];
let contactsX = [];

async function onLoadFunc() {
  // console.log(loadData());
  postData("/remoteTasks", {
    assignedTo: [{contactName: "Sophia Brouwers", contactMail: "sophia.brouwers@gmx.de", contactPhone: "016093891503", contactInitials: "SB", contactColor: "#FF5EB3"}],
    category: "Technical Task",
    description: "Implement user authentication functionality to allow users to sign up, log in, and log out of the application.",
    dueDate: "2024-05-15",
    priority: "urgent",
    status: "in-progress",
    subtasks: [
      {nameSubtask: "Design user registration form.", statusSubtask: "inProgress"},
      {nameSubtask: "Design log in form.", statusSubtask: "inProgress"},
      {nameSubtask: "Make User check privacy policy.", statusSubtask: "inProgress"},
    ],
    title: "Implement User Authentication",
  });
  // postData("/remoteContacts", {contactColor: "#FFA35E", contactMail: "Reiner@gmx.de", contactInitials: "RB", contactName: "Reiner Brouwers", contactPhone: "1234"});
  // postData("/remoteUsers", {userColor: "#FFA35E", userEmail: "Sophia@gmx.de", userInitials: "SB", userName: "Sophia Brouwers", userPassword: "1234"});
  // deleteData("/remoteContacts");
  // changeData((path = "/-O-fFY49ztYYVmJmasvd/userColor"), (data = "pink"));
  // await loadUsersX();
  // await loadTasksX();
  // await loadContactsX();
}

async function loadUsersX() {
  let userResponse = await loadData("/remoteUsers");
  let remoteUsersKeysArray = Object.keys(userResponse);
  for (let i = 0; i < remoteUsersKeysArray.length; i++) {
    usersX.push({
      id: remoteUsersKeysArray[i],
      user: userResponse[remoteUsersKeysArray[i]],
    });
  }
  console.log(usersX);
}

async function loadTasksX() {
  let taskResponse = await loadData("/remoteTasks");
  let remoteTasksKeysArray = Object.keys(taskResponse);
  for (let i = 0; i < remoteTasksKeysArray.length; i++) {
    tasksX.push({
      id: remoteTasksKeysArray[i],
      task: taskResponse[remoteTasksKeysArray[i]],
    });
  }
}

async function loadContactsX() {
  let contactResponse = await loadData("/remoteContacts");
  let remoteContactsKeysArray = Object.keys(contactResponse);
  for (let i = 0; i < remoteContactsKeysArray.length; i++) {
    contactsX.push({
      id: remoteContactsKeysArray[i],
      user: contactResponse[remoteContactsKeysArray[i]],
    });
  }
}

// DATEN ERHALTEN:
async function loadData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  // Mit ".json" wird ausgelsen, was in dem Link steht.
  // let responseToJson = await response.json();
  return (responseToJson = await response.json());
  // console.log(responseToJson);
}

// DATEN SENDEN:
async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

// DATEN AKTUALISIEREN:
async function changeData(path, data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

// DATEN LOESCHEN - das ging bei dem Storage auf dem DA-Server nicht.
async function deleteData(path) {
  // async function deleteData(path = "") { Vorsicht! Wenn man hier einen leeren path eingibt löscht man direkt alles.
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

// ________________________________________Alter Code:

const STORAGE_TOKEN = "LYQNFJIFCQJ79MVOFIRYR7I6TFORA8AMGOE6NPXH";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Sets an item in the storage with the given key and value.
 *
 * @param {string} key - The key of the item to be set.
 * @param {any} value - The value of the item to be set.
 * @return {Promise<any>} A promise that resolves to the response from the server.
 */
async function setItem(key, value) {
  const payload = {key, value, token: STORAGE_TOKEN};
  return fetch(STORAGE_URL, {method: "POST", body: JSON.stringify(payload)}).then((res) => res.json());
}

/**
 * Retrieves an item from the storage with the given key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @return {Promise<any>} A promise that resolves to the value of the item, or throws an error if the item is not found.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}
