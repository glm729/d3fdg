/**
 * Get the number of links each node features.  Intended to be used in a map,
 * e.g. allCompounds = allCompounds.map(a => numLinks(a, slr));
 * For best results, use the reduced shortlist -- this will effectively count
 * the number of nodes the current node is connected to.
 * @param {Object} obj Current entry in the data for which to check links
 * @param {Array} slr Reduced shortlist of reaction opposing pairs
 * @return Input object with the attribute `n`, representing the number of
 * connections the node features
 */
function numLinks(obj, slr) {
  // Initialise count
  let n = 0;
  // For each entry in the reduced shortlist
  slr.forEach(e => {
    // If the lhs or rhs are the anchor ID, increment n
    if (e.lhs === obj.idAnchor || e.rhs === obj.idAnchor) n += 1;
  });
  // Apply the attribute and return
  obj.n = n
  return obj;
  // NOTE:  This mutates anyway, perhaps.  Might want to fix this.
}
