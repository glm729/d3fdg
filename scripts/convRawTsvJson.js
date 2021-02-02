/**
 * Function for converting raw tab-separated text data into JSON.  Preserves
 * the header (if present) as the keys.  If the header isn't present, a dummy
 * header is assigned to be the array of keys.
 *
 * - Modified to remove carriage returns, which are present in some of the data
 *   for an unknown reason.
 *
 * @param {String} raw String of raw text from the file/data to be read.
 * @param {Boolean} header Is a header row present in the dataset?
 * @return {Array} Array of Objects, whereby each column name is the key for
 * the corresponding data found.
 */
function convRawTsvJson(raw, header = true) {
  // Initialise the array of results, and the header variable
  let result = [];
  let head;
  // Break up the raw data
  let split = raw
    .replace(/\n$/, '')
    .split(/\n/)
    .map(x => x.replace(/\r/g, '').split(/\t/));
  // Get the header row -- top row of the data if specified, else use a dummy
  head = header ? split.shift() : assignEmptyHeader(split[0].length);
  // Loop over the rows
  for (let s = 0; s < split.length; ++s) {
    // Push a new object to the results
    result.push(new Object());
    // Loop over the header
    for (let h = 0; h < head.length; ++h) {
      // For each header, assign the [row, col] junction
      result[s][head[h]] = split[s][h];
    };
  };
  return result;
}
