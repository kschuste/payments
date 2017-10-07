/**
 * PayslipHelper
 *
 * A helper object used to help validate and return Payslip data
 */
class PayslipHelper {

  /**
   * Helper method to validate if string given is acceptable
   */
  static isStringValid(string) {
    return (typeof string === 'string' && string.length > 0);
  }

  static isNumberValid(number) {
    return (number !== undefined && number !== null &&
      !isNaN(number) && number >= 0);
  }

  /**
   * Helper method to validate if the superRate givenis acceptable
   */
  static isSuperRateValid(superRate) {
    if (typeof superRate !== 'string' || superRate.length < 2) {
      return false;
    }
    if (superRate.slice(-1) !== '%') {
      return false;
    }
    if (isNaN(superRate.slice(0, -1))) {
      return false;
    }
    const decimalValue = PayslipHelper.getPercentDecimalValue(superRate);
    if (decimalValue < 0.0 || decimalValue > 0.5) {
      return false;
    }
    return true;
  }

  /**
   * Helper method to validate if the superRate givenis acceptable
   */
  static getPercentDecimalValue(superRate) {
    const rate = superRate.slice(0, -1);
    return rate / 100;
  }
}

module.exports = { PayslipHelper };
