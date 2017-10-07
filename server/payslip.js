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

  isValid() {
    if (this.id === undefined || this.id === null || isNaN(this.id)) {
      return false;
    }
    if (!Payslip.isStringValid(this.firstName)) {
      return false;
    }
    if (!Payslip.isStringValid(this.lastName)) {
      return false;
    }
    if (this.annualSalary === undefined || this.annualSalary === null ||
      isNaN(this.annualSalary) || this.annualSalary < 0) {
      return false;
    }
    if (!this.isSuperRateValid(this.superRate)) {
      return false;
    }
    if (!Payslip.isStringValid(this.paymentStartDate)) {
      return false;
    }

    return true;
  }

  static isStringValid(string) {
    return (typeof string === 'string' && string.length > 0);
  }

  isSuperRateValid() {
    if (typeof this.superRate !== 'string' || this.superRate.length < 2) {
      return false;
    }
    if (this.superRate.slice(-1) !== '%') {
      return false;
    }
    if (isNaN(this.superRate.slice(0, -1))) {
      return false;
    }
    const decimalValue = this.getSuperRateDecimalValue();
    if (decimalValue < 0.0 || decimalValue > 0.5) {
      return false;
    }
    return true;
  }

  getSuperRateDecimalValue() {
    const rate = this.superRate.slice(0, -1);
    return rate / 100;
  }

  calculatePayslip() {
    this.grossIncome = Math.round(this.annualSalary / 12);
    this.incomeTax = this.calculateIncomeTax();
    this.netIncome = this.grossIncome - this.incomeTax;
    this.super = Math.round(this.grossIncome * this.getSuperRateDecimalValue());
  }

  calculateIncomeTax() {
    let taxCredit = 0;
    let taxPercent = 0;
    let taxDeduct = 0;
    if (this.annualSalary >= 180001) {
      taxCredit = 54547;
      taxPercent = 0.45;
      taxDeduct = 180000;
    } else if (this.annualSalary >= 80001) {
      taxCredit = 17547;
      taxPercent = 0.37;
      taxDeduct = 80000;
    } else if (this.annualSalary >= 37001) {
      taxCredit = 3572;
      taxPercent = 0.325;
      taxDeduct = 37000;
    } else if (this.annualSalary >= 18201) {
      taxPercent = 0.19;
      taxDeduct = 18200;
    }
    return Math.round((taxCredit + ((this.annualSalary - taxDeduct) * taxPercent)) / 12);
  }

  outputFormat() {
    return `${this.firstName} ${this.lastName},${this.paymentStartDate},${this.grossIncome},${this.incomeTax},${this.netIncome},${this.super}`;
  }
}

module.exports = { Payslip };
