// New version of node selection vis for specific case


/*** Function definitions ***/

// Helper function for applying a batch of styles to an element
function applyStyles(node, attr) {
  for (let p in attr) node.style[p] = attr[p];
};

// Default display of links
function showLinks(obj) {
  let attr = {opacity: 0.8, stroke: '#999'};
  obj.links.forEach(l => applyStyles(l.el, attr));
};

// Highlight links, but not hanging links
function highlightLinks(obj) {
  let attr = {opacity: 0.8, stroke: 'blue'};
  obj.links.forEach(l => {
    if (l.display) applyStyles(l.el, attr);
  });
};

// Hide links
function hideLinks(obj) {
  let attr = {opacity: 0.15 * 0.8, stroke: '#999'};
  obj.links.forEach(l => applyStyles(l.el, attr));
};

// Show a main node, but without highlight
function showMainNode(obj) {
  let attr = {opacity: 1, stroke: '#000'};
  applyStyles(obj.core.node, attr);
};

// Highlight a node's peripheral nodes
function highlightPeriNodes(obj) {
  let attr = {opacity: 1, stroke: 'blue'};
  obj.peri.nodes.forEach(n => applyStyles(n, attr));
};

// Highlight a main node
function highlightNode(obj) {
  let attr = {opacity: 1, stroke: 'blue'};
  applyStyles(obj.core.node, attr);
};

// Hide a main node
function hideNode(obj) {
  let attr = {opacity: 0.15, stroke: '#000'};
  applyStyles(obj.core.node, attr);
};

// Display the main text of highlighted node
function showMainText(obj) {
  let attr = {visibility: 'visible', 'font-weight': 'bold'};
  applyStyles(obj.core.text, attr);
};

// Show the peripheral text of a node
function showPeriText(obj) {
  let attr = {visibility: 'visible', 'font-weight': 'normal'};
  obj.peri.text.forEach(t => applyStyles(t, attr));
};

// Show a text element, but without highlight
function showText(obj) {
  let attr = {visibility: 'visible', 'font-weight': 'normal'};
  applyStyles(obj.core.text, attr);
};

// Hide a node's associated text -- this is the default state, currently
function hideText(obj) {
  let attr = {visibility: 'hidden', 'font-weight': 'normal'};
  applyStyles(obj.core.text, attr);
};

// Helper function to hide all elements
function hideAll(objArr) {
  objArr.forEach(obj => {
    hideLinks(obj);
    hideNode(obj);
    hideText(obj);
  });
};

// Helper function to reset all visualisation elements
function resetAll(objArr) {
  objArr.forEach(obj => {
    showLinks(obj);
    showMainNode(obj);
    hideText(obj);
  });
};

// Helper function to create arrays of DOM nodes, rather than collections,
// allowing for mapping, filtering, etc.
function getQueryAll(q) {
  let output = new Array();
  document.querySelectorAll(q).forEach(d => output.push(d));
  return output;
};

// Helper function to get all visualisation DOM elements
function getVisElementData() {
  return ({
    links: getQueryAll(".link"),
    nodes: getQueryAll(".node"),
    text: getQueryAll(".text")
  });
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
  obj.links = links.map(l => ({el: l}));
  // Get direct associations
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
  return obj;
};

// ChemInfo requirement!
// Resurrection may go wrong, which needs to be accounted for somehow.
function retrieveVisData() {
  // Initialise output and get the data
  let out = new Object();
  let data = API.getData('visData').resurrect();
  // Initialise nodes array and assign links
  out.nodes = new Array();
  out.links = data.links;
  // Get the keys of the node (all nodes have the same keys)
  let keys = Object.keys(data.nodes[0]);
  // For each node object
  data.nodes.forEach((n, i) => {
    // Initialise object to push to the results
    let c = new Object();
    // For each key
    keys.forEach(k => {
      // If the key exists and is not null
      if (n[k] !== undefined && n[k] !== null) {
        // Assign the zombie value if it exists, else assign the actual value
        c[k] = (n[k].s_ !== undefined) ? n[k].s_ : n[k];
      };
    });
    // Note the index
    c.index = i;
    // Push to the output
    out.nodes.push(c);
  });
  return out;
};

// Get the `display` attribute of a node's links
function linkDisplayAttr(nodes) {
  // Get the indices to exclude
  let excludeInd = nodes.filter(x => x.n < 2).map(x => x.index);
  // For each node
  nodes.forEach(node => {
    // For each associated link
    node.links.forEach(l => {
      // Get the element ID
      let id = l.el.getAttribute('id');
      // Initialise keep
      let keep = true;
      // Loop over the indices to exclude
      for (let i of excludeInd) {
        // If the links points to an excluded ID
        if (new RegExp(`_[ft]${i}_`).test(id)) {
          // Remove keep mark and break
          keep = false;
          break;
        };
      };
      // Display is whether or not the element is kept
      l.display = keep;
    });
  });
  return nodes;
};


/** Operations **/

// Get the visualisation elements data
let ved = getVisElementData();

// Retrieve the visualisation data from the API
let data = retrieveVisData();

// Get the selected names
let selection = API.getData('nodeSelection').resurrect().map(n => n.idAnchor);

// Special case for nodes -- whether links are displayed or not, after getting
// associated elements
let nodes = linkDisplayAttr(data.nodes.map(o => {
  let r = assocElements(ved, o);
  r.selected = (selection.indexOf(r.idAnchor) !== -1);
  return r;
}));

// Hide all vis DOM elements
hideAll(nodes);

// If anything is selected
if (selection.length > 0) {
  // Map once -- peripheral data
  nodes.map(obj => {
    if (obj.selected) {
      highlightLinks(obj);
      highlightPeriNodes(obj);
      showPeriText(obj);
    };
  });
  // Map twice -- core data
  nodes.map(obj => {
    if (obj.selected) {
      highlightNode(obj);
      showMainText(obj);
    };
  });
} else {
  // If nothing selected, reset everything
  resetAll(nodes);
};
