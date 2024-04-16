// Todo: let titles = [];

function initBoardSearch() {}

function renderNotFound() {
  // Vllt einfach in die Mitte vom Main oder unter search.
  let content = document.getElementById("XX");
  content.innerHTML += /*html*/ `
        <h2 style="color: black; text-align: center;">Keine Ergebnisse gefunden.</h2>
    `;
}

function saveInputValue() {
  let search = document.getElementById("searchfield").value;
  search = search.toLowerCase();
  // board leeren
  compareInputAndTitles(search);
}

async function compareInputAndTitles(search) {
  for (let index = 0; index < titles.length; index++) {
    let title = titles[index];
    if (title.toLowerCase().includes(search)) {
      await pushFilteredNames(title);
    }
  }
}

// todos rendern, die der Suche entsprechen

// Search

async function filterNames() {
  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  if (search.length >= 3) {
    emptyMainContainerRemoveButton();
    filteredPokemons = [];
    await searchFilteredPokemons(search);
    if (filteredPokemons.length == 0) {
      renderNotFound();
    } else {
      loadInfoAndrenderFilteredPokemon();
    }
  } else if (search.length === 0) {
    document.getElementById("mainContainer").innerHTML = "";
    firstIndex = -20;
    lastIndex = 0;
    fetchInfoForNext20();
    document.getElementById("sectionButton").classList.remove("d_none");
  }
}

async function searchFilteredPokemons(search) {
  for (let index = 0; index < allPokemonNames.length; index++) {
    const pokemonName = allPokemonNames[index];
    if (pokemonName.toLowerCase().includes(search)) {
      await pushFilteredNames(pokemonName);
    }
  }
}

function emptyMainContainerRemoveButton() {
  document.getElementById("mainContainer").innerHTML = "";
  document.getElementById("sectionButton").classList.add("d_none");
}

async function pushFilteredNames(pokemonName) {
  emptyMainContainerRemoveButton();
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  let response = await fetch(url);
  let filteredPokemonJson = await response.json();
  if (filteredPokemons.length < 10) {
    filteredPokemons.push(filteredPokemonJson);
  }
}

function loadInfoAndrenderFilteredPokemon() {
  for (let i = 0; i < filteredPokemons.length; i++) {
    let name = filteredPokemons[i]["name"];
    let category = filteredPokemons[i]["types"]["0"]["type"]["name"];
    let category2 = seeIfSecondCategory(filteredPokemons[i]);
    let image = filteredPokemons[i]["sprites"]["other"]["official-artwork"]["front_default"];
    let color = getBackgroundColor(category);
    let indexInAllpokemonNames = allPokemonNames.indexOf(name);
    let placeholder = 0;
    document.getElementById("mainContainer").innerHTML += generateMiniCard(indexInAllpokemonNames, color, name, category, image, placeholder, category2);
  }
}

document.getElementById("search").addEventListener("keyup", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(filterNames, doneTypingInterval);
});
