/**
 * Function for scaling an array of values.  Definitions of functions for
 * finding the minimum and maximum of an array of values are defined
 * internally, but should probably be defined externally (and perhaps in a less
 * obscured format!).
 * @param {Array} arr Array of values to scale
 * @param {Number} min Minimum value by which to scale
 * @param {Number} max Maximum value by which to scale
 * @return {Array} New array of scaled values
 */
function arrayScale(arr, min = 0, max = 1) {
  let f = {
    min: (a) => a.reduce((b, c) => ((b > c) ? c : b), a[0]),
    max: (a) => a.reduce((b, c) => ((b > c) ? b : c), a[0])
  };
  let obsMin = f.min(arr);
  let obsMax = f.max(arr);
  return arr.slice().map(a => {
    return (a - obsMin) * (max - min) / (obsMax - obsMin) + min;
  });
};
