
export function base64ToArray(value) {
  if (value === void 0) value = '';
  // convert user input string to all characters that can be base64 encoded
  const codeUnits = new Uint8Array(value.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = value.charCodeAt(i);
  }
  const base64 = String.fromCharCode(...new Uint8Array(codeUnits.buffer));

  // base64 encode the string
  const len = base64.length;
  const padding = 32 - len;
  let bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    if (i < padding) continue;
    const j = (padding - i) * -1;
    bytes[i] = base64.charCodeAt(j);
  }
  return bytes;
}
