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
  // Initialise data out and array of all IDs
  let out = [];
  let idAll = [];
  // Map over the data with IDs
  withId.map(w => {
    // If the anchor ID isn't already present, push to idAll
    if (idAll.indexOf(w.idAnchor) === -1) idAll.push(w.idAnchor);
    // If any other IDs
    if (w.idOther !== null) {
      // For each other ID, if not present, push to idAll
      w.idOther.map(o => {if (idAll.indexOf(o) === -1) {idAll.push(o)}});
    };
  });
  // Get unique IDs
  let idUniq = [...new Set(idAll)];
  // Map over the KEGG Reaction data
  kre.map(k => {
    // Get literature compound IDs on the LHS
    let lhsIn = k.lhs.filter(l => idUniq.indexOf(l) !== -1);
    // If none, quit
    if (lhsIn.length === 0) return;
    // Get literature compound IDs on the RHS
    let rhsIn = k.rhs.filter(r => idUniq.indexOf(r) !== -1);
    // If none, quit
    if (rhsIn.length === 0) return;
    // Map over the LHS and RHS, and push the opposing compound IDs
    lhsIn.map(l => {rhsIn.map(r => {out.push({"lhs": l, "rhs": r})})});
  });
  return out;
}
