
const { Computer } = require('./modules/computer');
const fs = require("./modules/fs");

async function main() {
  try {
    const code = await fs.readFile('./src/csoc/program.csoc', { encoding: 'utf8' });
    const prog = new Computer(code);
    const out = prog.run();
    console.log("OUTPUT:", out);
  } catch (err) {
    console.error(err);
  }
}

main();