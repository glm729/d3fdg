/**
 * Function for finding the name of each entry in KEGG.  If no name is found,
 * `null` is returned for anchor ID.  If there's an anchor but no other ID,
 * `null` is returned for other IDs.  Operates directly on the data, rather
 * than producing a copy, because I have yet to learn how to do deep copying
 * and because I am a bit concerned about performance if doing so.
 *
 * NOTE:  The operations in `subsetData` are slow, and I haven't been able to
 *        find a way to speed them up.
 *
 * @param {Array} data Converted and cleaned literature data.
 * @param {Array} klc KEGG Compound data returned from the REST API
 * `list/compound` operation.
 * @return None, as it operates on the data object itself, adding the keys
 * `idAnchor` and `idOther`.
 */
function nameInKegg(data, klc) {
  data.map(d => {
    // Get the relevant entries in the data
    let extract = subsetData(d.name, klc);
    // Pick an anchor ID
    let idScan = pickAnchor(d.name, extract);
    // Assign the values
    d.idAnchor = idScan.idAnchor;
    d.idOther = idScan.idOther;
  });
}
