// Helper function to apply styles
function applyStyles(domnode, css) {
  for (let prop in css) domnode.style[prop] = css[prop];
};

// Find and empty the sink
let sink = document.getElementById("exampleSelection");
sink.innerHTML = '';

let buttonStyle = {
  "border-radius": "0px",
  display: "block",
  "font-family": "monospace",
  "font-size": "14px",
  height: "36px",
  "margin-left": "0px",
  "margin-right": "auto",
  "text-align": "center",
  padding: "4px 4px",
  width: "210px"
};
let button = document.createElement("button");
applyStyles(button, buttonStyle);

button.innerHTML = "Use example selection";

button.onclick = buttonCb;

function buttonCb() {
  function fetchCb(att) {
    let name = "upload/testTsv.tsv";
    let file = att.filter(a => a.filename === name)[0];
    API.createData("exampleVisTsvContent", file);
  };
  async function doThing() {
    let c = new CouchAttachments();
    await c.fetchList().then(fetchCb);
    let vt = API.getData("exampleVisTsvContent");
    if (vt === null) {
      console.warn("Data not yet loaded, please wait.");
      return;
    };
    fetch(vt.url)
      .then(r => r.text())
      .then(d => API.createData("visTsvContent", d));
  };
  doThing();
};

sink.appendChild(button);
