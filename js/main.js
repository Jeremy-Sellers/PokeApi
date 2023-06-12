let team = [];

document.getElementById('generate-btn').addEventListener('click', function() { // send GET request for pokemon with a limit at 151 when clicking generate pokemon button
  fetch('https://pokeapi.co/api/v2/pokemon?limit=151') // returns a dataset up to 151
    .then(response => response.json())
    .then(data => {
      let pokemonList = document.getElementById('pokemon-list'); // references html with id
      pokemonList.innerHTML = '';     //Points to pokemon-list and sets it to empty
      data.results.forEach(pokemon => {   //for each pokemon an li will be generated with the pokemons name
        let listItem = document.createElement('li'); // creates a new element to place in list
        listItem.textContent = pokemon.name; // assigns name as content to li
        listItem.className = 'list-group-item';


        listItem.addEventListener('click', function() {
          fetch('https://pokeapi.co/api/v2/pokemon/' + pokemon.name) // for each li, when clicked, sends a fetch request using name from li
            .then(response => response.json())
            .then(data => {
              document.getElementById('pokemon-image').src = data.sprites.front_default; //sets src for image to sprite from data
              document.getElementById('pokemon-type').textContent = 'Type: ' + data.types.map(typeInfo => typeInfo.type.name).join(", ");  //assigns typing
              let pokedexNumber = document.getElementById('pokedex-number'); // assigns pokedex number
              pokedexNumber.textContent = 'Pokedex Number: ' + data.id;

              document.getElementById('stat-hp').style.width = (data.stats[0].base_stat / 255) * 100 + '%'; //set bars width and description of stat
              document.getElementById('stat-hp').innerText = data.stats[0].base_stat;

              document.getElementById('stat-attack').style.width = (data.stats[1].base_stat / 255) * 100 + '%';
              document.getElementById('stat-attack').innerText = data.stats[1].base_stat;

              document.getElementById('stat-defense').style.width = (data.stats[2].base_stat / 255) * 100 + '%';
              document.getElementById('stat-defense').innerText = data.stats[2].base_stat;

              document.getElementById('stat-speed').style.width = (data.stats[5].base_stat / 255) * 100 + '%';
              document.getElementById('stat-speed').innerText = data.stats[5].base_stat;


              //Set background of card to chosen pokemons color
              fetch('https://pokeapi.co/api/v2/pokemon-species/' + data.id) // fetch to different endpoint using data returned from first call using the id of pokemon
                .then(response => response.json())
                .then(speciesData => {
                  console.log(speciesData.color.name)
                  let card = document.getElementById('pokemon-card'); // query for card element

                  // map PokeAPI color names to CSS colors
                  let colorMap = {
                    'black': '#000000',
                    'blue': '#0000FF',
                    'brown': '#A52A2A',
                    'gray': '#808080',
                    'green': '#008000',
                    'pink': '#FFC0CB',
                    'purple': '#800080',
                    'red': '#FF0000',
                    'white': '#FFFFFF',
                    'yellow': '#FFFF00',
                  };

                  // use the mapped color if it exists, or default to '#FFFFFF'
                  let cssColor = colorMap[speciesData.color.name] || '#FFFFFF';

                  card.style.backgroundColor = cssColor;
                })
                .catch(error => console.error(error));
              //Set background of card to chosen pokemons color

              //Adds pokemon to array for team when clicked
              document.getElementById('add-to-team-btn').onclick = function() {
                if (team.length < 6) {
                  team.push({
                    name: data.name,
                    image: data.sprites.front_default
                  });
                  displayTeam();
                } else {
                  alert("Your team is already full!");
                }
              };
            })
            .catch(error => console.error(error));
        });
        pokemonList.appendChild(listItem);
      });
    })
    .catch(error => console.error(error));
});

function displayTeam() {
  let teamDiv = document.getElementById('team');
  teamDiv.innerHTML = '';
  team.forEach((member, index) => {
    let teamMemberDiv = document.createElement('div');
    teamMemberDiv.className = 'team-member';
    teamMemberDiv.dataset.index = index;

    let image = document.createElement('img');
    image.src = member.image;

    let nameDiv = document.createElement('div');
    nameDiv.className = 'team-member-name';
    nameDiv.textContent = member.name;

    teamMemberDiv.appendChild(image);
    teamMemberDiv.appendChild(nameDiv);
    teamDiv.appendChild(teamMemberDiv);

    // Add click listener to show the confirm deletion modal
    teamMemberDiv.addEventListener('click', function() {
      $('#confirmDeleteModal').modal('show');
      // Save the index of the team member to be deleted in the confirm button
      document.getElementById('confirmDeleteBtn').dataset.index = this.dataset.index;
    });
  });
}

document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
  // Remove the member from the team using the index stored in the data attribute
  team.splice(this.dataset.index, 1);
  // Redisplay the team
  displayTeam();
  // Hide the modal
  $('#confirmDeleteModal').modal('hide');
});






