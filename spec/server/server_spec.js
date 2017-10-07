/* global describe it expect spyOn */
const { PayslipServer } = require('../../server/server');

describe('PayslipServer', () => {
  describe('constructor', () => {
    it('returns a PayslipServer object with all params given', () => {
      const staticPath = 'path';
      const payslipServer = new PayslipServer(staticPath);

      expect(payslipServer.staticPath).toEqual(staticPath);
      expect(payslipServer.payslipController).not.toEqual(null);
      expect(payslipServer.server).toEqual(null);
    });

    it('returns a PayslipServer object with no params given', () => {
      const payslipServer = new PayslipServer();

      expect(payslipServer.staticPath).toEqual(undefined);
      expect(payslipServer.payslipController).not.toEqual(null);
      expect(payslipServer.server).toEqual(null);
    });
  });

  describe('init', () => {
    it('does not initialize the app if no port is given', () => {
      const payslipServer = new PayslipServer('path');
      payslipServer.init();

      expect(payslipServer.server).toEqual(null);
    });

    it('does not initialize the app if null port is given', () => {
      const payslipServer = new PayslipServer('path');
      payslipServer.init(null);

      expect(payslipServer.server).toEqual(null);
    });

    it('initializes the app with the port given', () => {
      const payslipServer = new PayslipServer('path');
      payslipServer.init(1000);
      expect(payslipServer.server).not.toEqual(null);
    });
  });

  describe('close', () => {
    it('will close the server', () => {
      const payslipServer = new PayslipServer('path');
      payslipServer.init(1000);
      const writePayslipsSpy = spyOn(payslipServer.server, 'close');

      payslipServer.close();

      expect(writePayslipsSpy.calls.length).toEqual(1);
    });
  });
});
