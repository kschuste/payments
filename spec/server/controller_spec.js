/* global describe it expect spyOn */
const { PayslipController } = require('../../server/controller');
const { Payslip } = require('../../server/payslip');
const { PayslipCalculator } = require('../../server/payslip_calculator');
const fs = require('fs');
const sinon = require('sinon');

describe('PayslipController', () => {
  describe('constructor', () => {
    it('returns a PayslipController object', () => {
      const controller = new PayslipController();

      expect(controller.failedNames).toEqual([]);
      expect(controller.payslipIdCounter).toEqual(0);
    });
  });

  describe('postPayslips', () => {
    it('will not create and write the payslips no param given', () => {
      const controller = new PayslipController();
      const createPayslipsSpy = spyOn(controller, 'createPayslips');
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips();

      expect(createPayslipsSpy.calls.length).toEqual(0);
      expect(writePayslipsSpy.calls.length).toEqual(0);
      expect(response).toEqual({ message: 'Invalid data submitted' });
    });

    it('will not create and write the payslips null param given', () => {
      const controller = new PayslipController();
      const createPayslipsSpy = spyOn(controller, 'createPayslips');
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips(null);

      expect(createPayslipsSpy.calls.length).toEqual(0);
      expect(writePayslipsSpy.calls.length).toEqual(0);
      expect(response).toEqual({ message: 'Invalid data submitted' });
    });

    it('will not create and write the payslips when invalid param type given', () => {
      const controller = new PayslipController();
      const createPayslipsSpy = spyOn(controller, 'createPayslips');
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips(['payslips', 'data to post']);

      expect(createPayslipsSpy.calls.length).toEqual(0);
      expect(writePayslipsSpy.calls.length).toEqual(0);
      expect(response).toEqual({ message: 'Invalid data submitted' });
    });

    it('will create and write the payslips', () => {
      const controller = new PayslipController();
      const mockController = sinon.mock(controller);
      mockController.expects('createPayslips').once().returns([new Payslip()]);
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips({ payslips: 'data to post' });

      mockController.verify();
      mockController.restore();
      expect(writePayslipsSpy.calls.length).toEqual(1);
      expect(response).toEqual({ message: 'All data uploaded successfully' });
    });

    it('will create and write the payslips and return the failedNames of the failed payslips', () => {
      const controller = new PayslipController();
      controller.failedNames = ['Test1'];
      const mockController = sinon.mock(controller);
      mockController.expects('createPayslips').once().returns([new Payslip(), new Payslip()]);
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips({ payslips: 'data to post' });

      mockController.verify();
      mockController.restore();
      expect(writePayslipsSpy.calls.length).toEqual(1);
      expect(response).toEqual({ message: 'Payslips failed to generate for the following names:\nTest1' });
      expect(controller.failedNames.length).toEqual(0);
    });
  });

  describe('createPayslips', () => {
    it('will create the payslips for each new line', () => {
      const payslip = new Payslip();
      const mockPayslip = sinon.mock(payslip);
      mockPayslip.expects('isValid').thrice().returns(true);

      const mockCacluator = sinon.mock(PayslipCalculator);
      mockCacluator.expects('calculatePayslip').thrice();

      const controller = new PayslipController();
      const mockController = sinon.mock(controller);
      mockController.expects('createPayslip').thrice().returns(payslip);

      const createdPayslips = controller.createPayslips('test1\ntest2\ntest3');

      expect(createdPayslips.length).toEqual(3);
      mockController.verify();
      mockController.restore();
      mockPayslip.verify();
      mockPayslip.restore();
      mockCacluator.verify();
      mockCacluator.restore();
      expect(controller.payslipIdCounter).toEqual(3);
    });

    it('will create a payslip using data that is single line with no line breaks', () => {
      const payslip = new Payslip();
      const mockPayslip = sinon.mock(payslip);
      mockPayslip.expects('isValid').once().returns(true);

      const mockCacluator = sinon.mock(PayslipCalculator);
      mockCacluator.expects('calculatePayslip').once();

      const controller = new PayslipController();
      const mockController = sinon.mock(controller);
      mockController.expects('createPayslip').once().returns(payslip);

      const createdPayslips = controller.createPayslips('test1');

      expect(createdPayslips.length).toEqual(1);
      mockController.verify();
      mockController.restore();
      mockPayslip.verify();
      mockPayslip.restore();
      mockCacluator.verify();
      mockCacluator.restore();
      expect(controller.payslipIdCounter).toEqual(1);
    });

    it('will not create a payslip for an invalid param given', () => {
      const controller = new PayslipController();
      const createPayslipSpy = spyOn(controller, 'createPayslip');

      const createdPayslips = controller.createPayslips(1000);

      expect(createdPayslips.length).toEqual(0);
      expect(createPayslipSpy.calls.length).toEqual(0);
      expect(controller.payslipIdCounter).toEqual(0);
    });

    it('will not create a payslip for a null param given', () => {
      const controller = new PayslipController();
      const createPayslipSpy = spyOn(controller, 'createPayslip');

      const createdPayslips = controller.createPayslips(null);

      expect(createdPayslips.length).toEqual(0);
      expect(createPayslipSpy.calls.length).toEqual(0);
      expect(controller.payslipIdCounter).toEqual(0);
    });

    it('will not create a payslip for no param given', () => {
      const controller = new PayslipController();
      const createPayslipSpy = spyOn(controller, 'createPayslip');

      const createdPayslips = controller.createPayslips();

      expect(createdPayslips.length).toEqual(0);
      expect(createPayslipSpy.calls.length).toEqual(0);
      expect(controller.payslipIdCounter).toEqual(0);
    });
  });

  describe('createPayslip', () => {
    it('will not create the payslip when the data given is undefined', () => {
      const controller = new PayslipController();
      const payslip = controller.createPayslip(undefined);
      expect(payslip).toEqual(null);
    });

    it('will not create the payslip when the data given is null', () => {
      const controller = new PayslipController();
      const payslip = controller.createPayslip(null);
      expect(payslip).toEqual(null);
    });

    it('will not create the payslip when the data given is of wrong type', () => {
      const controller = new PayslipController();
      const payslip = controller.createPayslip(10000);
      expect(payslip).toEqual(null);
    });

    it('will not add the payslip when the created payslip is missing information', () => {
      const controller = new PayslipController();
      const payslip = controller.createPayslip('firstName,lastName,10000,10%');
      expect(payslip).toEqual(null);
    });

    it('will add the payslip when the created payslip has all information', () => {
      const controller = new PayslipController();
      const payslip = controller.createPayslip('firstName,lastName,10000,10%,01 March - 31 March');
      expect(payslip).not.toEqual(null);
    });
  });


  describe('writePayslips', () => {
    it('will not write the payslips when no param given', () => {
      const controller = new PayslipController();
      const fsSpy = spyOn(fs, 'open');

      controller.writePayslips();

      expect(fsSpy.calls.length).toEqual(0);
    });

    it('will not write the payslips when null param given', () => {
      const controller = new PayslipController();
      const fsSpy = spyOn(fs, 'open');

      controller.writePayslips(null);

      expect(fsSpy.calls.length).toEqual(0);
    });

    it('will not write the payslips an empty array given', () => {
      const controller = new PayslipController();
      const fsSpy = spyOn(fs, 'open');

      controller.writePayslips([]);

      expect(fsSpy.calls.length).toEqual(0);
    });

    it('will write all the payslips to file', () => {
      const controller = new PayslipController();
      const payslip1 = new Payslip();
      const payslip2 = new Payslip();

      const mockFs = sinon.mock(fs);
      mockFs.expects('existsSync').once().withArgs('output').returns(false);
      mockFs.expects('mkdirSync').once().withArgs('output');
      mockFs.expects('open').once().withArgs('output/output.csv', 'wx');
      const mockController = sinon.mock(controller, 'writePayslip');
      mockController.expects('writePayslip').twice();

      controller.writePayslips([payslip1, payslip2]);

      mockFs.verify();
      mockFs.restore();
      mockController.verify();
      mockController.restore();
    });
  });

  describe('writePayslip', () => {
    it('will not write the payslip to file if it is undefined', () => {
      const controller = new PayslipController();
      const fsSpy = spyOn(fs, 'appendFileSync');
      controller.writePayslip(undefined);
      expect(fsSpy.calls.length).toEqual(0);
    });

    it('will not write the payslip to file if it is null', () => {
      const controller = new PayslipController();
      const fsSpy = spyOn(fs, 'appendFileSync');
      controller.writePayslip(null);
      expect(fsSpy.calls.length).toEqual(0);
    });

    it('will write to file the formatted payslip information', () => {
      const controller = new PayslipController();
      const payslip = new Payslip();
      const mockPayslip = sinon.mock(payslip);
      mockPayslip.expects('outputFormat').once().returns('data to write');
      const mockFs = sinon.mock(fs);
      mockFs.expects('appendFileSync').once().withArgs('output/output.csv', 'data to write\n');

      controller.writePayslip(payslip);

      mockPayslip.verify();
      mockPayslip.restore();
      mockFs.verify();
      mockFs.restore();
    });

    it('will not write to file the formatted payslip information', () => {
      const controller = new PayslipController();
      const payslip = new Payslip(10, 'firstName', 'lastName');
      const mockPayslip = sinon.mock(payslip);
      mockPayslip.expects('outputFormat').once().returns('data to write');
      sinon.stub(fs, 'appendFileSync').withArgs('output/output.csv', 'data to write\n').yields(new Error('write error'));

      controller.writePayslip(payslip);

      expect(controller.failedNames).toEqual(['firstName lastName']);
      mockPayslip.verify();
      mockPayslip.restore();
    });
  });
});
