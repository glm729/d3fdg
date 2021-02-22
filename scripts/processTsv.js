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
  let ac = getAllCompounds(withId, slr).map(a => numLinks(a, slr));
  // Get the links between nodes
  let links = slr.map(o => ({source: o.lhs, target: o.rhs}));
  // Prepare the visualisation data
  let visData = {nodes: ac, links: links};
  // Define alternate callbacks
  function cb_nodeColour(d, i) {
    return d.nodeColour;
  };
  function cb_nodeSize(d, i) {
    if (d.nodeCore) return d.nodeSize;
    if (d.n > 1) return 5;
    return 0;
  };
  function cb_text(d, i) {
    if (d.nodeCore) return d.name;
    if (d.n < 2) return '';
    function pickShortest(arr) {
      let srt = arr.slice().sort();
      return srt.reduce((f, n) => {
        if (n.length < f.length) return n;
        return f;
      }, srt[0]);
    };
    let data = klc.filter(x => x.idKegg === d.idAnchor)[0];
    if (data.nameKegg) return pickShortest(data.nameKegg);
    return d.idAnchor;
  };
  // Run the simulation, with alternate callbacks
  runSimulation(
    visData,
    idSvg = "svgTsv",
    opt = {
      cb_nodeColour: cb_nodeColour,
      cb_nodeSize: cb_nodeSize,
      cb_text: cb_text
    }
  );
}
