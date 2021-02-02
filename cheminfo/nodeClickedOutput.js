// Get the info on the clicked node
let nc = API.getData("nodeClicked").resurrect()[0];

// Get the container for the output
let container = document.getElementById("nodeClickedContent");

// Refresh innerHTML of the container on each new node
container.innerHTML = '';

// Initialise the table
let table = document.createElement("div");
table.setAttribute("id", "nodeClickedTable");
table.style.display = "table";

// Helper function for adding a table row
function addRow(table, content) {
  let row = document.createElement("div");
  row.style.display = "table-row";
  content.map(c => {
    let cell = document.createElement("div");
    cell.style.display = "table-cell";
    cell.style.paddingLeft = "6px";
    cell.style.paddingRight = "6px";
    if (c === content[0]) cell.style.borderRight = "solid 1px black";
    cell.innerHTML = c;
    row.appendChild(cell);
  });
  table.appendChild(row);
};

// Initialise a header row for the table
let header = document.createElement("div");
header.style.display = "table-row";
header.style.paddingBottom = "6px";
header.style.borderBottom = "solid 1px black";

// Assign the contents of the header row
["Attribute", "Content"].map(c => {
  let cell = document.createElement("div");
  cell.style.display = "table-cell";
  cell.style.fontWeight = "bold";
  cell.style.paddingLeft = "6px";
  cell.style.paddingRight = "6px";
  if (c === "Attribute") cell.style.borderRight = "solid 1px black";
  cell.innerHTML = c;
  header.appendChild(cell);
});

// Append the header to the table
table.appendChild(header);

// Add rows for the name and anchor ID
addRow(table, ["Name", nc.name]);
addRow(table, ["Anchor ID", nc.idAnchor]);

// Assign contents for the other IDs, if any
addRow(table, ["Other IDs", (!nc.idOther) ? '' : nc.idOther.join(", ")]);

// Assign contents for regulation:
// - If regulation is unique, assign that
// - If regulation is not unique, note conflict
let reg = [...new Set(nc.regulation)];
addRow(table, ["Regulation", (reg.length === 1) ? reg[0] : "conflict"]);

// Add a row for the number of times reported
addRow(table, ["Times reported", nc.timesReported]);

// Append the completed table to the container
container.appendChild(table);
