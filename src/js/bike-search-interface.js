import { bikeSearch } from './../src/js/bike-search.js';

$(document).ready(function() {
  $('#zip-input').val("97232");
  $('#proximity-input').val("100");
  $('#color-input').val("red, yellow");
  $('#start-date').val("1998-12-19");
  $('#end-date').val("2017-12-19");
  $('#bike-finder').submit(function(e) {
    e.preventDefault();
    console.log($('#start-date').val());
    const zip = $('#zip-input').val();
    const proximity = $('#proximity-input').val();
    const startDate = parseInt((new Date($('#start-date').val()).getTime() / 1000).toFixed(0));
    const endDate = parseInt((new Date($('#end-date').val()).getTime() / 1000).toFixed(0));
    const color = encodeURIComponent($('#color-input').val("red, yellow"));
    const searchType = $('#search-type').val();
    console.log(`zip: ${zip} prox: ${proximity} start: ${startDate} end: ${endDate} color: ${color} search: ${searchType}`);
    // $('#zip-input').val("");
    // $('#proximity-input').val("");
    // $('#color').val("");
    const searchResults = bikeSearch(zip, proximity, startDate, endDate, color, searchType);
    console.log(searchResults);

    searchResults.then(function(response) {
      const bikes = JSON.parse(response);
      console.log(bikes.bikes);
      if (searchType === 'count') {
        $('.output').empty().html(`<span>Out of ${bikes.stolen} bikes registered as stolen, ${bikes.proximity} are reported stolen within ${proximity} miles of ${zip} between the specified dates</span>`);
      } else if (searchType === 'stolen') {
        $('.output').empty();
        bikes.bikes.map(function(bike) {
          $('.output').append(`<div class="bike-list-item">
                                <h3>${bike.title}</h3>
                                <div class="bike-image">
                                  <img src="${bike.large_img}" alt="${bike.title}">
                                </div>
                                <span class="location">${bike.stolen_location}</span>
                                <span class="date-stolen">${bike.date_stolen}</span>
                              </div>`);
        });
      }
    }, function(error) {
      Error(`There was an error processing your request: ${error.message}`);
    });
  });
});
