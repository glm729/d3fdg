/**
 * Functionalised version of the tutorial provided by Mike Bostock, creator of
 * D3 and Observable, for force-directed graphs:
 * https://observablehq.com/@d3/disjoint-force-directed-graph
 *
 * - Refactored / Restructured considering its previous incarnation(s)
 *
 * @param {Object} data Input data for the simulation, containing the nodes and
 * links data.
 * @param {String} idSvg ID of the DOM node for the SVG.
 * @return N/A.  Runs FDG simulation.
 */
function runSimulation(data, idSvg = "svgGraph") {

  /*** Function definitions ***/

  function colourNodeRegulation(d, i) {
    let col = null;
    let reg = [...new Set(d.regulation)];
    if (reg.length > 1) return "cyan";
    if (reg[0] === "increased") return "red";
    if (reg[0] === "decreased") return "green";
    return "cyan";
  };

  // Define simulation drag actions
  function drag(sim) {
    function dragStart(e, d) {
      if (!e.active) sim.alphaTarget(0.4).restart();
      d.fx = d.x;
      d.fy = d.y;
    };
    function dragging(e, d) {
      d.fx = e.x;
      d.fy = e.y;
    };
    function dragEnd(e, d) {
      if (!e.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };
    return d3.drag()
      .on("start", dragStart)
      .on("drag", dragging)
      .on("end", dragEnd);
  };

  // Return generic translate string
  function genTranslate(a, b) {
    return `translate(${a}, ${b})`;
  };

  // Check if two nodes are connected
  function isConnected(a, b) {
    let check1 = indexLink[`${a.index}|${b.index}`];
    let check2 = indexLink[`${b.index}|${a.index}`];
    return (check1 || check2);
  };

  // Node mouseout operations
  function nodeMouseOut(d, i) {
    link
      .style("opacity", 0.7)
      .style("stroke", "#999");
    node
      .style("opacity", 1)
      .style("stroke", null);
    text
      .style("visibility", "hidden")
      .style("font-weight", "normal");
  };

  // Node mouseover operations
  function nodeMouseOver(d, i) {
    link
      .style("opacity", o => {
        let c1 = (o.source.index === i.index);
        let c2 = (o.target.index === i.index);
        return (c1 || c2) ? 0.7 : (opacity * 0.7);
      })
      .style("stroke", o => {
        let c1 = (o.source.index === i.index);
        let c2 = (o.target.index === i.index);
        return (c1 || c2) ? "blue" : "#999";
      });
    node
      .style("opacity", o => (isConnected(i, o) || i === o) ? 1 : opacity)
      .style("stroke", o => (isConnected(i, o) || i === o) ? "blue" : "black");
    text
      .style("visibility", o => {
        return (isConnected(i, o) || i === o) ? "visible" : "hidden";
      })
      .style("font-weight", o => (i === o) ? "bold" : "normal");
  };

  // Simulation tick operations
  function simulationTick() {
    link
      .attr("x1", d => d.source.x)
      .attr("x2", d => d.target.x)
      .attr("y1", d => d.source.y)
      .attr("y2", d => d.target.y);
    node.attr("transform", d => genTranslate(d.x, d.y));
    text.attr("transform", d => genTranslate(d.x + 6, d.y + 2.5));
    // ^ Text offset is currently hardcoded
  };

  // SVG zoom function
  function zoomed({transform}) {
    g.attr("transform", transform);
  };


  /*** Operations ***/

  // Initialise opacity and index links store
  let opacity = 0.33;
  let indexLink = new Object();

  // Initialise SVG in the document
  let svgElement = document.getElementById(idSvg);
  let width = svgElement.width.baseVal.value;
  let height = svgElement.height.baseVal.value;

  let svg = d3.select(`#${idSvg}`)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("cursor", "move");

  // Append group to the SVG (primarily for zoom)
  let g = svg.append("g")
    .attr("cursor", "grab");

  // Initialise nodes and links
  let nodes = data.nodes.map(d => Object.create(d));
  let links = data.links.map(d => Object.create(d));

  // Assign the simulation
  let simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.idAnchor).iterations(2))
    .force("charge", d3.forceManyBody().strength(-110))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("collide", d3.forceCollide().radius(5).iterations(2));

  // Create the links
  let link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.7)
      .attr("pointer-events", "none")
    .selectAll(".link")
    .data(links)
    .join("line")
      .attr("stroke-width", 1);

  // Create the nodes
  let node = g.append("g")
      .attr("stroke", "black")
      .attr("stroke-width", 1.2)
    .selectAll(".node")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", (d, i) => colourNodeRegulation(d, i))
      .call(drag(simulation));

  // Create the labels
  let text = g.append("g")
      .attr("visibility", "hidden")
      .attr("pointer-events", "none")
      .attr("font-size", "7px")
      .attr("text-anchor", "start")
    .selectAll(".text")
    .data(nodes)
    .join("text")
      .text(d => d.name);

  // Call the zoom function on the SVG
  svg
    .call(
      d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1 / 2, 8])
        .on("zoom", zoomed)
    );

  // Find which nodes are linked
  links.map(l => indexLink[`${l.source.index}|${l.target.index}`] = true);

  // Assign node mouse functions
  node
    .on("mouseover", (d, i) => nodeMouseOver(d, i))
    .on("mouseout", (d, i) => nodeMouseOut(d, i));

  // Assign simulation tick operations
  simulation.on("tick", simulationTick);

}
