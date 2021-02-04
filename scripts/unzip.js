/**
 * Function for getting contents of a ZIP file.
 * - Requires JSZip
 * - Function must be async
 *
 * @param {???} content File content of the uploaded ZIP
 * @return {Object} Contents of each file within the ZIP, whereby the key is
 * the filename without the file extension
 */
async function unzip(content) {
  let jsz = new JSZip();
  let zip = await jsz.loadAsync(content);
  let results = {};
  for (let k in zip.files) {
    let fileContent = await zip.files[k].async("string");
    results[k.replace(/\..+$/, '')] = fileContent;
  };
  return results;
}
