/**
 * Get an array of all compounds and their first neighbours, given an array of
 * main compounds and the reduced reaction opposition shortlist.
 * @param {Array} withId Data of nodes with an ID in KEGG Compound
 * @param {Array} slr "Shortlist reduced" -- reduced shortlist of opposing
 * compounds in KEGG reaction equations
 * @return {Array} Array of Objects containing the original compounds plus the
 * neighbouring compounds, marked as non-core and with fill colour grey
 */
function getAllCompounds(withId, slr) {
  // Get the anchor/main IDs
  let idinWith = withId.map(w => w.idAnchor);
  // Get array of unique IDs in the reduced shortlist
  let idinSlr = [...new Set(slr.map(s => [s.lhs, s.rhs]).flat())];
  // Filter out the main IDs
  idinSlr = idinSlr.filter(x => idinWith.indexOf(x) === -1);
  // Initialise the output array
  let output = new Array();
  // For each entry in those with IDs
  withId.forEach(w => {
    // Attempting to avoid mutating the original data
    let d = w;
    d.nodeCore = true;
    output.push(d);
  });
  // For each ID in the reduced reaction shortlist
  idinSlr.forEach(i => {
    // Push the peripheral node to the output
    output.push({name: i, idAnchor: i, nodeCore: false, nodeColour: "grey"});
  });
  return output;
}
