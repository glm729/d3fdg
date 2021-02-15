/**
 * Function for picking the anchor ID, given the literature name and an extract
 * of the KEGG Compound data found to match this name (which is provided by
 * `subsetData`).
 *
 * @param {String} name Compound name to search by.
 * @param {Array} Extract of KEGG data, from `subsetData`.
 * @return {Object} Data pertaining to the name found, the anchor or base ID,
 * and the other IDs that may be relevant (chiral isomers).
 */
function pickAnchor(name, keggExtract) {
  // Initialise anchor and other IDs
  let ida = null;
  let ido = [];
  // Initialise patterns and matches;
  let pat = {};
  let match = {"e": [], "l": [], "d": []};
  // Get the base pattern (make the end a bit more ambiguous)
  let patB = name.replace(/(ate|ic acid)$/, "(ate|ic acid)");
  // Assign the patterns -- exact, levo- prefix, and dextro- prefix
  pat.e = new RegExp("^" + patB + "$", "gi");
  pat.l = new RegExp("^l-" + patB + "$", "gi");
  pat.d = new RegExp("^d-" + patB + "$", "gi");
  // Get matches
  keggExtract.map(k => {
    k.matchName.map(n => {
      // Exact
      if (n.match(pat.e) !== null) match.e.push(k.idKegg);
      // Levo-
      if (n.match(pat.l) !== null) match.l.push(k.idKegg);
      // Dextro-
      if (n.match(pat.d) !== null) match.d.push(k.idKegg);
    });
  });
  // If any exact match
  if (match.e.length > 0) {
    // If more than one exact match
    if (match.e.length > 1) {
      // IDs total
      let idt = match.e.sort();
      // Anchor is the first ID, alphanumerically
      ida = idt.shift();
      // Assign the remainder to the other IDs
      idt.map(i => ido.push(i));
    } else {
      // Otherwise, if one match, it's the anchor (exact match)
      ida = match.e[0];
    };
  };
  // If any levo- match
  if (match.l.length > 0) {
    // If there isn't yet an anchor ID (no exact match)
    if (ida === null) {
      // If there's more than one levo- match
      if (match.l.length > 1) {
        // IDs total
        let idt = match.l.sort();
        // Anchor is the first after sorting
        ida = idt.shift();
        // Other IDs are the rest
        idt.map(i => ido.push(i));
      } else {
        // Otherwise the one ID found is the anchor
        ida = match.l[0];
      };
    } else {
      // If there's already an anchor, push the rest found as other IDs
      match.l.map(m => ido.push(m));
    };
  };
  // If any dextro- match
  if (match.d.length > 0) {
    // If no anchor ID yet (no exact match and no levo- match)
    if (ida === null) {
      // If more than one dextro- match
      if (match.d.length > 1) {
        // IDs total
        let idt = match.d.sort();
        // First ID is anchor
        ida = idt.shift();
        // The rest are other IDs
        idt.map(i => ido.push(i));
      } else {
        // Otherwise, the anchor ID is the one found
        ida = match.d[0];
      };
    } else {
      // If already an anchor, push the rest of the IDs as other IDs
      match.d.map(m => ido.push(m));
    };
  };
  // Get rid of repeat IDs in the other IDs
  while (ido.includes(ida)) ido.pop(ido.indexOf(ida));
  // If no other IDs, make ido null
  if (ido.length === 0) ido = null;
  // Return an Object of the name, anchor ID, and other IDs (if any, else null)
  return {"name": name, "idAnchor": ida, "idOther": ido};
}
