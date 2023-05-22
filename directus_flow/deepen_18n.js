module.exports = async function(data) {
    let deepen = function(obj) {
      const result = {};

      // For each object path (property key) in the object
      for (const objectPath in obj) {
        // Split path into component parts
        const parts = objectPath.split('.');

        // Create sub-objects along path as needed
        let target = result;
        while (parts.length > 1) {
          const part = parts.shift();
          target = target[part] = target[part] || {};
        }

        // Set value at end of path
        target[parts[0]] = obj[objectPath]
      }

      return result;
    };

    let flat = {}
    for (let e in data.$last) {
     	e = data.$last[e]
        let l = e.language.locale_code;

        flat[l +'.'+ e.i18n_key.key ] = e.translation
    }

    return deepen(flat);

}
