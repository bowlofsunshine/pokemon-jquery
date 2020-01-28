$(document).ready(function(){

var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $modalContainer = $('#modal-container');

  function add(pokemon) {
    repository.push(pokemon);
  }

  function addListItem(pokemon) {
    var $pokemonList = $('.pokemon-list');
    var $listItem = $('<li></li>')
    var $button = $('<button class="button-class">' + pokemon.name + '</button>');
    $($listItem).append($button);
    $($pokemonList).append($listItem);
    $button.on('click', function() {
      showDetails(pokemon)
    })
  }

  function loadList() {
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(responseJSON) {
      return responseJSON;
    }).then(function(json) {
      $(json.results).each(function(item) {
        var pokemon = {
          name: json.results[item].name,
          detailsUrl: json.results[item].url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
  var url = item.detailsUrl;
  return $.ajax(url, {dataType: 'json'}).then(function(responseJSON) {
    return responseJSON;
  }).then(function(details) {
    item.imageUrl = details.sprites.front_default;
    item.height = details.height;
    item.weight = details.weight;
    item.types = Object.keys(details.types);
  }).catch(function(e) {
    console.error(e);
  })
}


function showModal(item) {
  var $modalContainer = ('#modal-container');
  var $modal = $('<div class="modal"></div>');
  var $pokemonName = $('<h1>' + item.name + '</h1>');
  $($modal).append($pokemonName);
  var $pokemonHeight = $('<p>' + item.name + ' is ' + item.height/10 + ' meters tall' + '</p>');
  $($modal).append($pokemonHeight);
  var $pokemonImage = $('<img class="modal-img" src="' + item.imageUrl + '">');
  $($modal).append($pokemonImage);
  var $closeButtonElement = $('<button class="modal-close">CLOSE</button>');
  $($modal).append($closeButtonElement);
  $closeButtonElement.on('click', hideModal);
  $($modalContainer).append($modal);
  $($modalContainer).addClass('is-visible');
}

function showDetails(item) {
  pokemonRepository.loadDetails(item).then(function() {
    return item;
  }).then(function(item) {
    showModal(item);
  });
}

function hideModal() {
  var $modalContainer = $('#modal-container');
  $modalContainer.removeClass('is-visible');
  $modalContainer.empty();
}

$(window).on('keydown', (e) => {
  var $modalContainer = $('#modal-container');
  if (e.key === 'Escape') {
    hideModal();
  }
});

$($modalContainer).on('click', (e) => {
  target = e.target;
  if (target.id === 'modal-container') {
    hideModal();
  }
});

function getAll() {
  return repository;
}

return{
  add: add,
  getAll: getAll,
  addListItem: addListItem,
  showDetails: showDetails,
  loadList: loadList,
  loadDetails: loadDetails,
  showModal: showModal,
};
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
});
