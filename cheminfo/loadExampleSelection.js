/** -- Operations -- **/

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
let button = applyStyles(document.createElement("button"), buttonStyle);

// Give the button some text and assign the onclick callback
button.innerHTML = "Use example selection";
button.onclick = doThing;

// Find and empty the sink, then append the button
let sink = document.querySelector("#exampleSelection");
sink.innerHTML = '';
sink.appendChild(button);


/** -- Function definitions -- **/

// Helper function to apply styles
function applyStyles(domnode, css) {
  for (let prop in css) domnode.style[prop] = css[prop];
  return domnode;
};

function fetchCb0(attachments) {
  let name = "upload/testTsv.tsv";
  return attachments.filter(a => a.filename === name)[0];
};

function fetchCb1(data) {
  fetch(data.url).then(r => r.text()).then(d => {
    API.createData("visTsvContent", d);
    button.style.borderColor = "#0f0";
  });
};

function doThing() {
  button.style.borderColor = "#00f";
  let c = new CouchAttachments();
  c.fetchList().then(fetchCb0).then(fetchCb1);
};
