export function round(f: number, digit: number): number {
  return Number(f.toFixed(digit));
}

export function b64Encode(img: File, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
