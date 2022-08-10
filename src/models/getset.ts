export class Getters {
  // used to get rid of the annoying $numberDecimal key added in mongo
  static numberGetter = (numStr: string): string => {
    return `${Number.parseFloat(`${numStr}`).toFixed(2)}`;
  }
}

