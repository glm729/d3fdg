/**
 * Async function for processing the contents of the uploaded ZIP file,
 * containing precisely the assumed input data.
 * - Filenames are hardcoded, as the operations are assumed to be known.
 * - Function must be async due to the async nature of the unzip function.
 *
 * No parameters, no return.  Reads and processes input data, and runs the
 * force-directed graph simulation.  Notably hardcoded.
 */
async function processZip() {
  let zipFile = document.getElementById("zipUpload").files[0];
  console.log("Retrieved ZIP file.");
  let zipContent = await unzip(zipFile);
  console.log("Retrieved ZIP content.");
  let klc = JSON.parse(zipContent.keggListCompound);
  console.log("Parsed KLC.");
  let kre = JSON.parse(zipContent.keggReactionEquation);
  console.log("Parsed KRE.");
  let rli = reduceUniqueNames(cleanNames(convRawTsvJson(
    zipContent.literature
  )));
  console.log("Got RLI.");
  let withId = getWithId(rli, klc);
  console.log("Found entries with ID.");
  let opposeReduced = reduceOppose(withId, getOppose(withId, kre));
  console.log("Got reduced opposing compounds.");
  let withLinks = getWithLinks(withId, opposeReduced);
  console.log("Found entries with links.");
  let links = opposeReduced.map(o => ({"source": o.lhs, "target": o.rhs}));
  let visData = {"nodes": withLinks, "links": links};
  window._vis = visData;
  console.log("Vis data prepared, sending to SVG.");
  runSimulation(visData, idSvg = "svgZip");
}
