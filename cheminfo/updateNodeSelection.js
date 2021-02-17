// Helper function to apply styles
function applyStyles(domnode, css) {
  for (let prop in css) {
    domnode.style[prop] = css[prop];
  };
};

// Show links by entry
function showLinks(obj) {
  let css = {opacity: 0.8, stroke: "blue"};
  obj.links.map(l => applyStyles(l, css));
};

// Style for hidden links
function hideLinks(obj) {
  let css = {opacity: 0.15 * 0.8, stroke: "#999"};
  obj.links.map(l => applyStyles(l, css));
};

// Reset styles, if wanted
function resetLinks(obj) {
  let css = {opacity: 0.8, stroke: "#999"};
  obj.links.map(l => applyStyles(l, css));
};

// Show main node by entry
function showMainNode(obj) {
  let css = {
    opacity: 1,
    stroke: "blue",
    fill: (obj.nodeColour) ? obj.nodeColour : "red"
  };
  applyStyles(obj.core.node, css);
  obj.core.node.setAttribute("r", (obj.nodeSize) ? obj.nodeSize : 5);
};

// Style for shown nodes
function showNode(obj) {
  let css = {opacity: 1, stroke: "blue", fill: "grey"};
  applyStyles(obj.core.node, css);
  obj.core.node.setAttribute("r", 5);
};

function showPeriNodes(obj) {
  let css = {opacity: 1, stroke: "blue", fill: "grey"};
  obj.peri.nodes.map(n => {
    applyStyles(n, css);
    n.setAttribute("r", 5);
  });
};

function showPeriText(obj) {
  let css = {visibility: "visible", "font-weight": "normal"};
  obj.peri.text.map(n => applyStyles(n, css));
};

// Style for hidden nodes
function hideNode(obj) {
  let css = {opacity: 0.15, stroke: "black", fill: "grey"};
  applyStyles(obj.core.node, css);
  obj.core.node.setAttribute("r", 5);
};

// Reset styles, if wanted
function resetNode(obj) {
  let css = {opacity: 1, stroke: "black", fill: "grey"};
  applyStyles(obj.core.node, css);
  obj.core.node.setAttribute("r", 5);
};

// Style for main text
function showMainText(obj) {
  let css = {visibility: "visible", "font-weight": "bold"};
  applyStyles(obj.core.text, css);
};

// Style for non-core text
function showText(obj) {
  let css = {visibility: "visible", "font-weight": "normal"};
  applyStyles(obj.core.text, css);
};

// Style for hidden text
function hideText(obj) {
  let css = {visibility: "hidden", "font-weight": "normal"};
  applyStyles(obj.core.text, css);
};  // No need for a reset function here

// Hide all visualisation elements
function hideAll() {
  objArr.map(obj => {
    hideLinks(obj);
    hideNode(obj);
    hideText(obj);
  })
};

// Reset all visualisation elements
function resetAll() {
  objArr.map(obj => {
    resetLinks(obj);
    resetNode(obj);
    hideText(obj);
  });
};

// Helper function to create arrays of DOM nodes, rather than collections
function getQueryAll(q) {
  let output = new Array();
  document.querySelectorAll(q).forEach(d => output.push(d));
  return output;
};

// Helper function to get all visualisation DOM elements
function getVisElementData() {
  let dom = {
    links: getQueryAll(".link"),
    nodes: getQueryAll(".node"),
    text: getQueryAll(".text")
  };
  return dom;
};

// Function to mutate current entry to get associated DOM elements
function assocElements(dom, obj) {
  // Initialise core and peri in the object
  obj.core = new Object();
  obj.peri = new Object();
  // Store associated links
  let links = dom.links.filter(d => {
    return new RegExp(`_[ft]${obj.index}_`, "g").test(d.getAttribute("id"));
  });
  // Get direct associations
  obj.links = links;
  obj.core.node = dom.nodes.filter(d => {
    return d.getAttribute("id") === `node${obj.index}`;
  })[0];
  obj.core.text = dom.text.filter(d => {
    return d.getAttribute("id") === `text${obj.index}`;
  })[0];
  // Get peripheral associations
  let rex = /(?<=_[ft])(\d+)(?=_)/g;
  let periSelf = links.map(d => d.getAttribute("id").match(rex)).flat();
  let peri = [...new Set(periSelf)].filter(x => x !== obj.index.toString());
  obj.peri.nodes = peri.map(i => dom.nodes[+i]);
  obj.peri.text = peri.map(i => dom.text[+i]);
};

// Retrieve the visualisation data from the API
let data = API.getData("visData").resurrect();

// Get the list of node names
let nodeList = data.nodes.map(d => {
  if (d.name.s_) return d.name.s_;
  return d.name;
});

// Get the visualisation elements data
let ved = getVisElementData();

// Get the selected names
let selection = API.getData("nodeSelection").resurrect();
let selectionNames = selection.map(d => d.name);

// Initialise object array
let objArr = nodeList.map((n, i) => ({name: n, index: i}));

// Get associated DOM elements and whether node selected
objArr.map(o => {
  assocElements(ved, o);
  let i = selectionNames.indexOf(o.name);
  o.selected = (i !== -1);
  if (o.selected) {
    o.nodeColour = selection[i].nodeColour;
    o.nodeSize = selection[i].nodeSize;
  };
});

window._oj = objArr;

// Hide all vis DOM elements
hideAll();

if (selection.length > 0) {
  // Map once -- peripheral data
  objArr.map(obj => {
    if (obj.selected) {
      showLinks(obj);
      showPeriNodes(obj);
      showPeriText(obj);
    };
  });
  // Map twice -- core data
  objArr.map(obj => {
    if (obj.selected) {
      showMainNode(obj);
      showMainText(obj);
    };
  });
} else {
  // If nothing selected, reset everything
  resetAll();
};
