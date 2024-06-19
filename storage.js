const BASE_URL = "https://joinremotestorage-1e9f0-default-rtdb.europe-west1.firebasedatabase.app/";

async function onLoadFunc() {}

async function loadData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

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

async function setItemX(key, myArray) {
  changeData(key, myArray);
}

async function getItemX(path) {
  return await loadData(path);
}
