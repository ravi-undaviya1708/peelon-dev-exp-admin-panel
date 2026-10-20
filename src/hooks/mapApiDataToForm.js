export function mapApiDataToForm(initialData, apiResponse) {
  // Extract actual data from API response object
  const apiData = apiResponse || {};

  // Recursive function to map each value
  function mapValue(initVal, key) {
    // Handle arrays - keep API array if present, else initial array
    if (Array.isArray(initVal)) {
      return Array.isArray(apiData[key]) ? apiData[key] : initVal;
    }

    // Handle nested objects - recursively map each nested key
    if (initVal && typeof initVal === "object" && !Array.isArray(initVal)) {
      const result = {};
      for (const nestedKey in initVal) {
        result[nestedKey] = mapValue(initVal[nestedKey], nestedKey);
      }
      return result;
    }

    // Handle primitive values - use API value if defined, else initial value
    return apiData[key] !== undefined && apiData[key] !== null
      ? apiData[key]
      : initVal;
  }

  // Iterate over top-level keys in initial data and map values from API
  const mappedResult = {};
  for (const key in initialData) {
    mappedResult[key] = mapValue(initialData[key], key);
  }

  return mappedResult;
}
