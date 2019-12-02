const fs = require("./modules/fs");

function fuelNeeds(mass) {
  const need = Math.floor(mass / 3) - 2;
  return need + (need >= 9 ? fuelNeeds(need) : 0);
}

async function main() {
  const raw = await fs.readFile('module_weights.json', { encoding: 'utf8' });
  const module_weights = JSON.parse(raw);
  console.log("Module Weights:", module_weights);
  const fuel_needed = module_weights
    .map(m => Math.floor(m / 3) - 2);
  // console.log("Fuel Needed:", fuel_needed);
  const total_fuel_needed = fuel_needed.reduce((prev, cur) => {
    return prev + cur;
  }, 0);
  console.log("Total Fuel Needed:", total_fuel_needed);

  const fuel_needed_recursed = module_weights.map(fuelNeeds);
  const total_fuel_needed_recursed = fuel_needed_recursed.reduce((prev, cur) => {
    return prev + cur;
  }, 0);
  console.log("Total Fuel Needed (Recursed):", total_fuel_needed_recursed);
}

main();