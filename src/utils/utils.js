const readline = require('readline');
const fs       = require('fs');

// Create Readline Interface
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function q(query) {
  return new Promise(resolve => rl.question(query, (a) => resolve(a)));
}

// Init File Interface
const logger = (function createLogger() {
  if (!fs.existsSync('./logs'))
    fs.mkdirSync('./logs');

  const writeLogs = (event, date, message) => {
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    fs.writeFileSync(
      `./logs/script-${y}${(m + 1 <= 9 ? '0' + m + 1 : m + 1)}${(d <= 9 ? '0' + d : d)}.log`,
      `${date.toISOString()} [${event.toUpperCase()}] ${message}\n`,
      { flag: 'a' });
    console.log(`${date.toISOString()} [${event.toUpperCase()}] ${message}`);
  }
  return {
    info: (message) => writeLogs('info', new Date(), message),
    warn: (message) => writeLogs('warn', new Date(), message),
    error: (message) => writeLogs('error', new Date(), message)
  }
})();

async function init() {
  const config = { environment: undefined, profile: undefined, accept: false }
  do {
    config.environment = await q('Qual configuração de ambiente deve ser executada [dev, hml, prd]? ');
    if (['dev', 'hml', 'prd'].indexOf(config.environment) <= -1) {
      console.log('Only accept [dev, hml, prd]');
      config.environment = undefined;
    }
  } while (!config.environment);

  do {
    config.profile = await q('Qual o profile da AWS que será usado? ');
  } while (!config.profile);

  const answer = await q(`Esta configuração [environment = ${config.environment}, profile = ${config.profile}] esta correta [Y, N]? `);
  if (['y', 'Y'].indexOf(answer) <= -1) {
    return await init();
  }

  delete config.accept;
  return config;
}

module.exports = { logger, init }