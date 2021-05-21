
export default {
  base64ToArray: function (value) {
    // convert user input string to all characters that can be base64 encoded
    const codeUnits = new Uint16Array(value.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = value.charCodeAt(i);
    }
    const base64 = String.fromCharCode(...new Uint8Array(codeUnits.buffer));

    // base64 encode the string
    const len = base64.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = base64.charCodeAt(i);
    }
    return bytes;
  }
};
