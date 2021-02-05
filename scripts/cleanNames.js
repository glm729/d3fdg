/**
 * Function for cleaning the chemical names within the uploaded data.
 *
 * @param {Array} data An array of objects returned from `convRawTsvJson`, that
 * is, a raw TSV converted to JSON.
 * @param {String} key The key to refer to the names to clean.
 * @return {Array} Array of objects, whereby the name of each entry has been
 * cleaned, and if multiple names were present, there is now a single entry for
 * each name found (with identical data otherwise).
 */
function cleanNames(data, key = "name") {
  // Initialise the results object and its index
  let result = [];
  let i = 0;
  // Map over the data
  data.map(d => {
    // Get all keys for the current row except the key for name
    let keys = Object.keys(d).filter(x => x !== key);
    // Get the clean name
    let nameClean = d[key]
      .toLowerCase()
      .replace(/\**( \(.+)?$/, '')
      .replace(/(ate|ic acid)$/, "ate");
    // If there are multiple names in the entry
    if (nameClean.match(/[\/\+]/) !== null) {
      // Split up the name and trim whitespace
      let nameCleanMany = nameClean.split(/[\/\+]/).map(x => {
        return x.replace(/^\s+|\s+$/g, '');
      });
      // Map over the multiple names
      nameCleanMany.map(x => {
        // Push a new object to the results
        result.push(new Object());
        // Assign the name
        result[i][key] = x;
        // Assign the remaining data to the current row
        keys.map(k => result[i][k] = d[k]);
        // Increment results index
        i += 1;
      });
    } else {
      // Push a new object to the results
      result.push(new Object());
      // Assign the name
      result[i][key] = nameClean;
      // Assign the remaining data to the current row
      keys.map(k => result[i][k] = d[k]);
      // Increment results index
      i += 1;
      // NOTE:  Could abstract internal ops in the if...else?
    };
  });
  return result;
}
