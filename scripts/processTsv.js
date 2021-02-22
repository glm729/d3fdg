/**
 * Callback function for processing the TSV input in Blob.text().then(...).
 * Quite a mangle, but this might be improved and streamlined in future.
 * @param {String} tsv Raw TSV content from Blob.text()
 * @return N/A, runs FDG simulation
 */
function processTsv(tsv) {
  // Load KEGG List Compound and KEGG Reaction equations
  let klc = loadKLC();
  let kre = loadKRE();
  // Get reduced literature information
  let rli = cleanNames(convRawTsvJson(tsv));
  // Get nodes with ID only
  let withId = getWithId(rli, klc);
  // Get the reaction shortlist
  let sl = shortlistReactions(withId, kre);
  // Swap the other IDs with anchor IDs
  let sls = swapOtherIds(withId, sl);
  // Reduce the shortlist to unique (undirected) reactions
  let slr = reduceShortlist(sls);
  // Get the array of all nodes (i.e. add first neighbours)
  let ac = getAllCompounds(withId, slr);
  // Get the links between nodes
  let links = slr.map(o => ({source: o.lhs, target: o.rhs}));
  // Prepare the visualisation data
  let visData = {nodes: ac, links: links};
  // Run the simulation, with an alternate node colour callback
  runSimulation(
    visData,
    idSvg = "svgTsv",
    opt = {
      nodeColourCb: (d, i) => d.nodeColour
    }
  );
}
