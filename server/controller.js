const { Payslip } = require('./payslip');
const fs = require('fs');

class PayslipController {
  constructor() {
    this.payslips = [];
    this.payslipIdCounter = 0;
    this.failedNames = [];
  }

  postPayslips(data) {
    if (data === null || data === undefined) {
      return { error: 'Invalid data submitted' };
    }
    const payslipData = data.payslips;
    if (typeof payslipData === 'string') {
      this.createPayslips(payslipData);
      this.writePayslips();
    } else {
      return { error: 'Invalid data submitted' };
    }

    const response = {};
    if (this.failedNames.length) {
      const joinedFailedNames = this.failedNames.join('\n');
      this.failedNames = [];
      response.error = `Payslips failed to generate for the following names:\n${joinedFailedNames}`;
    }
    return response;
  }

  createPayslips(data) {
    if (typeof data !== 'string') {
      return;
    }
    const payslipData = data.split('\n');
    payslipData.forEach((payslip) => {
      this.createPayslip(payslip);
    });
  }

  createPayslip(payslipData) {
    if (typeof payslipData !== 'string') {
      return;
    }
    const items = payslipData.split(',');
    if (items.length !== 5) {
      return;
    }
    const paySlip = new Payslip(this.payslipIdCounter, items[0], items[1],
      items[2], items[3], items[4]);
    if (paySlip.isValid()) {
      paySlip.calculatePayslip();
      this.payslips.push(paySlip);
      this.payslipIdCounter += 1;
    } else {
      this.failedNames.push(`${items[0]} ${items[1]}`);
    }
  }

  writePayslips() {
    if (this.payslips.length <= 0) {
      return;
    }

    fs.open('output/output.csv', 'wx', (err) => {
      if (err) {
        // don't throw error if file already exists
        if (err.code === 'EEXIST') {
          return;
        }
        throw err;
      }
    });

    const payslipCopies = this.payslips.slice();
    payslipCopies.forEach((payslip) => {
      this.writePayslip(payslip);
      this.payslips.shift();
    });
  }

  writePayslip(payslip) {
    if (payslip === undefined || payslip === null) {
      return;
    }

    const outputFormat = payslip.outputFormat();
    fs.appendFileSync('output/output.csv', `${outputFormat}\n`, (error) => {
      if (error) {
        this.failedNames.push(`${payslip.firstName} ${payslip.lastName}`);
      }
    });
  }
}

module.exports = { PayslipController };
