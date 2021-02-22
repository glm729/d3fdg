/**
 * Swap the "other" IDs for the anchor IDs in the reaction shortlist.
 * @param {Array} input Input data with IDs, i.e. featuring the assigned
 * attributes "idAnchor" and "idOther"
 * @param {Array} reacShortlist Reaction shortlist from shortlistReactions
 * @return {Array} The input reaction shortlist, but with any "other" IDs
 * replaced with the relevant anchor IDs
 */
function swapOtherIds(input, reacShortlist) {
  // Initialise array of paired anchor ID-other ID entries
  let idPair = new Array();
  // Initialise array of all other IDs seen
  let otherIds = new Array();
  // For each input entry
  input.forEach(i => {
    // If there is a relevant other ID
    if (i.idOther) {
      // For each other ID
      i.idOther.forEach(o => {
        // Push the anchor-other pair
        idPair.push({idAnchor: i.idAnchor, idOther: o})
        // Push to the other IDs
        otherIds.push(o);
      });
    };
  });
  // For each entry in the reaction shortlist
  reacShortlist.forEach(r => {
    // If the left-hand side is an "other" ID
    if (otherIds.indexOf(r.lhs) !== -1) {
      // Replace with the appropriate anchor
      r.lhs = idPair.filter(x => x.idOther === r.lhs)[0].idAnchor;
    };
    // If the right-hand side is an "other" ID
    if (otherIds.indexOf(r.rhs) !== -1) {
      // Replace with the appropriate anchor
      r.rhs = idPair.filter(x => x.idOther === r.rhs)[0].idAnchor;
    };
  });
  return reacShortlist;
};
