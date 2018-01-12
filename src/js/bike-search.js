import { slugMaker } from './slug-maker.js';

export let bikeSearch = function(searchType, colors, zip, proximity, startDate, endDate) {
  const slug = slugMaker(searchType, colors, zip, proximity, startDate, endDate);

  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();
    const url = `https://bikeindex.org:443/api/v2/bikes_search/${slug}`;
    console.log(url);
    request.onload = function() {
      if (this.status === 200) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    };
    request.open("GET", url, true);
    request.send();
  });
};
