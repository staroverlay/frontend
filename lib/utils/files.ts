export function downloadURL(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
}

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
