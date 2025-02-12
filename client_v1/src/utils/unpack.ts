export const unpackU128toNumberArray = (u128: number): number[] => {
  const bigIntValue = BigInt(u128); // Convertit le nombre en BigInt
  const numbers = []; // Utilise un tableau simple de nombres

  for (let i = 0; i < 16; i++) {
    const number = Number((bigIntValue >> BigInt(8 * i)) & BigInt(0xff));
    if (number) {
      numbers.push(number);
    }
  }

  return numbers.slice(1);
};

export const feltToStr = (felt: any): string => {
  let hexString = felt.toString(16);
  if (hexString.length % 2) hexString = '0' + hexString; // Ensure even length
  const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));
  return new TextDecoder().decode(byteArray);
};


export function hexToUtf8(hex) {
  hex = hex.replace(/^0x/, ''); // Remove "0x" prefix if present
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
      const char = String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      if (/[ -~]/.test(char)) { // Only add printable ASCII characters
          str += char;
      }
  }
  return str.trim();
}
