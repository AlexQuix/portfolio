/**
 * Calculates the percentage between two values.
 * @param {number} value - The value to calculate the percentage of.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} - The percentage of the value between the minimum and maximum values.
*/
export function calPercentage(value, min, max) {
    return ((value - min) / (max - min)) * 100;
}

/**
 * Extract the translateX and translateY from a CSS transform string
 * @param {string} transformString - The CCS transform value
 * @returns {{
 *  translateX: number, translateY: number
 * }} - The extracted translateX and translateY values
 */
export function getTranslateValuesFromMatrix(transformString) {
    // Creates an object to store the translateX and translateY
    const values = { translateX: 0, translateY: 0 };
    
    // A regular expresion to match the values in the transformString
    const matrixRegex = /matrix\((-?\d+\.?\d*), (-?\d+\.?\d*), (-?\d+\.?\d*), (-?\d+\.?\d*), (-?\d+\.?\d*), (-?\d+\.?\d*)\)/g;
    let match = matrixRegex.exec(transformString);
    
     // If a match was found, extract the translateX and translateY values
    if (match != null) {
      let [, a, b, c, d, e, f] = match;
      values.translateX = parseFloat(e);
      values.translateY = parseFloat(f);
    }

    return values;
}
