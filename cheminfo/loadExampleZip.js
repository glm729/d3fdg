/** -- Operations -- **/

// Define styles for the button
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
  width: "144px"
};

// Create the button, assign the styles, give some text, and apply the onclick
let button = applyStyles(document.createElement("button"), buttonStyle);
button.innerHTML = "Run Example";
button.onclick = doThing;

// Find the sink, empty it, and append the button
let div = document.querySelector("#runExampleButton");
div.innerHTML = '';
div.appendChild(button);


/** -- Function definitions -- **/

// Helper function for applying a set of CSS attributes
function applyStyles(node, css) {
  for (let prop in css) node.style[prop] = css[prop];
  return node;
};

// Abstracted function for processing data attached to the view
function fetchCb0(attachments) {
  let name = "upload/inputZipCompressed.zip";
  return attachments.filter(a => a.filename === name)[0];
};

function fetchCb1(data) {
  fetch(data.url).then(r => r.arrayBuffer()).then(d => {
    API.createData("inputZip", d);
    button.style.borderColor = "#0f0";
  });
};

// Function to unzip a file, given an input arrayBuffer
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

// Do the thing!
function doThing() {
  button.style.borderColor = "#00f";
  let c = new CouchAttachments();
  c.fetchList().then(fetchCb0).then(fetchCb1);
};
