// Standard Modules
import http from 'http';
import 'dotenv/config';
import 'regenerator-runtime';

// Local Modules
import App from '../app.js';
import { LoggerUtil } from '../utils/index.js';

// Config
import config from '../config/variables.config.js';
import { name } from '../../package.json';

const { PORT } = config;

const init = async () => {
  const server = http.createServer(App.app);

  await App.init();

  const _onError = (error) => {
    LoggerUtil.error(error.message);
  };

  const _onListening = () => {
    const address = server.address();

    const bind =
      typeof address === 'string'
        ? `pipe ${address}`
        : `${address.port}`;

    LoggerUtil.info(`${name} started:`);
    LoggerUtil.info(`Port: ${bind}`);
    LoggerUtil.info(`Start date: ${new Date().toUTCString()}\n`);
  };
  console.log("om eroroor");
  
  server.listen(PORT);
  server.on('error', _onError);
  server.on('listening', _onListening);
};

init().catch((error) => {
  LoggerUtil.error(error.message);
});

export default init;