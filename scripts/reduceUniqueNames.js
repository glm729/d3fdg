/**
 * Function for reducing clean data to unique names, but including regulation
 * direction and number of times reported.
 *
 * @param {Array} data Converted and cleaned literature data.
 * @param {String} key Term used to refer to the names to reduce to unique
 * entries.
 * @return {Array} Array of Objects, whereby each Object represents one unique
 * name in the cleaned literature.  All other keys remain the same, but each
 * new result of the same name is pushed to the relevant Object key.
 */
function reduceUniqueNames(data, key = "name") {
  // Initialise results object and name store
  let result = [];
  let nameUniq = [];
  // Map over the input data
  data.map(d => {
    let keys = Object.keys(d).filter(x => x !== key);
    d[key] = d[key].toLowerCase();
    // If the name isn't in the known names
    // NOTE:  Change to .includes(...)?
    if (nameUniq.indexOf(d[key]) === -1) {
      nameUniq.push(d[key]);  // Add the new name
      result.push(new Object());  // Make a new Object in the results
      let i = nameUniq.indexOf(d[key]);  // Get the new index
      result[i][key] = d[key];  // Assign the name
      result[i].timesReported = 1;  // Assign the times reported
      // Map over the keys (which should all be the same anyway, but who knows)
      keys.map(k => {
        result[i][k] = [];  // Assign an empty array
        result[i][k].push(d[k]);  // Push the data to the empty array
      });
    } else {
      let i = nameUniq.indexOf(d[key]);  // Get the index
      result[i].timesReported += 1;  // Increment times reported
      // Push the new data to the existing arrays (except the name)
      keys.map(k => result[i][k].push(d[k]));
    };
  });
  return result;
}
