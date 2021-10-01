
export function encodeApnHuman(value) {
  let apn = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    apn += ('3' + char);
  }

  let human = ''
  for (let i = 0; i < 64 - apn.length; i++) {
    human += '0';
  }

  human += apn;
  return human;
}

export function encodeApn(value, prefix) {
  if (value === void 0 || value === null) value = '';
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

  if (prefix) {
    // TODO: this is address32 it think?
    let type = '2';
    let typeBytes = new Uint8Array(33);
    typeBytes[0] = 2;
    for (let i = 0; i < 32; i++) {
      typeBytes[i + 1] = bytes[i];
    }

    return typeBytes;
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

export function getBounds(coords) {
  let maxLat = -1 * Number.MAX_VALUE;
  let minLat = Number.MAX_VALUE
  let maxLon = -1 * Number.MAX_VALUE;
  let minLon = Number.MAX_VALUE;

  for (let j = 0; j < coords.length; j++) {
    const lon = coords[j][0];
    const lat = coords[j][1];

    if (lon > maxLon) maxLon = lon;
    if (lon < minLon) minLon = lon;
    if (lat > maxLat) maxLat = lat;
    if (lat < minLat) minLat = lat;
  }

  if (maxLat < -180 || maxLon < -360 || minLat > 180 || minLon > 360) {
    return [
      [37.907506579631, -121.223565024536],
      [37.9296422893884, -121.038149460093]
    ];
  }

  return [
    [maxLat, maxLon],
    [minLat, minLon]
  ];
}
