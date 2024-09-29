const searchButton = document.getElementById("search-button");
const pokemonName = document.getElementById("pokemonName");
const pokemonDetails = document.getElementById("pokemonDetails");

const apiURL = "https://pokeapi.co/api/v2/pokemon/";

const displayPokemonData = (pokemon) => {
const pokemonHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
    <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
    <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
    <p><strong>Type:</strong> ${pokemon.types
      .map((typeInfo) => typeInfo.type.name)
      .join(", ")} </p>
    `;

  pokemonDetails.innerHTML = pokemonHTML;
};

const getPokemonData = async (name) => {
  try {
    const response = await fetch(apiURL + name.toLowerCase());
    if (!response.ok) {
      throw new Error("Pokemon Not Found");
    }
    const pokemonData = await response.json();
    displayPokemonData(pokemonData);
  } catch (error) {
    console.log(error);
  }
};

searchButton.addEventListener("click", () => {
  getPokemonData(pokemonName.value);
});
