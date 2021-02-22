/**
 * Shortlist the KEGG Reaction equations list based on the input data with IDs.
 * @param {Array} input Input data found to feature IDs in KEGG Compound
 * @param {Array} kre KEGG Reaction equations data
 * @return {Array} KEGG Reaction equation data reduced to only those reactions
 * featured in the input data -- if at least one side is a core or non-core
 * node, the reaction is provided in opposing form (lhs <-> rhs)
 */
function shortlistReactions(input, kre) {
  // Shorthand callback for pushing to the allIds array
  function cb(id) {
    if (allIds.indexOf(id) === -1) allIds.push(id);
  };
  // Initialise array for all IDs present
  let allIds = new Array();
  // For each input entry
  input.forEach(i => {
    // Run the callback...
    cb(i.idAnchor);
    // ... and if there are other IDs, run the callback for each of those
    if (i.idOther) i.idOther.forEach(cb);
  });
  // Initialise the output shortlist
  let shortlist = new Array();
  // For each KEGG Reaction entry
  kre.forEach(k => {
    // For each lhs ID
    k.lhs.forEach(l => {
      // If it's a relevant ID
      if (allIds.indexOf(l) !== -1) {
        // For each rhs ID
        k.rhs.forEach(r => {
          // Push the lhs-rhs pair to the shortlist
          shortlist.push({lhs: l, rhs: r});
        });
      };
    });
    // For each rhs ID
    k.rhs.forEach(r => {
      // If it's a relevant ID
      if (allIds.indexOf(r) !== -1) {
        // For each lhs ID
        k.lhs.forEach(l => {
          // Push the lhs-rhs pair to the shortlist
          shortlist.push({lhs: l, rhs: r});
        });
      };
    });
  });
  return shortlist;
};
