/* eslint no-param-reassign: ["error", { "props": false }] */
const { PayslipHelper } = require('./payslip_helper');

/**
 * PayslipCalculator
 *
 * An object used to the financial calculations for a Payslip
 */
class PayslipCalculator {

  /**
   * Will calculate and assing the remaining tax properties for the payslip given
   * @param payslip A valid Payslip object
   */
  static calculatePayslip(payslip) {
    payslip.grossIncome = Math.round(payslip.annualSalary / 12);
    payslip.incomeTax = PayslipCalculator.calculateIncomeTax(payslip.annualSalary);
    payslip.netIncome = payslip.grossIncome - payslip.incomeTax;
    payslip.super = Math.round(payslip.grossIncome *
      PayslipHelper.getPercentDecimalValue(payslip.superRate));
  }

  /**
   * Will calculate and return the income tax for the annual salary given
   * @param annualSalary Number to calculate the income text from
   * @return Integer - the calculated income tax
   */
  static calculateIncomeTax(annualSalary) {
    let taxCredit = 0;
    let taxPercent = 0;
    let taxDeduct = 0;
    if (annualSalary >= 180001) {
      taxCredit = 54547;
      taxPercent = 0.45;
      taxDeduct = 180000;
    } else if (annualSalary >= 80001) {
      taxCredit = 17547;
      taxPercent = 0.37;
      taxDeduct = 80000;
    } else if (annualSalary >= 37001) {
      taxCredit = 3572;
      taxPercent = 0.325;
      taxDeduct = 37000;
    } else if (annualSalary >= 18201) {
      taxPercent = 0.19;
      taxDeduct = 18200;
    }
    return Math.round((taxCredit + ((annualSalary - taxDeduct) * taxPercent)) / 12);
  }
}

module.exports = { PayslipCalculator };
