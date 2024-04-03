const STORAGE_TOKEN = "HIER DEIN TOKEN EINFÜGEN"; // Todo: Token einfügen
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

async function setItem(key, value) {
  const payload = {key, value, token: STORAGE_TOKEN};
  return fetch(STORAGE_URL, {method: "POST", body: JSON.stringify(payload)}).then((res) => res.json());
}

async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url).then((res) => res.json());
}

// Hinweis aus dem Video: eine direkte "delete" Funktion gibt es nicht, von daher kannst du deine Daten nur "leeren". Die Lösung ist hier somit ein leeres Array hoch zu laden.
