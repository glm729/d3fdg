/**
 * Function for getting only those entries in the literature data which have at
 * least an anchor ID in KEGG Compound, by matching name.
 *
 * @param {Array} Reduced literature data
 * @param {Array} KEGG List Compound JSON
 * @return {Array} Doubly-reduced literature data -- only entries with at least
 * an anchor ID, with anchor and other IDs appropriately attributed
 */
function getWithId(data, klc) {
  // Initialise results array and index
  let result = [];
  let i = 0;
  // Map over the input data
  data.map(d => {
    // Get the KEGG List Compound extract
    let extract = subsetData(d.name, klc);
    // Scan the extract for potential IDs
    let idScan = pickAnchor(d.name, extract);
    // Push d to the results
    // NOTE:  How do I get an exact copy, not the entry itself?
    if (idScan.idAnchor !== null) {
      result.push(d);
      // Attribute the anchor and other IDs
      result[i].idAnchor = idScan.idAnchor;
      result[i].idOther = idScan.idOther;
      // Increment index
      i += 1;
    };
  });
  return result;
}
