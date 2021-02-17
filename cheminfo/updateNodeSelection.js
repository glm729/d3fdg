// Retrieve the data from the API
let data = API.getData("visData").resurrect();
let selection = API.getData("nodeSelection").resurrect().map(d => d.name);

// Store the node names list
let nodeList = data.nodes.map(d => {
  if (d.name.s_ !== undefined) return d.name.s_;
  return d.name;
});

// Get DOM elements
let nodes = document.querySelectorAll(".node");
let text = document.querySelectorAll(".text");
let links = document.querySelectorAll(".link");

// Get selected node indices
let selected = nodeList.map((d, i) => {
  if (selection.indexOf(d) !== -1) return i;
}).filter(x => x !== undefined);

// Get all link DOM elements by node index
function indexLinks(index, links) {
  let rex = new RegExp(`_[ft]${index}_`);
  let output = new Array();
  links.forEach((d, i) => {
    if (d.getAttribute("id").match(rex) !== null) output.push(d);
  });
  return output;
};

// Style for shown links
function showLink(lnode) {
  lnode.style["opacity"] = 0.8;
  lnode.style["stroke"] = "blue";
};

// Style for hidden links
function hideLink(lnode) {
  lnode.style["opacity"] = 0.33 * 0.8;
  lnode.style["stroke"] = "#999";
};

// Reset styles, if wanted
function resetLink(lnode) {
  lnode.style["opacity"] = 0.8;
  lnode.style["stroke"] = "#999";
};

// Style for shown nodes
function showNode(nnode) {
  nnode.style["opacity"] = 1;
  nnode.style["stroke"] = "blue";
};

// Style for hidden nodes
function hideNode(nnode) {
  nnode.style["opacity"] = 0.33;
  nnode.style["stroke"] = "black";
};

// Reset styles, if wanted
function resetNode(nnode) {
  nnode.style["opacity"] = 1;
  nnode.style["stroke"] = "black";
};

// Style for shown text
function showMainText(tnode) {
  tnode.style["visibility"] = "visible";
  tnode.style["font-weight"] = "bold";
};

function showText(tnode) {
  tnode.style["visibility"] = "visible";
  tnode.style["font-weight"] = "normal";
};

// Style for hidden text
function hideText(tnode) {
  tnode.style["visibility"] = "hidden";
  tnode.style["font-weight"] = "normal";
};
// No need for a reset function here

// Hide all visualisation elements
function hideAll() {
  nodes.forEach(d => hideNode(d));
  text.forEach(d => hideText(d));
  links.forEach(d => hideLink(d));
};

function periNodeText(i, indexLinks, obj) {
  let linkIds = indexLinks.map(d => d.getAttribute("id"));
  let linkInd = linkIds.map(l => l.match(/(?<=_[ft])\d+(?=_)/g)).flat();
  let nodeInd = [...new Set(linkInd)]
  let nodeIndFilter = nodeInd.filter(l => l !== i.toString()).sort();
  return nodeIndFilter.map(i => obj[i]);
};

// Hide everything
hideAll();

// Map over the selected nodes and display
selected.map(i => {
  let il = indexLinks(i, links);
  il.map(j => showLink(j));
  periNodeText(i, il, text).map(j => showText(j));
  periNodeText(i, il, nodes).map(j => showNode(j));
  showMainText(text[i]);
  showNode(nodes[i]);
});
