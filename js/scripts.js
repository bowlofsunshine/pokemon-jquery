//IIFE
var pokemonRepository = (function() {
  var repository = [];
  //URL to access pokedex
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=25';
  //Function to add Pokemon data
  function add(pokemon) {
    repository.push(pokemon);
  }

  function addListItem(pokemon) {
    var $pokemonList = $('.pokemon-list');
    var $listItem = $('<li></li>');
    //creating a button with a class to match the bootstrap
    var $button = $(
      '<button type="button" class="btn btn-primary btn-outline-danger" data-toggle="modal" data-target="#exampleModalCenter"</button>'
    );
    //setting inner button text to be the pokemon's name
    $button.text(pokemon.name);
    //append the button to the list item as its child.
    $($listItem).append($button);
    //append the list item to the pokemonlist as its child.
    $($pokemonList).append($listItem);
    //jquery event listener set to on so when button is click it show's pokemon details
    $button.on('click', function() {
      showDetails(pokemon);
    });
  }
  //Add a loadList function as a return key that uses jquery ajax to GET the complete list of Pokémon
  function loadList() {
    return $.ajax(apiUrl, { dataType: 'json' })
      .then(function(responseJSON) {
        return responseJSON;
      })
      .then(function(json) {
        $(json.results).each(function(item) {
          //Make sure to set name and detailsUrl as the keys.
          var pokemon = {
            name: json.results[item].name,
            detailsUrl: json.results[item].url
          };
          //Use the add() function to add each Pokémon from the results to your repository variable.
          add(pokemon);
        });
      })
      .catch(function(e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-disable no-console */
      });
  }
  //Add a loadDetails()
  //loadDetails() function should expect a parameter with a Pokémon object as a parameter.
  function loadDetails(item) {
    var url = item.detailsUrl;
    //loadDetails() should GET the Pokémon details using the URL from the Pokémon object in the parameter.
    return $.ajax(url, { dataType: 'json' })
      .then(function(responseJSON) {
        //Once the GET request is complete, use then to return a JSON response.
        return responseJSON;
      })
      .then(function(details) {
        //Then, assign some of the details you got from the response to the Pokémon object in the repository
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = Object.keys(details.types);
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function showModal(item) {
    var modal = $('.modal-body');
    //create a title for the pokemon name, add inner text of pokemon name
    var pokemonName = $('.modal-header').text(item.name);
    //create a paragraph for the pokemon height
    var pokemonHeight = $('<p class="pokemon-height"></p>').text(
      item.name + ' is ' + item.height / 10 + ' meters tall. '
    );
    //create a paragraph for the pokemon weight
    var pokemonWeight = $('<p class="pokemon-Weight"></p>').text(
      item.name + ' weighs ' + item.weight / 100 + ' grams. '
    );
    //render pokemon Image to appear in the modal
    var pokemonImage = $(
      '<img class="modal-body" src="' + item.imageUrl + '">'
    );
    //clearing the modal after each click so they don't stack up... easier way to do this?
    if (modal.children().length) {
      modal.children().remove();
    }
    //appending each new variable to the original modal
    modal
      .append(pokemonName)
      .append(pokemonImage)
      .append(pokemonHeight)
      .append(pokemonWeight);
    // modal.empty();
  }

  //Inside the showDetails() function, call the loadDetails() function from above.
  function showDetails(item) {
    pokemonRepository
      .loadDetails(item)
      .then(function() {
        return item;
      })
      .then(function(item) {
        showModal(item);
      });
  }

  function getAll() {
    return repository;
  }

  //return objects of the pokemonRepository.
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal
  };
})();
//Call the loadList function of pokemonRepository.
pokemonRepository.loadList().then(function() {
  // Now the data is loaded
  //Then, execute getAll from the pokemonRepository
  pokemonRepository.getAll().forEach(function(pokemon) {
    //forEach Pokémon, call the addListItem function you wrote in the previous Exercise.
    pokemonRepository.addListItem(pokemon);
  });
});
