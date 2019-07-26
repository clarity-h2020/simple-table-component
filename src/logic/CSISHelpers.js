

/**
   * Drupal JSON API 'deeply' inlcudes objects, e.g. &include=field_references are provided onyl once in a separate array name 'inlcuded'.
   * This method resolves the references and extracts the inlcuded  object.
   */
  export function getIncludedObject(type, id, includedArray) {
    if (type != null && id != null) {
      for (let i = 0; i < includedArray.length; ++i) {
        if (includedArray[i].type === type && includedArray[i].id === id) {
          return includedArray[i];
        }
      }
    }

    return null;
  }