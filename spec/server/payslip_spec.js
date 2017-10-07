/* global describe it expect */
const { Payslip } = require('../../server/payslip');
const sinon = require('sinon');

function createTestPayslip(id, firstName, lastName, annualSalary, superRate, paymentStartDate) {
  return new Payslip(id, firstName, lastName, annualSalary, superRate, paymentStartDate);
}

function getExpectedIncomeTax(taxCredit, annualSalary, taxDeduct, taxPercent) {
  return Math.round((taxCredit + ((annualSalary - taxDeduct) * taxPercent)) / 12);
}

describe('Payslip', () => {
  describe('constructor', () => {
    it('returns a Payslip object with all params given', () => {
      const id = 10;
      const firstName = 'Kitty';
      const lastName = 'Cat';
      const annualSalary = '40000';
      const superRate = '10%';
      const paymentStartDate = '01 August - 31 August';
      const payslip = createTestPayslip(id, firstName, lastName, annualSalary,
        superRate, paymentStartDate);

      expect(payslip.id).toEqual(id);
      expect(payslip.firstName).toEqual(firstName);
      expect(payslip.lastName).toEqual(lastName);
      expect(payslip.annualSalary).toEqual(annualSalary);
      expect(payslip.superRate).toEqual(superRate);
      expect(payslip.paymentStartDate).toEqual(paymentStartDate);
      expect(payslip.grossIncome).toEqual(-1);
      expect(payslip.incomeTax).toEqual(-1);
      expect(payslip.netIncome).toEqual(-1);
      expect(payslip.super).toEqual(-1);
    });

    it('returns a Payslip object with no params given', () => {
      const payslip = new Payslip();

      expect(payslip.id).toEqual(undefined);
      expect(payslip.firstName).toEqual(undefined);
      expect(payslip.lastName).toEqual(undefined);
      expect(payslip.annualSalary).toEqual(undefined);
      expect(payslip.superRate).toEqual(undefined);
      expect(payslip.paymentStartDate).toEqual(undefined);
      expect(payslip.grossIncome).toEqual(-1);
      expect(payslip.incomeTax).toEqual(-1);
      expect(payslip.netIncome).toEqual(-1);
      expect(payslip.super).toEqual(-1);
    });
  });

  describe('isValid', () => {
    it('returns false for when undefined id is given', () => {
      const payslip = createTestPayslip(undefined, 'Kitty', 'Cat', '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when null id is given', () => {
      const payslip = createTestPayslip(null, 'Kitty', 'Cat', '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when undefined firstName is given', () => {
      const payslip = createTestPayslip(10, undefined, 'Cat', '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when null firstName is given', () => {
      const payslip = createTestPayslip(10, null, 'Cat', '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when invalid typeof firstName is given', () => {
      const payslip = createTestPayslip(10, 10000, 'Cat', '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when empty firstName is given', () => {
      const payslip = createTestPayslip(10, '', 'Cat', '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when undefined lastName is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', undefined, '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when null lastName is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', null, '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when invalid typeof lastName is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 11111, '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when empty lastName is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', '', '40000', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when undefined annualSalary is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', undefined, '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when null annualSalary is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', null, '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when invalid annualSalary is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', 'invalid', '10%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when undefined superRate is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '40000', undefined, '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when null superRate is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '40000', null, '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when invalid superRate is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '40000', 'invalid', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when superRate < 0 is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '40000', '-1%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when superRate > 50 is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '40000', '51%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when empty superRate is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '40000', '%', '01 August - 31 August');
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when no paymentStartDate is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '40000', '10%', undefined);
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns false for when null paymentStartDate is given', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '40000', '10%', null);
      expect(payslip.isValid()).toEqual(false);
    });

    it('returns true for when all given params are valid', () => {
      const payslip = createTestPayslip(10, 'K', 'C', '0', '0%', 'M');
      expect(payslip.isValid()).toEqual(true);
    });
  });

  describe('calculatePayslip', () => {
    it('calcualtes the remaining payslip items correctly', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '60050', '9%', '01 March to 31 March');
      const mockPayslip = sinon.mock(payslip);
      mockPayslip.expects('calculateIncomeTax').once().returns(922);

      payslip.calculatePayslip();

      expect(payslip.grossIncome).toEqual(5004);
      expect(payslip.incomeTax).toEqual(922);
      expect(payslip.netIncome).toEqual(4082);
      expect(payslip.super).toEqual(450);
      mockPayslip.verify();
      mockPayslip.restore();
    });
  });

  describe('outputFormat', () => {
    it('formats the csv string correctly', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', null, null, 'March');
      payslip.grossIncome = 100;
      payslip.incomeTax = 200;
      payslip.netIncome = 300;
      payslip.super = 400;

      const expectedDisplay = 'Kitty Cat,March,100,200,300,400';
      const actualDisplay = payslip.outputFormat();

      expect(expectedDisplay).toEqual(actualDisplay);
    });
  });

  describe('calculateIncomeTax', () => {
    it('calculates the income tax for annual salary over 180000', () => {
      const annualSalary = '180001';
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '180001', '10%', '01 August - 31 August');

      const actualTax = getExpectedIncomeTax(54547, annualSalary, 180000, 0.45);
      const incomeTax = payslip.calculateIncomeTax();

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the max annual salary in bracket [80001 <=> 180000]', () => {
      const annualSalary = '180000';
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', annualSalary, '10%', '01 August - 31 August');

      const actualTax = getExpectedIncomeTax(17547, annualSalary, 80000, 0.37);
      const incomeTax = payslip.calculateIncomeTax();

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the min annual salary in bracket [80001 <=> 180000]', () => {
      const annualSalary = '80001';
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', annualSalary, '10%', '01 August - 31 August');

      const actualTax = getExpectedIncomeTax(17547, annualSalary, 80000, 0.37);
      const incomeTax = payslip.calculateIncomeTax();

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the max annaul salary in bracket [37001 <=> 80000]', () => {
      const annualSalary = '80000';
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', annualSalary, '10%', '01 August - 31 August');

      const actualTax = getExpectedIncomeTax(3572, annualSalary, 37000, 0.325);
      const incomeTax = payslip.calculateIncomeTax();

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the min annaul salary in bracket [37001 <=> 80000]', () => {
      const annualSalary = '37001';
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', annualSalary, '10%', '01 August - 31 August');

      const actualTax = getExpectedIncomeTax(3572, annualSalary, 37000, 0.325);
      const incomeTax = payslip.calculateIncomeTax();

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the max annaul salary in bracket [18201 <=> 37000]', () => {
      const annualSalary = '37000';
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', annualSalary, '10%', '01 August - 31 August');

      const actualTax = getExpectedIncomeTax(0, annualSalary, 18200, 0.19);
      const incomeTax = payslip.calculateIncomeTax();

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the min annaul salary in bracket [18201 <=> 37000]', () => {
      const annualSalary = '18201';
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', annualSalary, '10%', '01 August - 31 August');

      const actualTax = getExpectedIncomeTax(0, annualSalary, 18200, 0.19);
      const incomeTax = payslip.calculateIncomeTax();

      expect(incomeTax).toEqual(actualTax);
    });

    it('calculates the income tax for the min annaul salary under 18201', () => {
      const payslip = createTestPayslip(10, 'Kitty', 'Cat', '18200', '10%', '01 August - 31 August');
      const incomeTax = payslip.calculateIncomeTax();
      expect(incomeTax).toEqual(0);
    });
  });
});
