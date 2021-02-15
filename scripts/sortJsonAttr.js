/**
 * A function for sorting an array of Objects by one specific attribute.
 * @param {Array} obj Array of Objects to sort
 * @param {String} key Key by which to sort `obj`
 * @return {Array} The input Array of Objects, sorted by the specified
 * attribute
 */
function sortJsonAttr(obj, key = "name") {
  let output = new Array();
  [...new Set(obj.map(o => o[key]))].sort().map(j => {
    obj.filter(o => o[key] === j).map(o => output.push(o));
  });
  return output;
};
