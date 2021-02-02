/**
 * Function for providing a dummy header if none is provided in a data upload.
 *
 * @param {Integer} ofLength The length of the array of dummy names to return
 * @return {Array} Array of dummy names of the form `vPN`, where `P` is the
 * zero-padding (if applicable), and `N` is the current number.
 */
function assignEmptyHeader(ofLength) {
  // Initialise empty results array
  let result = [];
  // Loop from 0 until the max. length.
  // Tempted to do a while loop for this, not really sure why.
  for (let i = 0; i < ofLength; ++i) {
    // Push a string of the form `vN`.  N is padded with zeros as necessary.
    result.push("v" + String(i).padStart(String(ofLength).length, "0"));
  };
  return result;
}
