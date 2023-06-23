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
  newObject: JsonObject | undefined
) {
  if (!original || !newObject) {
    return false;
  }

  for (const key in newObject) {
    if (original[key] != newObject[key]) {
      return true;
    }
  }
  return false;
}
