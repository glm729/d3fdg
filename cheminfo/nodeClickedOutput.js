/* Function definitions */


function divTable() {
  let table = document.createElement("div");
  table.setAttribute("class", "table");
  table.style.display = "table";
  return table;
};

function divRow() {
  let row = document.createElement("div");
  row.setAttribute("class", "table-row");
  row.style.display = "table-row";
  return row;
};

function divRowHeader() {
  let row = divRow();
  row.style.fontWeight = "bold";
  row.style.borderBottom = "1px solid black";
  return row;
};

function divCell() {
  let cell = document.createElement("div");
  cell.setAttribute("class", "table-cell");
  cell.style.display = "table-cell";
  cell.style.padding = "2px 4px";
  return cell;
};

function divCellTitle(text) {
  let cell = divCell();
  cell.style.borderRight = "1px solid black";
  if (text !== undefined) cell.innerHTML = text;
  return cell;
};

function multiRowDiv(table, title, content) {
  let rowFirst = divRow();
  let titleFirst = divCellTitle(title);
  let contentFirst = divCell(title);
  contentFirst.innerHTML = content[0];
  rowFirst.appendChild(titleFirst);
  rowFirst.appendChild(contentFirst);
  table.appendChild(rowFirst);
  content.slice(1).map(c => {
    let row = divRow();
    row.appendChild(divCellTitle());
    let cell = divCell();
    cell.innerHTML = c;
    row.appendChild(cell);
    table.appendChild(row);
  });
  return;
};

function singleRowDiv(table, title, content) {
  let row = divRow();
  row.appendChild(divCellTitle(title));
  if (typeof(content) === "object") {
    content.map(c => {
      let cell = divCell();
      cell.innerHTML = c;
      row.appendChild(cell);
    });
    table.appendChild(row);
    return;
  };
  let cell = divCell();
  cell.innerHTML = content;
  row.appendChild(cell);
  table.appendChild(row);
  return;
};

function addRow(table, title, content) {
  if (content === null) {
    let row = divRow();
    row.appendChild(divCellTitle(title));
    row.appendChild(divCell());
    table.appendChild(row);
    return;
  };
  if (typeof(content) === "object" && content.length > 1) {
    multiRowDiv(table, title, content);
    return;
  };
  singleRowDiv(table, title, content);
  return;
};


// Get node clicked data
let nc = API.getData("nodeLast").resurrect();

// Get output container
let container = document.getElementById("nodeClickedContent");

// Reset the innerHTML on each click
container.innerHTML = '';

// Initialise the table
let table = divTable();

// Add a header row
let header = divRowHeader();

["Attribute", "Content"].map(c => {
  let cell = divCell();
  cell.innerHTML = c;
  header.appendChild(cell);
});

table.appendChild(header);

// Add rows to the table
let reg = [...new Set(nc.regulation)];

let add = [
  {
    title: "Name",
    content: nc.name
  },
  {
    title: "Anchor ID",
    content: nc.idAnchor
  },
  {
    title: "Other IDs",
    content: nc.idOther
  },
  {
    title: "Biofluid",
    content: [...new Set(nc.biofluid.filter(x => x !== ''))].sort()
  },
  {
    title: "Regulation",
    content: (reg.length === 1) ? reg[0] : "conflict"
  },
  {
    title: "Times reported",
    content: nc.timesReported
  },
  {
    title: "DOI",
    content: [...new Set(nc.doi)].sort()
  }
];

add.map(a => addRow(table, a.title, a.content));

// Append the table to the container
container.appendChild(table);
