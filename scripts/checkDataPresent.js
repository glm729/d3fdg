/**
 * Function for checking whether the required data are present.
 *
 * User passes in an array of IDs to check, and if any are undefined or null,
 * `false` is returned and a warning logged in the console.
 *
 * This should essentially stop operations if not all of the required data are
 * present.  This may not be a problem in ChemInfo, but it certainly could be
 * in my test page.
 *
 * @param {Array} arr Array of variable names to pass in, assuming that the
 * variables are keys of the `window` object.
 * @return {Boolean} True or false, whether all required data are present or
 * not.
 */
function checkDataPresent(arr) {
  // Initialise array of missing data
  let missing = [];
  // Map over the array of names and check if missing
  arr.map(a => {
    // If missing, push to the array of missing keys
    if (window[a] === undefined || window[a] === null) missing.push(a);
  });
  // If there's more than one key missing, print a warning in the console, and
  // return false
  if (missing.length > 0) {
    console.warn([
      "Not all data are present.\nKeys missing:  \n  ",
      missing.join("\n  "),
      "\nStopping operations."
    ].join(''));
    return false;
  };
  // Otherwise, there are no data missing, so return true
  return true;
}
