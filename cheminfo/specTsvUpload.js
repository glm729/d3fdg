/*** Operations ***/

let dyno = document.querySelector('#dyno');

let tsvContent = API.getData('tsvContent').resurrect();

let ca = new CouchAttachments();

dyno.innerHTML = 'Fetching attachment data, please wait....';
ca.fetchList().then(flThen0).then(d => flThen1(tsvContent, d));


/*** Function definitions ***/

async function flThen0(attachments) {
  let data = new Object();
  let names = ['klc', 'kre'].map(n => `upload/${n}.json`);
  let files = attachments.filter(a => names.indexOf(a.filename) !== -1);
  for await (let f of files) {
    let name = f.filename.match(/\/(?<n>\w+)\./).groups.n;
    await fetch(f.url).then(r => r.json()).then(d => data[name] = d);
  };
  dyno.innerHTML = 'Attachments loaded, processing data....';
  return data;
};

function flThen1(tsvContent, data) {
  let klc = data.klc;
  let kre = data.kre;
  let rli = cleanNames(convRawTsvJson(tsvContent));
  let withId = getWithId(rli, klc);
  let sl = shortlistReactions(withId, kre);
  let sls = swapOtherIds(withId, sl);
  let slr = reduceShortlist(sls);
  let allCompounds = getAllCompounds(withId, slr);
  allCompounds = allCompounds.map(a => numLinks(a, slr));
  allCompounds.forEach(a => {
    if (!a.nodeCore) {
      let d = klc.filter(k => k.idKegg === a.idAnchor)[0];
      a.name = pickShortest(d.nameKegg);
    };
  });
  let links = slr.map(s => ({source: s.lhs, target: s.rhs}));
  let visData = {nodes: allCompounds, links: links};
  API.createData('allCompounds', allCompounds);
  API.createData('visData', visData);
  function cb_text(d, i) {
    if (d.n < 2) return '';
    return d.name;
  };
  dyno.innerHTML = 'Attachments loaded and data processed.';
  runSimulation(
    visData,
    'svgVisMain',
    {
      cb_nodeColour: cb_nodeColour,
      cb_nodeSize: cb_nodeSize,
      cb_text: cb_text
    }
  );
};

function cb_nodeColour(d, i) {
  return d.nodeColour;
};

function cb_nodeSize(d, i) {
  if (d.nodeCore) return d.nodeSize;
  if (d.n < 2) return 0;
  return 5;
};

function pickShortest(arr) {
  let srt = arr.slice().sort();
  return srt.reduce((f, n) => {
    if (n.length < f.length) return n;
    return f;
  }, srt[0]);
};

function numLinks(obj, slr) {
  let n = 0;
  slr.forEach(e => {
    if (e.lhs === obj.idAnchor || e.rhs === obj.idAnchor) n += 1;
  });
  obj.n = n
  return obj;
};

function trimCompounds(ac, trim) {
  return ac.filter(a => trim.indexOf(a.idAnchor) === -1);
};
