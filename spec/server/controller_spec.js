/* global describe it expect spyOn */
const { PayslipController } = require('../../server/controller');
const { Payslip } = require('../../server/payslip');
const fs = require('fs');
const sinon = require('sinon');

describe('PayslipController', () => {
  describe('constructor', () => {
    it('returns a PayslipController object', () => {
      const controller = new PayslipController();

      expect(controller.payslips).toEqual([]);
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
      expect(response).toEqual({ error: 'Invalid data submitted' });
    });

    it('will not create and write the payslips null param given', () => {
      const controller = new PayslipController();
      const createPayslipsSpy = spyOn(controller, 'createPayslips');
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips(null);

      expect(createPayslipsSpy.calls.length).toEqual(0);
      expect(writePayslipsSpy.calls.length).toEqual(0);
      expect(response).toEqual({ error: 'Invalid data submitted' });
    });

    it('will not create and write the payslips when invalid param type given', () => {
      const controller = new PayslipController();
      const createPayslipsSpy = spyOn(controller, 'createPayslips');
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips(['payslips', 'data to post']);

      expect(createPayslipsSpy.calls.length).toEqual(0);
      expect(writePayslipsSpy.calls.length).toEqual(0);
      expect(response).toEqual({ error: 'Invalid data submitted' });
    });

    it('will create and write the payslips', () => {
      const controller = new PayslipController();
      const createPayslipsSpy = spyOn(controller, 'createPayslips');
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips({ payslips: 'data to post' });

      expect(createPayslipsSpy.calls.length).toEqual(1);
      expect(writePayslipsSpy.calls.length).toEqual(1);
      expect(response).toEqual({});
    });

    it('will create and write the payslips and return the failedNames of the failed payslips', () => {
      const controller = new PayslipController();
      controller.failedNames = ['Test1', 'Test2'];
      const createPayslipsSpy = spyOn(controller, 'createPayslips');
      const writePayslipsSpy = spyOn(controller, 'writePayslips');

      const response = controller.postPayslips({ payslips: 'data to post' });

      expect(createPayslipsSpy.calls.length).toEqual(1);
      expect(writePayslipsSpy.calls.length).toEqual(1);
      expect(response).toEqual({ error: 'Payslips failed to generate for the following names:\nTest1\nTest2' });
      expect(controller.failedNames.length).toEqual(0);
    });
  });

  describe('createPayslips', () => {
    it('will create the payslips for each new line', () => {
      const controller = new PayslipController();
      const createPayslipSpy = spyOn(controller, 'createPayslip');

      controller.createPayslips('test1\ntest2\ntest3');

      expect(createPayslipSpy.calls.length).toEqual(3);
      expect(createPayslipSpy.calls[0].args[0]).toEqual('test1');
      expect(createPayslipSpy.calls[1].args[0]).toEqual('test2');
      expect(createPayslipSpy.calls[2].args[0]).toEqual('test3');
    });

    it('will create a payslip using data that is single line with no line breaks', () => {
      const controller = new PayslipController();
      const createPayslipSpy = spyOn(controller, 'createPayslip');

      controller.createPayslips('test1');

      expect(createPayslipSpy.calls.length).toEqual(1);
      expect(createPayslipSpy.calls[0].args[0]).toEqual('test1');
    });

    it('will not create a payslip for an invalid param given', () => {
      const controller = new PayslipController();
      const createPayslipSpy = spyOn(controller, 'createPayslip');

      controller.createPayslips(1000);

      expect(createPayslipSpy.calls.length).toEqual(0);
    });

    it('will not create a payslip for a null param given', () => {
      const controller = new PayslipController();
      const createPayslipSpy = spyOn(controller, 'createPayslip');

      controller.createPayslips(null);

      expect(createPayslipSpy.calls.length).toEqual(0);
    });

    it('will not create a payslip for no param given', () => {
      const controller = new PayslipController();
      const createPayslipSpy = spyOn(controller, 'createPayslip');

      controller.createPayslips();

      expect(createPayslipSpy.calls.length).toEqual(0);
    });
  });

  describe('createPayslip', () => {
    it('will not create the payslip when the data given is undefined', () => {
      const controller = new PayslipController();

      controller.createPayslip(undefined);

      expect(controller.payslips.length).toEqual(0);
      expect(controller.payslipIdCounter).toEqual(0);
    });

    it('will not create the payslip when the data given is null', () => {
      const controller = new PayslipController();

      controller.createPayslip(null);

      expect(controller.payslips.length).toEqual(0);
      expect(controller.payslipIdCounter).toEqual(0);
    });

    it('will not create the payslip when the data given is of wrong type', () => {
      const controller = new PayslipController();

      controller.createPayslip(10000);

      expect(controller.payslips.length).toEqual(0);
      expect(controller.payslipIdCounter).toEqual(0);
    });

    it('will not add the payslip when the created payslip is missing information', () => {
      const controller = new PayslipController();
      const payslip = new Payslip();
      sinon.stub(payslip, 'isValid').returns(false);

      controller.createPayslip('firstName,lastName,10000,10%');

      expect(controller.payslips.length).toEqual(0);
      expect(controller.payslipIdCounter).toEqual(0);
    });

    it('will not add the payslip when the created payslip is not valid', () => {
      const controller = new PayslipController();
      const payslip = new Payslip();
      sinon.stub(payslip, 'isValid').returns(false);

      controller.createPayslip('firstName,lastName,10000,10,01 March - 31 March');

      expect(controller.payslips.length).toEqual(0);
      expect(controller.payslipIdCounter).toEqual(0);
      expect(controller.failedNames.length).toEqual(1);
      expect(controller.failedNames[0]).toEqual('firstName lastName');
    });

    it('will add the payslip when the created payslip is valid', () => {
      const controller = new PayslipController();
      const payslip = new Payslip();
      sinon.stub(payslip, 'isValid').returns(true);
      const calculatePayslipSpy = sinon.spy(payslip, 'calculatePayslip');

      controller.createPayslip('firstName,lastName,10000,10%,01 March - 31 March');

      expect(controller.payslips.length).toEqual(1);
      expect(controller.payslipIdCounter).toEqual(1);
      expect(calculatePayslipSpy.called).toEqual(false);
    });
  });


  describe('writePayslips', () => {
    it('will not write the payslips none exist', () => {
      const controller = new PayslipController();
      const fsSpy = spyOn(fs, 'open');

      controller.writePayslips();

      expect(fsSpy.calls.length).toEqual(0);
    });

    it('will write all the payslips to file', () => {
      const controller = new PayslipController();
      const payslip1 = new Payslip();
      const payslip2 = new Payslip();
      controller.payslips = [payslip1, payslip2];

      const mockFs = sinon.mock(fs);
      mockFs.expects('open').once();
      const mockController = sinon.mock(controller, 'writePayslip');
      mockController.expects('writePayslip').twice();

      controller.writePayslips();

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

    it('will not write the payslip to file if it is undefined', () => {
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
