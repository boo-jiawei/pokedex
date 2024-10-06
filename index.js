const searchButton = document.getElementById("search-button");
const randomButton = document.getElementById("random-button");
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

const displayEvolutionChain = (evolutionStages) => {
  let evolutionHTML = `<h3 class="evolution-title">Evolution Chain</h3><div class="evolution-container">`;

  evolutionStages.forEach((stage) => {
    evolutionHTML += `
      <div class="evolution-stage">
        <img src="${stage.image}" alt="${stage.name}">
        <p>${stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}</p>
      </div>
    `;
  });

  evolutionHTML += `</div>`

  pokemonDetails.innerHTML += evolutionHTML;
};

const getAllEvolutionStages = async (evolutionChain) => {
  let stages = [];
  let currentEvolution = evolutionChain;

  while (currentEvolution) {
    const pokemonName = currentEvolution.species.name;

    const response = await fetch(apiURL + pokemonName);
    const evolutionData = await response.json();

    stages.push({
      name: pokemonName,
      image: evolutionData.sprites.front_default,
    });

    if (currentEvolution.evolves_to.length > 0) {
      currentEvolution = currentEvolution.evolves_to[0];
    } else {
      currentEvolution = null;
    }
  }

  return stages; // Return array of all evolution stages with name and image
};

const getPokemonData = async (name) => {
  try {
    const response = await fetch(apiURL + name.toLowerCase());
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }
    const pokemonData = await response.json();
    displayPokemonData(pokemonData);

    const speciesUrl = pokemonData.species.url;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();

    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();

    const evolutionStages = await getAllEvolutionStages(evolutionData.chain);

    displayEvolutionChain(evolutionStages);
  } catch (error) {
    console.log(error);
  }
};

const getRandomPokemonData = () => {
  const randomNum = Math.floor(Math.random() * 1025) + 1;
  getPokemonData(randomNum === 1026 ? "1025" : `${randomNum}`);
};

searchButton.addEventListener("click", () => {
  getPokemonData(pokemonName.value);
});

randomButton.addEventListener("click", () => {
  getRandomPokemonData();
});

document.addEventListener("DOMContentLoaded", () => {
  getPokemonData("pikachu");
});