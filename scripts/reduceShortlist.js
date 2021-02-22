/**
 * Reduce the ID-swapped reaction shortlist to unique entries, assuming
 * undirected links.
 * @param {Array} reachShortlist ID-swapped shortlist of reaction equations,
 * whereby each entry is an object with the attributes "lhs" and "rhs"
 * @return {Array} Array of entries but without repeats, either in the same
 * direction (lhs -> rhs) or the other (rhs -> lhs), thus this is only for
 * undirected data (lhs <-> rhs)
 */
function reduceShortlist(reacShortlist) {
  // Initialise the reduced array
  let reduced = new Array();
  // For each entry in the reaction shortlist
  reacShortlist.forEach(reac => {
    // If the two sides have the same ID, skip on
    if (reac.lhs === reac.rhs) return;
    // Initialise flag to add the entry
    let add = true;
    // For each entry in the shortlist
    reduced.forEach(red => {
      // If an entry is found whereby the entry is equivalent, either forwards
      // or backwards, flag negative for adding the current one
      if (red.lhs === reac.lhs && red.rhs === reac.rhs) add = false;
      if (red.rhs === reac.lhs && red.lhs === reac.rhs) add = false;
    });
    // If you should add it, do so.
    if (add) reduced.push(reac);
  });
  return reduced;
};
