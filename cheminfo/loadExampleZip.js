function applyStyles(node, css) {
  for (let prop in css) node.style[prop] = css[prop];
};

function fetchCb(attachments) {
  let name = "upload/inputZipCompressed.zip";
  let file = attachments.filter(a => a.filename === name)[0];
  API.createData("exampleInputZip", file);
};

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

async function doThing() {
  let c = new CouchAttachments();
  await c.fetchList().then(fetchCb);
  let iz = API.getData("exampleInputZip");
  if (iz === null) {
    console.warn("Data not yet loaded, please wait.");
    return;
  };
  fetch(iz.url)
    .then(r => r.arrayBuffer())
    .then(d => {
      API.createData("inputZip", d);
    });
};

let buttonStyle = {
  "border-radius": "0px",
  display: "block",
  "font-family": "monospace",
  "font-size": "16px",
  height: "36px",
  "margin-left": "auto",
  "margin-right": "auto",
  "text-align": "center",
  padding: "4px 4px",
  width: "144px"
};

let button = document.createElement("button");
applyStyles(button, buttonStyle);
button.innerHTML = "Run Example";
button.onclick = doThing;

let div = document.querySelector("#runExampleButton");
div.innerHTML = '';
div.appendChild(button);
