class App {
  constructor() {
    this.types = [];
    this.displayTypes = [];
    this.randomPokemon = [];
    this.team = [];
    this.sprites = [];
    this.pokemonTypes = [...document.querySelectorAll('.pokemon-type')]
    this.selectedTypes = document.querySelector('.selected-types')
    this.card = document.querySelector('.cards')
    this.image = document.querySelector('.image')
    this.generate = document.querySelector('#generate-team')

    this.removeType();
    this.addEventListener();
  }

// displays our selected types
displaySelectedTypes(data = this.displayTypes, id = this.types) {
  const html = data.map((pokemon,i) => 
    `<span> ${data[i]}</span>
     <img src="./images/delete.svg" class="remove" role="button" name="${ data[i]}" id="${id[i]}"></button>
     `)
  this.selectedTypes.innerHTML = html
}

 // Grabs the ID, and Name from the type buttons
 getTypes() {
  this.pokemonTypes.forEach(button => 
    button.addEventListener('click', event => {
      if(this.types.length <= 6 - 1) {
        this.displayTypes.push(event.target.innerHTML.toUpperCase())  
        this.types.push(event.target.id)
        this.displaySelectedTypes(this.displayTypes, this.types); 
      } 
    }));    
}

// removes and updates the ID and Type from this.types, and this.displayTypes
removeType(name, id) {
  const updatedTypes = this.displayTypes.filter(type => type !== name)
  const updatedId = this.types.filter(type => type !== id) 
  this.displayTypes = updatedTypes
  this.displaySelectedTypes(updatedTypes)
  this.types = updatedId
}
// attached to our displaySelectedTypes img
  addEventListener() {
    this.selectedTypes.addEventListener('click', (e) => {
      if(e.target.classList.contains('remove')) {
        this.removeType(e.target.name, e.target.id)
      }
    })
  }

// fetches our pokemon data using our ID from our type
// creates a random number within the length of the returned array (all pokemon that share the type)
// then takes that random number and applies it to the length of it's array to find a single pokemon
  async getPokemonByType(type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`) 
    const getPokemon = await response.json();
    const pokemon = getPokemon.pokemon;
    const num = this.generateRandomNum(pokemon.length);
    const team = pokemon[num];
    this.getSprite(team)
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
    })
  }

  //displays the name and sprite image for each pokemon on the team
  async getSprite(team) {
    const url = team.pokemon.url

    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    const getSprite = data.sprites.front_shiny
    this.team.push(data.name.toUpperCase())
    this.sprites.push(getSprite)
    console.log("sprite", getSprite)
    const html = this.team.map((pokemon,i) => 
      `<div>
        <h3>${this.team[i]}</h3>
        <img src="${this?.sprites[i]}">
      </div>
      `)
    this.card.innerHTML = html
  }

}


const app = new App();
app.getTypes();
app.generateTeam();
