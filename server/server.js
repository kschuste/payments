const { PayslipController } = require('./controller');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

/**
 * PayslipServer
 *
 * A server object used to create, setup, start, and close the server.
 */
class PayslipServer {
  constructor(staticPath) {
    this.staticPath = staticPath;
    this.payslipController = new PayslipController();
    this.server = null;
  }

  /**
   * Will initialize and start a new instance of the server with the port number given
   * @parm port Number to start the server on
   */
  init(port) {
    if (port === undefined || port === null) {
      return;
    }
    const app = express();

    // Static files
    app.get('/', (req, res) => res.sendFile(`${this.staticPath}/index.html`));
    app.use('/client', express.static(`${this.staticPath}/client`));

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));

    // route to post the inputted csv data to
    app.post('/payslips', (req, res) => setTimeout(() => res.send(this.payslipController.postPayslips(req.body))));

    this.server = app.listen(port, () => console.log(`server running on port ${port}`));
  }

  /**
   * Will terminate the instance of the server that is running
   */
  close() {
    if (this.server) {
      this.server.close();
    }
    this.server = null;
  }
}

module.exports = { PayslipServer };
