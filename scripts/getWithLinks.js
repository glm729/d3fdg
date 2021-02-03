/**
 * Function for getting only the linked compounds with ID, such that there are
 * no "floating" nodes, i.e. nodes with no links.
 *
 * @param {Array} withId Array of Objects of the entries with ID in the KEGG
 * Compound data
 * @param {Array} opposeReduced Reduced opposing compounds present in the data
 * with IDs
 * @return {Array} withId filtered to select only those entries with an anchor
 * ID found in the reduced opposing compounds data
 */
function getWithLinks(withId, opposeReduced) {
  let idAll = opposeReduced.map(x => [x.lhs, x.rhs]).flat();
  return withId.filter(x => idAll.indexOf(x.idAnchor) !== -1);
}
