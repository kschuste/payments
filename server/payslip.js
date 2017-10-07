const { PayslipHelper } = require('./payslip_helper');

/**
 * Payslip
 *
 * A model object used to calculate and hold the data for a payslip.
 */
class Payslip {

  constructor(id, firstName, lastName, annualSalary, superRate, paymentStartDate) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.annualSalary = annualSalary;
    this.superRate = superRate;
    this.paymentStartDate = paymentStartDate;

    this.grossIncome = -1;
    this.incomeTax = -1;
    this.netIncome = -1;
    this.super = -1;
  }

  /**
   * Will determine if the basic information to generate the rest of the information
   * for the Payslip is in correct format
   */
  isValid() {
    if (!PayslipHelper.isNumberValid(this.id)) {
      return false;
    }
    if (!PayslipHelper.isStringValid(this.firstName)) {
      return false;
    }
    if (!PayslipHelper.isStringValid(this.lastName)) {
      return false;
    }
    if (!PayslipHelper.isNumberValid(this.annualSalary)) {
      return false;
    }
    if (!PayslipHelper.isSuperRateValid(this.superRate)) {
      return false;
    }
    if (!PayslipHelper.isStringValid(this.paymentStartDate)) {
      return false;
    }

    return true;
  }

  outputFormat() {
    return `${this.firstName} ${this.lastName},${this.paymentStartDate},${this.grossIncome},${this.incomeTax},${this.netIncome},${this.super}`;
  }
}

module.exports = { Payslip };
