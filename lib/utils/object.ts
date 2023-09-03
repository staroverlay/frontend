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

  for (const key in newObject) {
    const originalValue = original[key];
    const newValue = newObject[key];

    if (typeof originalValue == 'object' && typeof originalValue == 'object') {
      const originalRaw = JSON.stringify(originalValue);
      const newRaw = JSON.stringify(newValue);

      if (originalRaw != newRaw) {
        return true;
      }
    } else if (originalValue != newValue) {
      return true;
    }
  }

  return false;
}
