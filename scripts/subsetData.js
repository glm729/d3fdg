/**
 * Function for subsetting KEGG Compound ID and name data to those matching
 * names found based on the input name.
 *
 * @param {String} name Name to subset the data by.
 * @param {Array} keggData Array of Objects containing data from the KEGG List
 * Compound operation.
 * @return {Array} Subset of the `keggData` array of Objects whereby the
 * name(s) match the specified name or a chiral isomer pattern.
 */
function subsetData(name, keggData) {
  // Get the name pattern
  let nPat = name.replace(/(ate|ic acid)$/, "(ate|ic acid)");
  // Convert this to a regex
  let nRex = new RegExp("^([dl]-)?" + nPat + "$", "gi");
  // Map over the KEGG data
  return keggData.map(k => {
    // Check if any of the data match
    let anyMatch = k.nameKegg.filter(n => nRex.test(n))
    // If no matches after filtering null entries, return null
    if (anyMatch.length === 0) return;
    // Return the KEGG Compound ID and the matching names
    return {"idKegg": k.idKegg, "matchName": anyMatch};
  }).filter(x => x !== undefined);  // Filter out empty entries
}
