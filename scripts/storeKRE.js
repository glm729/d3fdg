/**
 * Bypass/Cheat callback for storing the KEGG Reaction equations data in the
 * window, for easier later reference and debugging.  This may not be necessary
 * in ChemInfo.
 *
 * @param {String} text Raw text returned by `FileReader.readAsText`.
 * @return {Boolean} True or false, depending on success.  The file contents
 * are saved to the window as `_kre` if succesfful. An error is logged if not
 * successful.
 */
function storeKRE(text) {
  // Initialise error flag
  let flag;
  // Try to convert
  try {
    // Convert the data from raw text
    let data = convKeggReactionEquation(text);
    // Save the data, and log the occurrence
    window._kre = data;
    console.log(`Stored KEGG Reaction equation data as "_kre".`);
    // No error
    flag = false;
  } catch(e) {
    // Show the error in the console
    console.error("Error processing KRE!\n" + e.stack);
    // Flag the error
    flag = true;
  } finally {
    // Has an error occurred?
    return flag ? false : true;
  };
}
