/**
 * Function for reading a file.  Reads the first file from a specified input
 * element.
 *
 * @param {??} element DOM input node, from which only the first file is read.
 * @param {Function} callback Function to call when `FileReader.onload` is
 * called. This is the best way I've found to get around the difficulties I
 * have with FileReader.  Defaults to `console.log`.
 * @return N/A
 */
function readFile(element, callback = console.log) {
  // Initialise the FileReader instance and the onload function
  let reader = new FileReader();
  reader.onload = () => callback(reader.result);
  // Try to read the file, else log and throw the error encountered
  try {
    reader.readAsText(element.files[0]);
  } catch(e) {
    console.error("Error reading file:\n" + e.stack);
    throw e;
  };
}
