export function toYocto(amount) {
    return BigInt(parseFloat(amount) * 1e24).toString();
  }