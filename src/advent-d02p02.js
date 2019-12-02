
const { Computer } = require('./modules/computer');
const fs = require("./modules/fs");

async function main() {
  try {
    const code = await fs.readFile('./src/csoc/program.csoc', { encoding: 'utf8' });
    let out = false;
    let noun = -1;
    let verb = 1;
    while (out !== 19690720) {
      noun++;
      if (noun > 100) {
        noun = 0;
        verb++;
      }
      const prog = new Computer(code);
      prog.memSet(1, noun);
      prog.memSet(2, verb);
      console.log(prog.state.slice(0, 4));
      out = prog.run();
      console.log(prog.state.slice(0, 4));
      console.log(`${noun} and ${verb} = ${out} or... ${100 * noun + verb}`);
    }
  } catch (err) {
    console.error(err);
  }
}

main();