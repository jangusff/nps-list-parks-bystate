'use strict';

// put your own value below!
const apiKey = '<key_removed_for_safety'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';
const parkDesignation = "National Park";


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, query) {
  let foundAtLeastOne = false;
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++) {
    // for each object in the data 
    //array, add a list item to the results 
    //list with the national park's name, description,
    //and website url
    if (responseJson.data[i].designation === parkDesignation) {
      foundAtLeastOne = true;
      $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullname}</h3>
        <p><span class="apply-bold">Descrip: </span>${responseJson.data[i].description}</p>
        <h3><span>Website: </span><a href="${responseJson.data[i].url}">Click here to visit website</a></h3>
        </li>`
      )
    }
  }
  //display the results section  
  $('#results').removeClass('hidden');

  if (!foundAtLeastOne) {
    $('#results-list').append(`<h3>Sorry. No National Parks found for ${query}</h3>`);
  }
};

function getNPSList(query, maxResults=10) {
  const params = {
    api_key: apiKey,
    limit: maxResults,
    stateCode: query.toUpperCase(),
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, query.toUpperCase()))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNPSList(searchTerm, maxResults);
  });
}

$(watchForm);