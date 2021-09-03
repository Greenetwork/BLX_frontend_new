
export function encodeApn(value) {
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

export function decodeApn(value) {
  if (value === void 0) value = '';

  let encodedApn = '';

  // remove padding
  let hasPadding = true;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (hasPadding) {
      if (char === '0') continue;
      hasPadding = false;
    }
    encodedApn += char;
  }

  const chars = [];
  for (let i = 0; i < encodedApn.length; i += 2) {
    chars.push([encodedApn[i], encodedApn[i + 1]]);
  }

  let apn = '';
  for (let i = 0; i < chars.length; i++) {
    const charSet = chars[i];
    apn += charSet[1];
  }
  return apn;
}

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
