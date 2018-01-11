import { bikeSearch } from './../src/js/bike-search.js';


$(document).ready(function() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });


  // $('#zip-input').val("97232");
  // $('#proximity-input').val("100");
  // $('#colors-input').val("red, yellow");
  $('#start-date').val("1998-12-19");
  $('#end-date').val("2017-12-19");
  $('#bike-finder').submit(function(e) {
    e.preventDefault();
    const zip = $('#zip-input').val();
    const proximity = $('#proximity-input').val();
    const startDate = (new Date($('#start-date').val()).getTime() / 1000).toFixed(0);
    const endDate = (new Date($('#end-date').val()).getTime() / 1000).toFixed(0);
    const colors = encodeURIComponent($('#colors-input').val());
    const searchType = $('#search-type').val() + '?';
    $('#zip-input').val("");
    $('#proximity-input').val("");
    $('#colors').val("");
    const searchResults = bikeSearch(searchType, colors, zip, proximity, startDate, endDate);

    searchResults.then(function(response) {
      const bikes = JSON.parse(response);
      console.log(bikes.bikes);
      if (searchType === 'count?') {
        $('.output').empty().html(`<span>Out of ${bikes.stolen} bikes registered as stolen, ${bikes.proximity} are reported stolen within ${proximity} miles of ${zip} between the specified dates</span>`);
      } else if (searchType === 'stolen?') {
        $('.output').empty();
        bikes.bikes.map(function(bike) {
          console.log(new Date(bike.date_stolen * 1000));
          if (bike.large_img) {
            $('.output').append(`<div class="bike-list-item">
                                  <h3>${bike.title}</h3>
                                  <div class="bike-image">
                                    <img src="${bike.large_img}" alt="${bike.title}">
                                  </div>
                                  <span class="location">${bike.stolen_location}</span>
                                  <span class="date-stolen">${new Date(bike.date_stolen * 1000).toDateString()}</span>
                                </div>`
                              );
          } else {
            $('.output').append(`<div class="bike-list-item">
                                  <h3>${bike.title}</h3>
                                  <span class="location">${bike.stolen_location}</span>
                                  <span class="date-stolen">Reported stolen on ${new Date(bike.date_stolen * 1000).toDateString()}</span>
                                </div>`
                              );
          }
        });
      }
    }, function(error) {
      Error(`There was an error processing your request: ${error.message}`);
    });
  });

});
