/**
 * Function for extracting compounds opposing each other in KEGG Reaction
 * equations, but only those relevant to the uploaded literature data.
 *
 * @param {Array} withId Data in the literature data input that features an ID
 * in the KEGG Compound data.
 * @param {Array} kre KEGG Reaction equation data, from the function
 * `convKeggReactionEquation`.
 * @return {Array} Array of Objects, containing each individual opposing
 * compound pair in the literature data.
 */
function getOppose(withId, kre) {
  // Initialise the results array
  let result = [];
  // Get all compound IDs in the input data
  let idAll = withId
    .map(w => {  // All IDs per entry
      return [w.idAnchor, w.idOther].flat();
    })
    .flat()  // Flatten the array of arrays
    .filter(x => x !== null)  // Filter out the nulls (from idOther)
  // Get the unique IDs present
  let idUniq = [...new Set(idAll)];
  // Map over the KEGG reaction equations data
  kre.map(k => {
    // Get the literature compound IDs, LHS
    let lhsIn = k.lhs.map(l => {
      if (idUniq.indexOf(l) !== -1) return l;
    }).filter(l => l !== undefined);
    // If none to link, next
    if (lhsIn.length === 0) return;
    // Get the literature compound IDs, RHS
    let rhsIn = k.rhs.map(r => {
      if (idUniq.indexOf(r) !== -1) return r;
    }).filter(r => r !== undefined);
    // If none to link, next
    if (rhsIn.length === 0) return;
    // Push every opposing pair  -- loop over the LHS and RHS
    lhsIn.map(l => {
      rhsIn.map(r => {
        result.push({"lhs": l, "rhs": r});
      });
    });
  });
  return result;
}
