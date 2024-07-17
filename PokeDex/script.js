let currentPokemonId = 2;
let isShiny = false;

const apiURL = (id) => `https://pokeapi.co/api/v2/pokemon/${id}`;
const speciesURL = (id) => `https://pokeapi.co/api/v2/pokemon-species/${id}`;

async function fetchPokemonData(id) {
    try {
        const response = await fetch(apiURL(id));
        const data = await response.json();
        updatePokedex(data);
        await fetchPokemonDescription(data.species.url);
        await fetchEvolutionChain(data.species.url);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

async function fetchPokemonDescription(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const description = data.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
        document.getElementById('pokemon-description').innerText = description.replace(/\n|\f/g, ' ');
    } catch (error) {
        console.error('Error fetching Pokémon description:', error);
    }
}

async function fetchEvolutionChain(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const evolutionChainURL = data.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionChainURL);
        const evolutionData = await evolutionResponse.json();

        updateEvolutions(evolutionData.chain);
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
    }
}

function updatePokedex(data) {
    const imageUrl = isShiny ? data.sprites.front_shiny : data.sprites.front_default;
    document.getElementById('pokemon-img').src = imageUrl;
    document.getElementById('pokemon-name').innerText = data.name;
    document.getElementById('pokemon-number').innerText = `No. ${data.id}`;
    document.getElementById('hp').innerText = data.stats[0].base_stat;
    document.getElementById('attack').innerText = data.stats[1].base_stat;
    document.getElementById('defense').innerText = data.stats[2].base_stat;
    document.getElementById('special-attack').innerText = data.stats[3].base_stat;
    document.getElementById('special-defense').innerText = data.stats[4].base_stat;
    document.getElementById('speed').innerText = data.stats[5].base_stat;
    document.getElementById('type1').innerText = data.types[0].type.name.toUpperCase();
    document.getElementById('type2').innerText = data.types[1] ? data.types[1].type.name.toUpperCase() : '';
}

function updateEvolutions(chain) {
    const evolutions = [];

    let currentStage = chain;
    while (currentStage) {
        evolutions.push({
            name: currentStage.species.name,
            url: currentStage.species.url.replace('pokemon-species', 'pokemon')
        });
        currentStage = currentStage.evolves_to[0];
    }

    const evolutionStages = ['evolution1', 'evolution2', 'evolution3'];
    evolutionStages.forEach((stage, index) => {
        if (evolutions[index]) {
            const id = evolutions[index].url.split('/').filter(Boolean).pop();
            document.getElementById(stage).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
            document.getElementById(`${stage}-name`).innerText = evolutions[index].name;
        } else {
            document.getElementById(stage).src = '';
            document.getElementById(`${stage}-name`).innerText = '';
        }
    });
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentPokemonId++;
    fetchPokemonData(currentPokemonId);
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPokemonId > 1) {
        currentPokemonId--;
        fetchPokemonData(currentPokemonId);
    }
});

document.getElementById('pokemon-id-input').addEventListener('change', (e) => {
    const id = parseInt(e.target.value);
    if (!isNaN(id) && id > 0) {
        currentPokemonId = id;
        fetchPokemonData(id);
    }
});

document.getElementById('shiny-btn').addEventListener('click', () => {
    isShiny = !isShiny;
    fetchPokemonData(currentPokemonId);
});

fetchPokemonData(currentPokemonId);
