export function slugMaker(searchType, colors, zip, proximity, startDate, endDate) {
  const inputArray = [].slice.call(arguments);
  const slugOptionArray = [``, `colors=`, `proximity=`, `proximity_square=`, `stolen_after=`, `stolen_before=`];
  let urlSlugArray = [];
  let i = 0;
  inputArray.map(function(option) {
    if (option) {
      urlSlugArray.push(`${slugOptionArray[i]}${option}`);
    }
    i++;
  });
  urlSlugArray.push(`&per_page=100`);
  return urlSlugArray.join("&");
}
