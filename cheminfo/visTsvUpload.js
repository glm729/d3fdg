// Assign an empty header to a JSON if no header is available
function assignEmptyHeader(ofLength) {
  let result = [];
  for (let i = 0; i < ofLength; ++i) {
    result.push(`v${String(i).padStart(String(ofLength).length, '0')}`);
  };
  return result;
};

// Convert a raw TSV into a JSON
function convRawTsvJson(raw, header = true) {
  let result = [];
  let head;
  let split = raw
    .replace(/\n$/, '')
    .split(/\n/)
    .map(x => x.replace(/\r/g, '').split(/\t/));
  head = header ? split.shift() : assignEmptyHeader(split[0].length);
  for (let s = 0; s < split.length; ++s) {
    result.push(new Object());
    for (let h = 0; h < head.length; ++h) {
      result[s][head[h]] = split[s][h];
    };
  };
  return result;
};

// Get the data and convert to JSON
let input = API.getData("visTsvContent");
let data = convRawTsvJson(input)

// Save it as the new node selection
API.createData("nodeSelection", data);
