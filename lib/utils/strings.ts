export function getFirstCharacters(str: string, length: number): string {
  return str.substring(0, length);
}

export function hideEmail(email: string): string {
  const parts = email.split("@");
  const firstPart = getFirstCharacters(parts[0], 3);
  const secondPart = getFirstCharacters(parts[1].split(".")[0], 3);
  const thirdPart = parts[1].split(".")[1];

  return `${firstPart}***@${secondPart}***.${thirdPart}`;
}
