/**
 * Function for reducing the array of opposing compounds to account for the
 * anchor/other IDs, and to skip entries where the LHS and RHS (or the
 * reflected version) is already present.  The latter functionality is to
 * account for the graph being undirected (at least at this stage).
 *
 * @param {Array} withId Literature data for which at least an anchor ID has
 * been found.
 * @param {Array} oppose Opposing compounds from KEGG Reaction equations, that
 * is, from `getOppose`.
 * @return {Array} Reduced list of opposing compounds comprising only those in
 * the literature with IDs, and without reflections.
 */
function reduceOppose(withId, oppose) {
  // Initialise results array
  let result = [];
  // Loop over the opposing compounds
  oppose.map(o => {
    // Loop over the entries with IDs
    withId.map(w => {
      // Skip to next if there are no chiral isomer entries
      if (w.idOther === null) return;
      // Replace the ID with the anchor if it matches any other ID
      if (w.idOther.indexOf(o.lhs) !== -1) o.lhs = w.idAnchor;
      if (w.idOther.indexOf(o.rhs) !== -1) o.rhs = w.idAnchor;
    });
    // If the opposing compounds are identical, don't introduce a loop
    if (o.lhs === o.rhs) return;
    // Initialise flag
    let isPresent = false;
    // Map over the results so far
    result.map(r => {
      // If there's already a matching entry (forward or reverse), mark it
      if (r.lhs === o.lhs && r.rhs === o.rhs) isPresent = true;
      if (r.rhs === o.lhs && r.lhs === o.rhs) isPresent = true;
      // Don't continue over the whole results object if it's already found
      if (isPresent) return;
      // NOTE:  Does this even work?  Perhaps while(!isPresent) {...}?
    })
    // If it isn't present in the results, push it to the results
    if (!isPresent) result.push(o);
  });
  return result;
}
