class App {
  constructor() {
    this.types = [];
    this.displayTypes = [];
    this.randomPokemon = [];
    this.team = [];
    this.sprites = [];
    this.pokemonTypes = [...document.querySelectorAll('.pokemon-type')]
    this.selected = document.querySelector('.selected')
    this.selectedTypes = document.querySelector('.selected-types')
    this.hereIsYourTeam = document.querySelector('.team-displayed')
    this.card = document.querySelector('.card-content')
    this.image = document.querySelector('.image')
    this.generate = document.querySelector('#generate-team')
    this.startOver = document.querySelector('#start-over')

    this.getTypes();
    this.removeType();
    this.addEventListener();
    this.reset();
  }
  
  // Grabs the ID, and Name from the type buttons
  getTypes() {
    this.pokemonTypes.forEach(button => 
      button.addEventListener('click', event => {
        if(this.types.length <= 5) {
          this.displayTypes.push(event.target.innerHTML.toUpperCase())  
          this.types.push(event.target.id)
          this.selected.classList.remove('hidden')
          this.displaySelectedTypes(this.displayTypes, this.types); 
        } 
      })
      );    
    }
    
    // removes and updates the ID and Type from this.types, and this.displayTypes
    removeType(index) {
      console.log(index)
      let updatedTypes = [...this.displayTypes]
      updatedTypes.splice(index, 1)
      let updatedId = [...this.types]
      updatedId.splice(index, 1)
      this.displayTypes = updatedTypes
      this.types = updatedId
      this.types.length === 0 && this.selected.classList.add('hidden');
      this.displaySelectedTypes()
    }
    
    // displays our selected types
    displaySelectedTypes(data = this.displayTypes, id = this.types) {
      const html = data.flatMap((pokemon, i) =>
      `<span class="types tags type-${id[i]}" datatest-id="homepage-selected-types-tags-${i}">
        ${data[i]}
        <img src="./images/delete.svg" class="remove" role="button" name="${ data[i]}" id="${id[i]}" data-index=${i}
        datatest-id="homepage-remove-type-button="${data[i]}">
      </span>
      `).join("");
      this.selectedTypes.innerHTML = html
    }
    
    // attached to our displaySelectedTypes img
    addEventListener() {
      this.selectedTypes.addEventListener('click', (e) => {
        if(e.target.classList.contains('remove')) {
          this.removeType(e.target.dataset.index)
        }
      })
      this.startOver.addEventListener('click', () => {
        this.reset();
        this.selected.classList.add('hidden');
        this.hereIsYourTeam.classList.add('hidden');
      });
    }
    
    // fetches our pokemon data using our ID from our type
    // creates a random number within the length of the returned array (all pokemon that share the type)
    // then takes that random number and applies it to the length of it's array to find a single pokemon
    async getPokemonByType(type) {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`) 
      const getPokemon = await response.json();
      const pokemon = getPokemon.pokemon;
      const num = this.generateRandomNum(pokemon.length);
      this.randomPokemon = pokemon[num]
      this.getSprite(this.randomPokemon, this.types)
      return pokemon;
    }
    
    // pure function that returns a random number 
    // the number is used after our fetch call to determine the random pokemon
    generateRandomNum(max) {
      let num = Math.floor(Math.random() * max - 1);
      return num
    }
    
    // this takes our this.types array and runs each number through our fetch call
    generateTeam() {
      const team = this.generate.addEventListener('click', () => {
        const test = this.types.map(type => this.getPokemonByType(type))
        this.hereIsYourTeam.classList.remove('hidden');
        this.generate.disabled = true;
      })
    }
    
    //displays the name and sprite image for each pokemon on the team
    async getSprite(team, id) {
      console.log("team", team)
      console.log(this.randomPokemon)
      console.log('id', id)
      const url = team.pokemon.url
      const response = await fetch(url);
      const data = await response.json();
      let shinySprite;
      if(data.sprites && data.sprites.front_shiny) {
        shinySprite = data.sprites.front_shiny
      } else {
        shinySprite = 'https://i.pinimg.com/originals/95/d5/cd/95d5cded00f3a3e8a98fb1eed568aa9f.png'
      }
      this.sprites.push(shinySprite);
      this.team.push(data.name.toUpperCase())
      const html = this.team.map((pokemon,i) => 
      `<div class="cards">
      <div class="card type-${id[i]}">
      <h3 datatest-id="homepage-generated-pokemon-name-${i}">${this.team[i]}</h3>
      <img src="${this.sprites[i] ? this.sprites[i] : 'https://i.pinimg.com/originals/95/d5/cd/95d5cded00f3a3e8a98fb1eed568aa9f.png'}"
      datatest-id="homepage-generated-pokemon-sprite-${i}">
      </div>
      </div>
      `).join("");
      this.card.innerHTML = html
    }
    
    reset() {
      this.card.innerHTML = "";
      this.selectedTypes.innerHTML = "";
      this.types = [];
      this.displayTypes = [];
      this.randomPokemon = [];
      this.team = [];
      this.sprites = [];
      this.generate.disabled = false;
    }
  }
  
  
  const app = new App();
  app.generateTeam();
  