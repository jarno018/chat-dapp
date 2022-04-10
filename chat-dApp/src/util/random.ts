//Generator for strings of given length
export const generateRandomString = (length: number = 8): string => {

  //String to return
  let str: string = "";

  for (let i = 0; i < length / 2; i++) {

    let typedArray: Uint8Array = new Uint8Array(1);
    crypto.getRandomValues(typedArray);
    str += typedArray[0].toString();
  }

  return str;

}

//Generator for random numbers
export const generateRandomNumber = (): number => {
  let typedArray: Uint32Array = new Uint32Array(1);
  crypto.getRandomValues(typedArray);
  return typedArray[0];
}