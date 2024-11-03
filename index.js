const searchButton = document.getElementById("search-button");
const randomButton = document.getElementById("random-button");
const pokemonName = document.getElementById("pokemonName");
const pokemonDetails = document.getElementById("pokemonDetails");
const viewFavoriteBtn = document.getElementById("favorite-button");

const apiURL = "https://pokeapi.co/api/v2/pokemon/";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const removeFromFavorites = (pokemonName) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favorites.filter(
    (pokemon) => pokemon !== pokemonName
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

  displayFavorite();
};

const displayFavorite = async () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length > 0) {
    pokemonDetails.innerHTML = "<h3>Your Favorite Pokemon</h3>";
    for (const pokemonName of favorites) {
      const response = await fetch(apiURL + pokemonName);
      const pokemonData = await response.json();
      const pokemonHTML = `
        <div class="favorite-pokemon">
          <img src="${pokemonData.sprites.front_default}" alt="${
        pokemonData.name
      }">
          <p>${
            pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
          }</p>
          <span class="favorite-icon remove-favorite" data-name="${
            pokemonData.name
          }">
          ❤️ 
        </span>
        </div>
      `;
      pokemonDetails.innerHTML += pokemonHTML;
    }

    const removeFavorite = document.querySelectorAll(".remove-favorite");
    console.log(removeFavorite);
    removeFavorite.forEach((button) => {
      button.addEventListener("click", (event) => {
        const pokemonName = event.target.dataset.name;
        removeFromFavorites(pokemonName);
      });
    });
  } else {
    pokemonDetails.innerHTML = "<h3>You dont have any favorite pokemon</h3>";
  }
};

viewFavoriteBtn.addEventListener("click", displayFavorite);

const displayPokemonData = (pokemon) => {
  pokemonDetails.innerHTML = "";
  const regularImg = pokemon.sprites.front_default;
  const shinyImg = pokemon.sprites.front_shiny;
  let isShiny = false;

  const isFavorited = favorites.includes(pokemon.name);

  const pokemonHTML = `
    <div class="pokemon-image-container">
      <img id="pokemon-image" src="${regularImg}" alt="${pokemon.name}">
      <span id="favorite-icon" class="favorite-icon">
        ${isFavorited ? "❤️" : "🤍"}
      </span>
    </div>
    <button id="shiny-toggle" class="shiny-button">Shiny</button>
    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
    <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
    <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
    <p><strong>Type:</strong> ${pokemon.types
      .map((typeInfo) => typeInfo.type.name)
      .join(", ")} </p>
  `;

  pokemonDetails.innerHTML = pokemonHTML;

  const shinyToggle = document.getElementById("shiny-toggle");
  const pokemonImage = document.getElementById("pokemon-image");
  const favoriteIcon = document.getElementById("favorite-icon");

  shinyToggle.addEventListener("click", () => {
    pokemonImage.src = isShiny ? regularImg : shinyImg;
    isShiny = !isShiny;
  });

  favoriteIcon.addEventListener("click", () => {
    toggleFavorite(pokemon.name);
    favoriteIcon.textContent = favorites.includes(pokemon.name) ? "❤️" : "🤍";
  });
};

const toggleFavorite = (pokemonName) => {
  if (favorites.includes(pokemonName)) {
    favorites = favorites.filter((name) => name !== pokemonName);
  } else {
    favorites.push(pokemonName);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const getPokemonData = async (name) => {
  try {
    const response = await fetch(apiURL + name.toLowerCase());
    if (!response.ok) throw new Error("Pokemon not found");

    const pokemonData = await response.json();
    displayPokemonData(pokemonData);
  } catch (error) {
    console.log(error);
    pokemonDetails.innerHTML = "<p>Pokemon not found</p>";
  }
};

const getRandomPokemonData = () => {
  const randomNum = Math.floor(Math.random() * 1025) + 1;
  getPokemonData(randomNum === 1026 ? "1025" : `${randomNum}`);
};

searchButton.addEventListener("click", () => {
  if (pokemonName.value.trim()) {
    getPokemonData(pokemonName.value);
  } else {
    alert("Please enter a Pokemon name");
  }
});

randomButton.addEventListener("click", () => {
  getRandomPokemonData();
});

document.addEventListener("DOMContentLoaded", () => {
  getPokemonData("pikachu");
});