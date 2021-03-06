// NOTE:
// This Object was automatically generated by an external Ruby script.
// Caution is advised if modifying the contents.
let functions = {
  arrayScale: function(arr, min = 0, max = 1) {
    let f = {
      min: (a) => a.reduce((b, c) => ((b > c) ? c : b), a[0]),
      max: (a) => a.reduce((b, c) => ((b > c) ? b : c), a[0])
    };
    let obsMin = f.min(arr);
    let obsMax = f.max(arr);
    return arr.slice().map(a => {
      return (a - obsMin) * (max - min) / (obsMax - obsMin) + min;
    });
  },
  assignEmptyHeader: function(ofLength) {
    let result = [];
    for (let i = 0; i < ofLength; ++i) {
      result.push("v" + String(i).padStart(String(ofLength).length, "0"));
    };
    return result;
  },
  cleanNames: function(data, key = "name") {
    let result = [];
    let i = 0;
    data.map(d => {
      let keys = Object.keys(d).filter(x => x !== key);
      let nameClean = d[key]
        .toLowerCase()
        .replace(/\**( \(.+)?$/, '')
        .replace(/(ate|ic acid)$/, "ate");
      if (nameClean.match(/[\/\+]/) !== null) {
        let nameCleanMany = nameClean.split(/[\/\+]/).map(x => {
          return x.replace(/^\s+|\s+$/g, '');
        });
        nameCleanMany.map(x => {
          result.push(new Object());
          result[i][key] = x;
          keys.map(k => result[i][k] = d[k]);
          i += 1;
        });
      } else {
        result.push(new Object());
        result[i][key] = nameClean;
        keys.map(k => result[i][k] = d[k]);
        i += 1;
      };
    });
    return result;
  },
  convKeggListCompound: function(raw) {
    let data = raw.replace(/\n$/, '').split(/\n/).map(r => r.split(/\t/));
    return data.map(d => {
      return {
        "idKegg": d[0].replace(/^cpd:/, ''),
        "nameKegg": d[1].split(/; /).map(n => n.toLowerCase())
      };
    });
  },
  convKeggReactionEquation: function(raw) {
    let result = [];
    let data = this.convRawTsvJson(raw, header = true);
    data.map(d => {
      let s = d.equation.split(/>/).map(x => x.match(/C\d{5}/g));
      d.lhs = (s[0] === null) ? [null] : s[0];
      d.rhs = (s[1] === null) ? [null] : s[1];
    });
    return data;
  },
  convRawTsvJson: function(raw, header = true) {
    let result = [];
    let head;
    let split = raw
      .replace(/\n$/, '')
      .split(/\n/)
      .map(x => x.replace(/\r/g, '').split(/\t/));
    head = header ? split.shift() : this.assignEmptyHeader(split[0].length);
    for (let s = 0; s < split.length; ++s) {
      result.push(new Object());
      for (let h = 0; h < head.length; ++h) {
        result[s][head[h]] = split[s][h];
      };
    };
    return result;
  },
  getOppose: function(withId, kre) {
    let out = [];
    let idAll = [];
    withId.map(w => {
      if (idAll.indexOf(w.idAnchor) === -1) idAll.push(w.idAnchor);
      if (w.idOther !== null) {
        w.idOther.map(o => {if (idAll.indexOf(o) === -1) {idAll.push(o)}});
      };
    });
    let idUniq = [...new Set(idAll)];
    kre.map(k => {
      let lhsIn = k.lhs.filter(l => idUniq.indexOf(l) !== -1);
      if (lhsIn.length === 0) return;
      let rhsIn = k.rhs.filter(r => idUniq.indexOf(r) !== -1);
      if (rhsIn.length === 0) return;
      lhsIn.map(l => {rhsIn.map(r => {out.push({"lhs": l, "rhs": r})})});
    });
    return out;
  },
  getWithId: function(data, klc) {
    let result = [];
    let i = 0;
    data.map(d => {
      let extract = this.subsetData(d.name, klc);
      let idScan = this.pickAnchor(d.name, extract);
      if (idScan.idAnchor !== null) {
        result.push(d);
        result[i].idAnchor = idScan.idAnchor;
        result[i].idOther = idScan.idOther;
        i += 1;
      };
    });
    return result;
  },
  getWithLinks: function(withId, opposeReduced) {
    let idAll = opposeReduced.map(x => [x.lhs, x.rhs]).flat();
    return withId.filter(x => idAll.indexOf(x.idAnchor) !== -1);
  },
  nameInKegg: function(data, klc) {
    data.map(d => {
      let extract = this.subsetData(d.name, klc);
      let idScan = this.pickAnchor(d.name, extract);
      d.idAnchor = idScan.idAnchor;
      d.idOther = idScan.idOther;
    });
  },
  pickAnchor: function(name, keggExtract) {
    let ida = null;
    let ido = [];
    let pat = {};
    let match = {"e": [], "l": [], "d": []};
    let patB = name.replace(/(ate|ic acid)$/, "(ate|ic acid)");
    pat.e = new RegExp("^" + patB + "$", "gi");
    pat.l = new RegExp("^l-" + patB + "$", "gi");
    pat.d = new RegExp("^d-" + patB + "$", "gi");
    keggExtract.map(k => {
      k.matchName.map(n => {
        if (n.match(pat.e) !== null) match.e.push(k.idKegg);
        if (n.match(pat.l) !== null) match.l.push(k.idKegg);
        if (n.match(pat.d) !== null) match.d.push(k.idKegg);
      });
    });
    if (match.e.length > 0) {
      if (match.e.length > 1) {
        let idt = match.e.sort();
        ida = idt.shift();
        idt.map(i => ido.push(i));
      } else {
        ida = match.e[0];
      };
    };
    if (match.l.length > 0) {
      if (ida === null) {
        if (match.l.length > 1) {
          let idt = match.l.sort();
          ida = idt.shift();
          idt.map(i => ido.push(i));
        } else {
          ida = match.l[0];
        };
      } else {
        match.l.map(m => ido.push(m));
      };
    };
    if (match.d.length > 0) {
      if (ida === null) {
        if (match.d.length > 1) {
          let idt = match.d.sort();
          ida = idt.shift();
          idt.map(i => ido.push(i));
        } else {
          ida = match.d[0];
        };
      } else {
        match.d.map(m => ido.push(m));
      };
    };
    while (ido.includes(ida)) ido.pop(ido.indexOf(ida));
    if (ido.length === 0) ido = null;
    return {"name": name, "idAnchor": ida, "idOther": ido};
  },
  reduceOppose: function(withId, oppose) {
    let result = [];
    oppose.map(o => {
      withId.map(w => {
        if (w.idOther === null) return;
        if (w.idOther.indexOf(o.lhs) !== -1) o.lhs = w.idAnchor;
        if (w.idOther.indexOf(o.rhs) !== -1) o.rhs = w.idAnchor;
      });
      if (o.lhs === o.rhs) return;
      let isPresent = false;
      result.map(r => {
        if (r.lhs === o.lhs && r.rhs === o.rhs) isPresent = true;
        if (r.rhs === o.lhs && r.lhs === o.rhs) isPresent = true;
        if (isPresent) return;
      })
      if (!isPresent) result.push(o);
    });
    return result;
  },
  reduceUniqueNames: function(data, key = "name") {
    let result = [];
    let nameUniq = [];
    data.map(d => {
      let keys = Object.keys(d).filter(x => x !== key);
      d[key] = d[key].toLowerCase();
      if (nameUniq.indexOf(d[key]) === -1) {
        nameUniq.push(d[key]);
        result.push(new Object());
        let i = nameUniq.indexOf(d[key]);
        result[i][key] = d[key];
        result[i].timesReported = 1;
        keys.map(k => {
          result[i][k] = [];
          result[i][k].push(d[k]);
        });
      } else {
        let i = nameUniq.indexOf(d[key]);
        result[i].timesReported += 1;
        keys.map(k => result[i][k].push(d[k]));
      };
    });
    return result;
  },
  runSimulation: function(data, idSvg = "svgGraph") {
    function colourNodeRegulation(d, i) {
      let col = null;
      let reg = [...new Set(d.regulation)];
      if (reg.length > 1) return "cyan";
      if (reg[0] === "increased") return "red";
      if (reg[0] === "decreased") return "green";
      return "cyan";
    };
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
    function genTranslate(a, b) {
      return `translate(${a}, ${b})`;
    };
    function isConnected(a, b) {
      let check1 = indexLink[`${a.index}|${b.index}`];
      let check2 = indexLink[`${b.index}|${a.index}`];
      return (check1 || check2);
    };
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
    function simulationTick() {
      link
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y);
      node.attr("transform", d => genTranslate(d.x, d.y));
      text.attr("transform", d => genTranslate(d.x + 6, d.y + 2.5));
    };
    function zoomed({transform}) {
      g.attr("transform", transform);
    };
    let opacity = 0.33;
    let indexLink = new Object();
    let svgElement = document.getElementById(idSvg);
    let width = svgElement.width.baseVal.value;
    let height = svgElement.height.baseVal.value;
    let svg = d3.select(`#${idSvg}`)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
    let g = svg.append("g")
      .attr("cursor", "move");
    let nodes = data.nodes.map(d => Object.create(d));
    let links = data.links.map(d => Object.create(d));
    let simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.idAnchor).iterations(2))
      .force("charge", d3.forceManyBody().strength(-110))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("collide", d3.forceCollide().radius(5).iterations(2));
    let link = g.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.7)
        .attr("pointer-events", "none")
        .attr("cursor", "move")
      .selectAll(".link")
      .data(links)
      .join("line")
        .attr("stroke-width", 1)
        .attr("class", "link")
        .attr("id", (d, i) => `link_f${d.source.index}_t${d.target.index}_`);
    let node = g.append("g")
        .attr("stroke", "black")
        .attr("stroke-width", 1.2)
        .attr("cursor", "pointer")
      .selectAll(".node")
      .data(nodes)
      .join("circle")
        .attr("r", 5)
        .attr("fill", "grey")
        .attr("class", "node")
        .attr("id", (d, i) => `node${i}`)
        .call(drag(simulation));
    let text = g.append("g")
        .attr("visibility", "hidden")
        .attr("pointer-events", "none")
        .attr("font-size", "7px")
        .attr("text-anchor", "start")
      .selectAll(".text")
      .data(nodes)
      .join("text")
        .text(d => d.name)
        .attr("class", "text")
        .attr("id", (d, i) => `text${i}`);
    svg
      .call(
        d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([1 / 2, 8])
          .on("zoom", zoomed)
      );
    links.map(l => indexLink[`${l.source.index}|${l.target.index}`] = true);
    function nodeClick(d, i) {
      let tmp = API.getData("withLinks").resurrect().filter(x => {
        return x.name === nodes[i.index].name;
      })[0];
      API.createData("nodeClicked", tmp);
    };
    // node
      // .on("click", (d, i) => nodeClick(d, i));
      // .on("mouseover", (d, i) => nodeMouseOver(d, i))
      // .on("mouseout", (d, i) => nodeMouseOut(d, i))
    simulation.on("tick", simulationTick);
  },
  sortJsonAttr: function(obj, key = "name") {
    let output = new Array();
    [...new Set(obj.map(o => o[key]))].sort().map(j => {
      obj.filter(o => o[key] === j).map(o => output.push(o));
    });
    return output;
  },
  subsetData: function(name, keggData) {
    let nPat = name.replace(/(ate|ic acid)$/, "(ate|ic acid)");
    let nRex = new RegExp("^([dl]-)?" + nPat + "$", "gi");
    return keggData.map(k => {
      let anyMatch = k.nameKegg.filter(n => nRex.test(n))
      if (anyMatch.length === 0) return;
      return {"idKegg": k.idKegg, "matchName": anyMatch};
    }).filter(x => x !== undefined);
  },
  unzip: async function(content) {
    let jsz = new JSZip();
    let zip = await jsz.loadAsync(content);
    let results = {};
    for (let k in zip.files) {
      let fileContent = await zip.files[k].async("string");
      results[k.replace(/\..+$/, '')] = fileContent;
    };
    return results;
  }
}

// Cache in the API as "bg"
API.cache("bg", functions);
console.log("Cached BG functions.");
