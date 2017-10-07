const { PayslipServer } = require('./server');
const path = require('path');

const staticPath = path.dirname(__dirname);
const server = new PayslipServer(staticPath);
server.init(8765);
