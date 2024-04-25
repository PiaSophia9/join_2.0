const STORAGE_TOKEN = "39JY5O3SG0HK2DPJ5AWZAZ4NV9422TX3UGN1SNUX";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

async function setItem(key, value) {
  const payload = {key, value, token: STORAGE_TOKEN};
  return fetch(STORAGE_URL, {method: "POST", body: JSON.stringify(payload)}).then((res) => res.json());
  // .then((res) => res.json()) Braucht man das?
}

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
