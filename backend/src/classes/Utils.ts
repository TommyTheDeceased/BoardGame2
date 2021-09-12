export default class Utils {
  makeid(length: number) {
    var result = "";

    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var characterlength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characterlength));
    }

    return result;
  }
}
