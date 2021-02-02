/**
 * Bypass/Cheat callback for storing the reduced literature information in the
 * window, for easier later reference and debugging.  This is unlikely to be
 * necessary in ChemInfo.
 *
 * @param {String} text Raw text returned in the `FileReader.readAsText` call.
 * @return {Boolean} True or false, whether successful in converting the data
 * or not, but an error is also printed in the console on error.  Stores `_rli`
 * in the window.
 */
function storeRLI(text) {
  // Initialise error flag
  let flag;
  // Attempt the data conversion
  try {
    // Convert from raw TSV to JSON
    let data = convRawTsvJson(text);
    // Clean the names
    let clean = cleanNames(data);
    // Reduce the data
    let reduced = reduceUniqueNames(clean, key = "name");
    // Save the data to the window, and log this
    window._rli = reduced;
    console.log(`Stored reduced literature information as "_rli".`);
    // No error
    flag = false;
  } catch(e) {
    // Show the error
    console.error("Error processing RLI!\n" + e.stack);
    // Flag if error
    flag = true;
  } finally {
    // Has an error occurred?
    return flag ? false : true;
  };
}
