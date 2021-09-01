class App {
  constructor() {
    this.types = [];
    this.displayTypes = [];
    this.randomPokemon = {};
    this.team = [];
    this.sprites = [];
    this.generatedDisplayedTypes = [];
    this.returnedPokemonArray = [];
    this.pokemonToDisplay;
    this.arrayOfNums = [];
    this.pokemonTypes = [...document.querySelectorAll('.pokemon-type')];
    this.selected = document.querySelector('.selected');
    this.selectedTypes = document.querySelector('.selected-types');
    this.hereIsYourTeam = document.querySelector('.team-displayed');
    this.card = document.querySelector('.card-content');
    this.image = document.querySelector('.image');
    this.generate = document.querySelector('#generate-team');
    this.startOver = document.querySelector('#start-over');
    this.randomize = document.querySelector('#randomize');

    this.getTypes();
    this.displaySelectedTypes();
    this.removeType();
    this.useGenerateTeamButton();
    this.useRandomizeButton();
    this.reset();
  }
  
  // Grabs the ID, and Name from the type buttons, then calls our displaySelectedTypes to display them on the page one by one
    getTypes() {
      this.pokemonTypes.forEach(button => 
        button.addEventListener('click', event => {
          if(this.types.length <= 5) {
            this.displayTypes.push(event.target.innerHTML.toUpperCase())  
            this.types.push(event.target.id)
            this.selected.classList.remove('hidden')
            this.displaySelectedTypes()
          }
        })
      );    
    }
    
    // displays our selected types
    displaySelectedTypes() {
      let data = this.displayTypes
      let id = this.types
      this.selectedTypes.innerHTML = data.flatMap((pokemon, i) =>
      `<span class="types tags type-${id[i]}" datatest-id="homepage-selected-types-tags-${i}">
        ${data[i]}
        <img src="./images/delete.svg" class="remove" role="button" name="${ data[i]}" id="${id[i]}" data-index=${i}
        datatest-id="homepage-remove-type-button-${data[i]}">
      </span>
      `).join("");
    }
    
    // removes and updates the ID and Type from this.types, and this.displayTypes
    removeType() {
      this.selectedTypes.addEventListener('click', (event) => {
        if(event.target.classList.contains('remove')) {
          let updatedTypes = [...this.displayTypes]
          updatedTypes.splice(event.target, 1)
          let updatedId = [...this.types]
          updatedId.splice(event, 1)
          this.displayTypes = updatedTypes
          this.types = updatedId
          this.types.length === 0 && this.selected.classList.add('hidden');
          this.displaySelectedTypes()
        }
      })
    }

    // when generate team is clicked, it will map over this.types to get individual types to run through our API.
    // Will also show our subtitle of 'Here is our team'
    // Disabled the generate team button
    useGenerateTeamButton() {
      this.generate.addEventListener('click', () => {
        this.types.map(type =>this.getPokemonArrayByType(type));
        this.hereIsYourTeam.classList.remove('hidden');
        this.generate.disabled = true;
        this.randomize.disabled = true;
        this.pokemonTypes.forEach(button => button.disabled = true);
      })
    }

    useRandomizeButton() {
      this.randomize.addEventListener('click', () => {
        if(this.arrayOfNums <= 5) {
          for(let i = 0; i <= 5; i++) {
            const num = this.generateRandomNum(this.pokemonTypes.length) + 1;
            this.arrayOfNums.push(num)
          }
        } else {
          return;
        }
        this.arrayOfNums.map(type => this.getPokemonArrayByType(type));
        this.randomize.disabled = true;
        this.generate.disabled = true;
        this.pokemonTypes.forEach(button => button.disabled = true);
      })
    }

    // Takes our individual type from when our generate team button is clicked, then runs our fetch call.
    // this returns an array of pokemon that exist with that type
    // we then call our getRandomPokemonToDisplay to get the single pokemon to display on the page
    async getPokemonArrayByType(individualType) {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${individualType}`);
        const data = await response.json();
        this.returnedPokemonArray = data.pokemon;
        this.getRandomPokemonToDisplay();
    }

    // Takes our returnedPokemonArray and runs it through our random number function to get a single Pokemon
    // Then calls our displayOurPokemon function to display on the page.
    getRandomPokemonToDisplay() {
      const num = this.generateRandomNum(this.returnedPokemonArray.length);
      this.randomPokemon = this.returnedPokemonArray[num]
      this.getPokemonInfoToDisplay();
    }

    // Takes our randomPokemon data, uses the URL found within to run another fetch call
    // This returns a single pokemon object that grabs the name, image, and all type data so it can be displayed
    async getPokemonInfoToDisplay() {
      const url = this.randomPokemon.pokemon.url
      const response = await fetch(url);
      const data = await response.json();
      this.pokemonToDisplay = data
      this.generatedDisplayedTypes.push(data.types)
      let shinySprite; 
      if(data.sprites && data.sprites.front_shiny) {
        shinySprite = data.sprites.front_shiny
      } else {
        shinySprite = 'https://i.pinimg.com/originals/95/d5/cd/95d5cded00f3a3e8a98fb1eed568aa9f.png'
      }
      this.sprites.push(shinySprite);
      this.team.push(data.name.toUpperCase())
      this.displayOurPokemon();
    }
    
    //displays the name and sprite image for each pokemon on the team
    displayOurPokemon() {
      this.card.innerHTML  = this.team.map((pokemon, index) => 
      `<div class="cards">
        <div class="card type-${this.generatedDisplayedTypes[index][0].type.name}">
          <h3 datatest-id="homepage-generated-pokemon-name-${index}">${this.team[index]}</h3>
          <img src="${this.sprites[index] ? this.sprites[index] : 'https://i.pinimg.com/originals/95/d5/cd/95d5cded00f3a3e8a98fb1eed568aa9f.png'}"
          datatest-id="homepage-generated-pokemon-sprite-${index}"/>
          <h3 datatest-id="homepage-generatedpokemon-types-${index}">${this.generatedDisplayedTypes[index][0].type.name} <br> ${this.generatedDisplayedTypes[index][1]?.type.name || ''}</h3>
        </div>
      </div>
      `).join("");
    }

    // pure function that returns a random number 
    // the number is used after our fetch call to determine the random pokemon
    generateRandomNum(max) {
      let num = Math.floor(Math.random() * max);
      return num
    }
    
    // resets all of our data to start over. Connected to the start over button
    reset() {
      this.startOver.addEventListener('click', () => {
        this.card.innerHTML = "";
        this.selectedTypes.innerHTML = "";
        this.types = [];
        this.displayTypes = [];
        this.randomPokemon = [];
        this.team = [];
        this.sprites = [];
        this.generatedDisplayedTypes = [];
        this.arrayOfNums = [];
        this.generate.disabled = false;
        this.randomize.disabled = false;
        this.pokemonTypes.forEach(button => button.disabled = false);
        this.selected.classList.add('hidden');
        this.hereIsYourTeam.classList.add('hidden');
      });
    }
  }
  
  
  const app = new App();