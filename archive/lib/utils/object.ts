type JsonObject = { [key: string]: any };

export function cleanEquals(ref: JsonObject, value: JsonObject) {
  for (const key in value) {
    if (ref[key] == value[key]) {
      delete value[key];
    }
  }
  return value;
}

export function hasObjectChanged(
  original: JsonObject | undefined,
  newObject: JsonObject | undefined,
) {
  if (!original || !newObject) {
    return false;
  }

  const keys = Object.keys(original);
  for (const key of keys) {
    if (
      newObject[key] !== undefined &&
      JSON.stringify(original[key]) !== JSON.stringify(newObject[key])
    ) {
      return true;
    }
  }

  return false;
}
