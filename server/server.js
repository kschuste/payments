const { PayslipController } = require('./controller');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

class PayslipServer {
  constructor(staticPath) {
    this.staticPath = staticPath;
    this.payslipController = new PayslipController();
    this.server = null;
  }

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

  close() {
    if (this.server) {
      this.server.close();
    }
    this.server = null;
  }
}

module.exports = { PayslipServer };
