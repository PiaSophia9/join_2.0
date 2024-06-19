const BASE_URL = "https://joinremotestorage-1e9f0-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Asynchronously loads data from the specified path by making a GET request to the server.
 *
 * @param {string} path - The path to the data on the server.
 * @return {Promise<Object>} A Promise that resolves to the parsed JSON response from the server.
 */
async function loadData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Asynchronously changes data on the server by making a PUT request.
 *
 * @param {string} path - The path to the data on the server.
 * @param {Object} data - The data to be changed.
 * @return {Promise<Object>} A Promise that resolves to the parsed JSON response from the server.
 */
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

/**
 * Sets an item in the database with the specified key and array data.
 *
 * @param {string} key - The key to identify the item.
 * @param {Array} myArray - The array data to be set.
 * @return {Promise<Object>} A Promise that resolves to the parsed JSON response from the server.
 */
async function setItem(key, myArray) {
  changeData(key, myArray);
}

/**
 * Asynchronously retrieves data from the server by making a GET request to the specified path.
 *
 * @param {string} path - The path to the data on the server.
 * @return {Promise<Object>} A Promise that resolves to the parsed JSON response from the server.
 */
async function getItem(path) {
  return await loadData(path);
}
