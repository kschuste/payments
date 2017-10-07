const { Payslip } = require('./payslip');
const { PayslipCalculator } = require('./payslip_calculator');
const fs = require('fs');

/**
 * PayslipController
 *
 * A controller object used to manage the handling of creating Payslip objects
 * and writing them to file
 */
class PayslipController {
  constructor() {
    this.payslipIdCounter = 0;
    this.failedNames = [];
  }

  /**
   * Server handler method for when payslip data is posted.
   * @param data Hash containing the string data to create and write the payslips to file.
   */
  postPayslips(data) {
    if (data === null || data === undefined) {
      return { message: 'Invalid data submitted' };
    }

    // ceate and write the payslips to file
    const payslipData = data.payslips;
    if (typeof payslipData === 'string') {
      const payslips = this.createPayslips(payslipData);
      if (payslips.length) {
        this.writePayslips(payslips);
      }
    } else {
      return { message: 'Invalid data submitted' };
    }

    const response = {};
    // if any failures occured, return them back to the client
    if (this.failedNames.length) {
      const joinedFailedNames = this.failedNames.join('\n');
      response.message = `Payslips failed to generate for the following names:\n${joinedFailedNames}`;
      this.failedNames = [];
    }
    return response;
  }

  /**
   * Returns Array of payslip objects.
   * @param data String containing the data to create the payslips.
   * @return Array
   */
  createPayslips(data) {
    const createdPayslips = [];
    if (typeof data !== 'string') {
      return createdPayslips;
    }

    // create new payslip objects
    const payslipData = data.split('\n');
    payslipData.forEach((payslip) => {
      const createdPayslip = this.createPayslip(payslip);
      if (createdPayslip) {
        // check if all information is correct before calculating info and adding to returned array
        if (createdPayslip.isValid()) {
          PayslipCalculator.calculatePayslip(createdPayslip);
          createdPayslips.push(createdPayslip);
        } else {
          // payslip was not valid, add to list of failures to return back to client
          this.failedNames.push(`${createdPayslip.firstName} ${createdPayslip.lastName}`);
        }
      }
      this.payslipIdCounter += 1;
    });
    return createdPayslips;
  }

  /**
   * Create payslip object from the string data given
   * @param data String containing the  data to create the payslips.
   * @return Payslip
   */
  createPayslip(data) {
    if (typeof data !== 'string') {
      return null;
    }
    const items = data.split(',');
    if (items.length !== 5) {
      return null;
    }
    return new Payslip(this.payslipIdCounter, items[0], items[1],
      items[2], items[3], items[4]);
  }

  /**
   * Writes the payslip objects to file
   * @param Array containing the payslip objects
   */
  writePayslips(payslips) {
    if (!payslips || typeof payslips !== 'object' || payslips.length <= 0) {
      return;
    }

    // make the output directory if does not exist
    if (!fs.existsSync('output')){
      fs.mkdirSync('output');
    }

    // create and open the file for writing
    fs.open('output/output.csv', 'wx', (err) => {
      if (err) {
        // don't throw error if file already exists
        if (err.code === 'EEXIST') {
          return;
        }
        throw err;
      }
    });

    // write each payslip to file
    payslips.forEach((payslip) => {
      this.writePayslip(payslip);
    });
  }

  /**
   * Writes the payslip object to file
   * @param payslip Payslip object
   */
  writePayslip(payslip) {
    if (payslip === undefined || payslip === null) {
      return;
    }

    // append the payslip data to file
    const outputFormat = payslip.outputFormat();
    fs.appendFileSync('output/output.csv', `${outputFormat}\n`, (error) => {
      if (error) {
        // data failed to write, add to list of failures to return back to client
        this.failedNames.push(`${payslip.firstName} ${payslip.lastName}`);
      }
    });
  }
}

module.exports = { PayslipController };
