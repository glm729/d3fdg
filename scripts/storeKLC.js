/**
 * Bypass/Cheat callback for storing the KEGG List Compound file input result
 * in the window, for easier later reference (and debugging).  This will likely
 * not be necessary in ChemInfo.
 *
 * @param {String} text Raw text returned in the `FileReader.readAsText` call.
 * @return {Boolean} True or false, depending on success, but an error is also
 * shown in the console.  Stores `_klc` in the window.
 */
function storeKLC(text) {
  // Initialise error flag
  let flag;
  // Try to convert the data
  try {
    // Convert the data from raw text
    let data = convKeggListCompound(text);
    // Save it to the window, and log
    window._klc = data;
    console.log(`Stored KEGG List Compound data as "_klc".`);
    // No error
    flag = false;
  } catch(e) {
    // Show the error
    console.error("Error processing KLC!\n" + e.stack);
    // Flag the error
    flag = true;
  } finally {
    // Has an error occurred?
    return flag ? false : true;
  };
}
