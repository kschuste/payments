/* global describe it expect */
const { PayslipCalculator } = require('../../server/payslip_calculator');
const { Payslip } = require('../../server/payslip');
const sinon = require('sinon');

function getExpectedIncomeTax(taxCredit, annualSalary, taxDeduct, taxPercent) {
  return Math.round((taxCredit + ((annualSalary - taxDeduct) * taxPercent)) / 12);
}

describe('PayslipCalculator', () => {
  describe('calculatePayslip', () => {
    it('calcualtes the remaining payslip items correctly', () => {
      const payslip = new Payslip(10, 'Kitty', 'Cat', '60050', '9%', '01 March to 31 March');
      const mockPayslipCalculator = sinon.mock(PayslipCalculator);
      mockPayslipCalculator.expects('calculateIncomeTax').once().returns(922);

      PayslipCalculator.calculatePayslip(payslip);

      expect(payslip.grossIncome).toEqual(5004);
      expect(payslip.incomeTax).toEqual(922);
      expect(payslip.netIncome).toEqual(4082);
      expect(payslip.super).toEqual(450);
      mockPayslipCalculator.verify();
      mockPayslipCalculator.restore();
    });
  });

  describe('calculateIncomeTax', () => {
    it('calculates the income tax for annual salary over 180000', () => {
      const annualSalary = '180001';
      const actualTax = getExpectedIncomeTax(54547, annualSalary, 180000, 0.45);
      const incomeTax = PayslipCalculator.calculateIncomeTax(annualSalary);
      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the max annual salary in bracket [80001 <=> 180000]', () => {
      const annualSalary = '180000';
      const actualTax = getExpectedIncomeTax(17547, annualSalary, 80000, 0.37);
      const incomeTax = PayslipCalculator.calculateIncomeTax(annualSalary);

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the min annual salary in bracket [80001 <=> 180000]', () => {
      const annualSalary = '80001';
      const actualTax = getExpectedIncomeTax(17547, annualSalary, 80000, 0.37);
      const incomeTax = PayslipCalculator.calculateIncomeTax(annualSalary);

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the max annaul salary in bracket [37001 <=> 80000]', () => {
      const annualSalary = '80000';
      const actualTax = getExpectedIncomeTax(3572, annualSalary, 37000, 0.325);
      const incomeTax = PayslipCalculator.calculateIncomeTax(annualSalary);

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the min annaul salary in bracket [37001 <=> 80000]', () => {
      const annualSalary = '37001';
      const actualTax = getExpectedIncomeTax(3572, annualSalary, 37000, 0.325);
      const incomeTax = PayslipCalculator.calculateIncomeTax(annualSalary);

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the max annaul salary in bracket [18201 <=> 37000]', () => {
      const annualSalary = '37000';
      const actualTax = getExpectedIncomeTax(0, annualSalary, 18200, 0.19);
      const incomeTax = PayslipCalculator.calculateIncomeTax(annualSalary);

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the min annaul salary in bracket [18201 <=> 37000]', () => {
      const annualSalary = '18201';
      const actualTax = getExpectedIncomeTax(0, annualSalary, 18200, 0.19);
      const incomeTax = PayslipCalculator.calculateIncomeTax(annualSalary);

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the min annaul salary under 18201', () => {
      const annualSalary = '18200';
      const incomeTax = PayslipCalculator.calculateIncomeTax(annualSalary);
      expect(incomeTax).toEqual(0);
    });
  });
});
