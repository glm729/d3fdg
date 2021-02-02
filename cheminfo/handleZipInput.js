// Initialise timer
let t0 = Date.now();

// Pull in BG functions
let bg = API.cache("bg");

// Functions to help with fancy output for the user (in the Twig template)
function tableHeader(content, idTable = "uploadStatusTable") {
  // NOTE:  Use first, before any other addRow call
  let table = document.getElementById(idTable);
  let r = document.createElement("div");
  r.style.display = "table-row";
  content.map(c => {
    let h = document.createElement("div");
    h.style.display = "table-cell";
    h.style.paddingLeft = "6px";
    h.style.fontWeight = "bold";
    h.innerHTML = c;
    r.appendChild(h);
  })
  table.appendChild(r);
};
function makeTable(id) {
  let anchor = document.getElementById(id);
  let table = document.createElement("div");
  table.setAttribute("id", "uploadStatusTable");
  table.style.display = "table";
  anchor.appendChild(table);
  tableHeader(["Message", "Time elapsed"]);
};
function addRow(content, idTable = "uploadStatusTable") {
  let table = document.getElementById(idTable);
  let row = document.createElement("div");
  row.style.display = "table-row";
  content.map(c => {
    let cell = document.createElement("div");
    cell.style.display = "table-cell";
    cell.style.paddingLeft = "6px";
    cell.innerHTML = c;
    row.appendChild(cell);
  });
  table.appendChild(row);
};

// Function for reading the contents of the ZIP file.
// - Requires the JSZip library.
async function unzip(content) {
  let jszip = new JSZip();
  let zip = await jszip.loadAsync(content);
  let files = zip.files;
  let results = {};
  for (let k in files) {
    let file = files[k];
    let content = await file.async('string');
    results[k.replace(/\..+$/, '')] = content;
  };
  return results;
};

// Add the withId function to the background function definitions
bg.getWithId = function(data, klc) {
  let result = [];
  let i = 0;
  data.map(d => {
    let extract = this.subsetData(d.name, klc);
    let idScan = this.pickAnchor(d.name, extract);
    if (idScan.idAnchor !== null) {
      result.push(d);
      result[i].idAnchor = idScan.idAnchor;
      result[i].idOther = idScan.idOther;
      i += 1;
    };
  });
  return result;
};

// Function to save a ZIP file
function saveZip(fileDetails, zipName) {
  let zip = new JSZip();
  fileDetails.map(f => {
    zip.file(f.fileName, f.content, {base64: false});
  });
  zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9
    }
  }).then(c => {
    saveAs(c, zipName);
  });
};

// Initialise the table
makeTable("uploadStatus");

// Get the ZIP contents
let zip = API.getData("inputZip").file.content;
addRow(["Retrieved raw ZIP data", (Date.now() - t0) / 1000]);

// Get the contents of the ZIP
let zipContent = await unzip(zip);
addRow(["Unzipped file", (Date.now() - t0) / 1000]);

// Parse KEGG List Compound
let klc = JSON.parse(zipContent.keggListCompound);
addRow(["Parsed KLC", (Date.now() - t0) / 1000]);

// Parse KEGG Reaction equations
let kre = JSON.parse(zipContent.keggReactionEquation);
addRow(["Parsed KRE", (Date.now() - t0) / 1000]);

// Get reduced literature information
let rli = bg.reduceUniqueNames(
  bg.cleanNames(
    bg.convRawTsvJson(
      zipContent.literature
    )
  )
);
addRow(["Prepared RLI", (Date.now() - t0) / 1000]);

// Get the data with ID
let withId = bg.getWithId(rli, klc);
API.createData("withId", withId);
addRow(["Found entries with ID", (Date.now() - t0) / 1000]);

// Get reduced opposing compounds
let opposeReduced = bg.reduceOppose(withId, bg.getOppose(withId, kre));
addRow(["Got reduced opposing compounds", (Date.now() - t0) / 1000]);

// Get visualisation data
let visData = bg.prepareVisData(withId, opposeReduced);
addRow(["Visualisation data prepared", (Date.now() - t0) / 1000]);

// Run the simulation
bg.runSimulation(visData, "svgVis");

/**
// Insert download button
let ust = document.getElementById("uploadStatus");
let button = document.createElement("button");

button.style.display = "block";
button.style.borderRadius = "0px";
button.innerHTML = "Download visData ZIP";

button.onclick = (() => {
  saveZip(
    [{
      fileName: "visData.json",
      content: JSON.stringify(visData)
    }],
    "visData.zip"
  );
});

ust.insertAdjacentElement("afterend", button);
ust.insertAdjacentElement("afterend", document.createElement("hr"));
**/
