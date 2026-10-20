
export const blobConversion = async (payload) => {
  const result = {};
  for (const field in payload) {
    const value = payload[field];
    if (value instanceof File) {
      result[field] = {
        blob: value,
        fileName: value.name
      };
    } else if (typeof value === "string" || value === null) {
      if (value === null) {
        result[field] = null;
      } else {
        try {
          const response = await fetch(value);
          const blob = await response.blob();
          const urlParts = value.split("/");
          const fileName = urlParts[urlParts.length - 1];
          result[field] = {
            blob,
            fileName
          };
        } catch (error) {
          console.error(`Error converting ${field}:`, error);
        }
      }
    }

  }

  return result;
};


