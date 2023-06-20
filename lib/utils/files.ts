export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const { result } = reader;
      if (result) {
        resolve(result as ArrayBuffer);
      } else {
        reject("No content");
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
