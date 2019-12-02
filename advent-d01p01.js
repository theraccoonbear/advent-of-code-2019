const cbfs = require('fs');
const util = require('util');

cbfs.read

const fs = {
  readdir: util.promisify(cbfs.readdir),
  readFile: util.promisify(cbfs.readFile),
  writeFile: util.promisify(cbfs.writeFile),
};

async function main() {
  const raw = await fs.readFile('module_weights.json', { encoding: 'utf8' });
  const data = JSON.parse(raw);
  console.log("Module Weights:", data);
  const fuel_needed = data
    .map(m => Math.floor(m / 3) - 2);
  console.log("Fuel Needed:", fuel_needed);
  const total_fuel_needed = fuel_needed.reduce((prev, cur, idx, ar) => {
    return prev + cur;
  }, 0);
  console.log("Total Fuel Needed:", total_fuel_needed);
}

main();