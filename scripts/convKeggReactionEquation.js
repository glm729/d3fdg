/**
 * Function for converting the raw KEGG reacID-equation pairs into a JSON, but
 * including the LHS and RHS compound lists.
 *
 * @param {String} raw String of raw text from the file/data to use.
 * @return {Array} Array of Objects, each containing the KEGG Reaction ID,
 * reaction equation, and the compounds present on the LHS and RHS of the
 * equation.
 */
function convKeggReactionEquation(raw) {
  // Initialise empty results array, and convert the raw text into JSON
  let result = [];
  let data = convRawTsvJson(raw, header = true);
  // Map over the data
  data.map(d => {
    // Get the compound IDs in the equation
    let s = d.equation.split(/>/).map(x => x.match(/C\d{5}/g));
    // If no IDs on either side, return null for that side
    d.lhs = (s[0] === null) ? [null] : s[0];
    d.rhs = (s[1] === null) ? [null] : s[1];
  });
  return data;
}
