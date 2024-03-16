export class RandomNumbers {
  static getRandomNumbers = (length: number) => {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
    );
  };
}
