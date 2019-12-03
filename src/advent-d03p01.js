
const { WireDiagram, WireDiagramInstruction } = require('./modules/wire-diagram');
const fs = require("./modules/fs");

async function main() {
  try {
    const raw = await fs.readFile('./data/wire-diagram.csv', { encoding: 'utf8' });
    const diag = new WireDiagram(raw);
    console.log(diag);
  } catch (err) {
    console.error(err);
  }
}

main();