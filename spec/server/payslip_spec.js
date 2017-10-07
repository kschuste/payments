/* global describe it expect */
const { Payslip } = require('../../server/payslip');

function createTestPayslip(id, firstName, lastName, annualSalary, superRate, paymentStartDate) {
  return new Payslip(id, firstName, lastName, annualSalary, superRate, paymentStartDate);
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
});
