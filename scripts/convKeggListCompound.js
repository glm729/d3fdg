/**
 * Function for converting the raw KEGG REST API response to list compound data
 * into a JSON.  This is useful because, when requesting the list, it returns a
 * tab-delimited file containing the KEGG Compound ID in the first column, and
 * a semi-colon separated list of the associated names in the second column.
 *
 * Thus, this can be converted into a JSON of the format:
 * {"idKegg": "cpd:C00001", "nameKegg": ["H2O", "Water"]}
 *
 * - Modified to strip /^cpd:/.
 * - Modified method to avoid empty final row.
 * - Modified to force names to lowercase, for a considerable performance
 *   improvement.
 *
 * @param {String} raw String of raw text read from the file.
 * @return {Array} Array of Objects, each containing the KEGG Compound ID and
 * the associated names.
 */
function convKeggListCompound(raw) {
  // Split up the raw text
  let data = raw.replace(/\n$/, '').split(/\n/).map(r => r.split(/\t/));
  // Operate on the data
  return data.map(d => {
    // For each entry, index 0 is the ID, and index 1 is the
    // semicolon-delimited name list, which needs to be split.
    return {
      "idKegg": d[0].replace(/^cpd:/, ''),
      "nameKegg": d[1].split(/; /).map(n => n.toLowerCase())
    };
  });
}
