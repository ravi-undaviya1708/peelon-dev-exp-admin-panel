
export function useMulitImageArray(imageKeys, getValues, setValue) {

  function handleAddImage(file) {
    const currentValues = imageKeys.map((key) => getValues(key));
    const firstNullIndex = currentValues.findIndex((val) => val === null);
    const targetIndex = firstNullIndex !== -1 ? firstNullIndex : imageKeys.length - 1;
    setValue(imageKeys[targetIndex], file,{ shouldValidate: true, shouldDirty: true });
  }

  function handleDeleteImage(indexToDelete) {
    const currentValues = imageKeys.map((key) => getValues(key));
    const updated = [...currentValues];
    updated.splice(indexToDelete, 1); // Remove deleted image
    updated.push(null); // Add empty slot at the end
    imageKeys.forEach((key, i) => {
      setValue(key, updated[i],{ shouldValidate: true, shouldDirty: true });
    });
  }

  return { handleAddImage, handleDeleteImage };
}

