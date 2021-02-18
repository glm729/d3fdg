// Helper function to apply styles
function applyStyles(domnode, css) {
  for (let prop in css) domnode.style[prop] = css[prop];
};

// Define the button onclick function
function buttonCb() {
  // Fetch callback
  function fetchCb(att) {
    let name = "upload/testTsv.tsv";
    let file = att.filter(a => a.filename === name)[0];
    API.createData("exampleVisTsvContent", file);
  };
  // The thing to do, but with async
  async function doThing() {
    let c = new CouchAttachments();
    await c.fetchList().then(fetchCb);
    let vt = API.getData("exampleVisTsvContent");
    if (vt === null) {
      alert("Data not yet loaded, please wait.");
      return;
    };
    fetch(vt.url)
      .then(r => r.text())
      .then(d => API.createData("visTsvContent", d));
  };
  // do.
  doThing();
};

// Assign button CSS attributes
let buttonStyle = {
  "border-radius": "0px",
  display: "block",
  "font-family": "monospace",
  "font-size": "14px",
  height: "40px",
  "margin-left": "auto",
  "margin-right": "auto",
  "text-align": "center",
  padding: "4px 4px",
  width: "100%"
};

// Create the button and apply CSS
let button = document.createElement("button");
applyStyles(button, buttonStyle);

// Give the button some text
button.innerHTML = "Use example selection";

// Assign the onclick callback
button.onclick = buttonCb;

// Find and empty the sink
let sink = document.getElementById("exampleSelection");
sink.innerHTML = '';

// Append the button to the sink
sink.appendChild(button);
