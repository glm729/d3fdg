/**
 * Function for preparing a set of data for the D3 force-directed graph (fdg).
 * Assumes `oppose` is from the `reduceOppose` function.  Checks which nodes
 * have already been seen, to avoid defining multiple of the same node.
 * Replaces IDs with the names of the compounds.
 *
 * @param {Array} withId Data from the literature with ID(s) in KEGG Compound.
 * @param {Array} oppose Array of objects of opposing compounds, based on the
 * KEGG Reaction equations.
 * @return {Object} Required data for D3 fdg, containing the arrays `nodes` and
 * `links`, defining the graph visualisation.
 */
function prepareVisData(withId, oppose) {
  // Initialise results object
  let result = {"nodes": [], "links": []};
  // Initialise array of nodes seen
  let nodeSeen = [];
  // Loop over the opposing compounds
  oppose.map(o => {
    // Loop over the data with ID
    withId.map(w => {
      // Replace the ID with the name
      if (o.lhs === w.idAnchor) o.lhs = w.name;
      if (o.rhs === w.idAnchor) o.rhs = w.name;
    })
    // If nodes not already seen, add their data to the nodes object
    if (nodeSeen.indexOf(o.lhs) === -1) {
      result.nodes.push({"name": o.lhs});
      nodeSeen.push(o.lhs);
    };
    if (nodeSeen.indexOf(o.rhs) === -1) {
      result.nodes.push({"name": o.rhs});
      nodeSeen.push(o.rhs);
    };
    // Push the opposing compounds to the links
    result.links.push({"source": o.lhs, "target": o.rhs});
  });
  // Map over the data with ID
  withId.map(w => {
    // Initialise colour flag
    let col = null;
    // Get the unique regulation entries
    let regSet = [...new Set(w.regulation)];
    // If there's more than one unique entry, mark a conflict with cyan
    col = regSet.length > 1 ? "cyan" : null;
    // If no conflict
    if (col === null) {
      // If increased, mark green
      if (regSet[0] === "increased") col = "green";
      // If decreased, mark red
      if (regSet[0] === "decreased") col = "red";
      // If regulation is unique, and isn't increased or decreased, mark cyan
      if (col === null) col = "cyan";
      // TODO:  Refactor to allow for differences in regulation naming.
    };
    // For the node(s) for the current name, assign the colour
    result.nodes.filter(r => r.name === w.name).map(r => r.colour = col);
  });
  // NOTE:  Is there a way to refactor this as one major loop, rather than two?
  return result;
}
