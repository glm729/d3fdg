// Shorthand function to apply styles
function applyStyles(domnode, css) {
  for (let prop in css) domnode.style[prop] = css[prop];
};

// Get the names from the current node selection
let names = API.getData("nodeSelection").resurrect().map(x => x.name);

// Find and empty the sink
let sink = document.getElementById("rowVisTempSink");
sink.innerHTML = '';

if (names.length > 0) {
  let button = document.createElement("button");
  let css = {
    borderRadius: "0px",
    display: "block",
    fontFamily: "monospace",
    fontSize: "10px",
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    padding: "4px 4px",
    width: "100%"
  };
  applyStyles(button, css);
  button.innerHTML = "Download visualisation parameter template";
  let tmp = "name\tcolour\tsize\n";
  names.map(n => tmp += `${n}\t\t\t\n`);
  let file = new File(
    [tmp],
    {type: "text/tab-separated-values;charset=utf-8"}
  );
  button.onclick = (() => saveAs(file, "nodeVisTemplate.tsv"));
  sink.appendChild(button);
};
