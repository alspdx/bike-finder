export let bikeSearch = function(zip, proximity, startDate, endDate, color, searchType) {
  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();
    const url = `https://bikeindex.org:443/api/v2/bikes_search/${searchType}?colors=${color}&proximity=${zip}&proximity_square=${proximity}&stolen_after=${startDate}&stolen_before=${endDate}`;
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
