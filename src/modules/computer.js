const chalk = require("chalk");
const sprintf = require("sprintf-js").sprintf;

class Computer {
  static OP_ADD = 1;
  static OP_MULT = 2;
  static OP_HALT = 99;
  static operations = [Computer.OP_ADD, Computer.OP_MULT, Computer.OP_HALT];

  constructor(code) {
    this.raw_src = code;
    this.state = this.raw_src
      .split(/,/g)
      .map(v => parseInt(v, 10));
    this.state_history = [];
    this.cmd_ptr = 0;
    this.cmd_ctr = 0;
  }

  validOperator(operation) {
    return Computer.operations.indexOf(operation) >= 0;
  }
  validOperand(operator, idx) {
    if (operator === Computer.OP_HALT) { return true; };
    return typeof this.state[idx] !== 'undefined';
  }


  getOp(ptr) {
    const operation = this.state.slice(ptr, ptr + 4);
    const operator = operation[0];
    if (!this.validOperator(operator)) {
      throw new Error(`Invalid operator "${operator}`);
    }

    const opndaddr1 = operation[1];
    if (!this.validOperand(operator, opndaddr1)) {
      throw new Error(`Invalid operand 1 index "${opndaddr1}"`)
    }
    const operand1 = this.state[opndaddr1];

    const opndaddr2 = operation[2];
    if (!this.validOperand(operator, opndaddr2)) {
      throw new Error(`Invalid operand 2 index "${opndaddr2}"`)
    }
    const operand2 = this.state[opndaddr2];


    if (operator !== Computer.OP_HALT && ptr + 3 >= this.state.length) {
      throw new Error(`Short read for operation begining at ${ptr}`);
    }

    // const operand1 = operation[1];
    // const operand2 = operation[2];
    const outaddr = operation[3];
    return {
      operator,
      operand1,
      operand2,
      opndaddr1,
      opndaddr2,
      outaddr,
    };
  }


  stateDiff(to = -1, from = 0) {
    const fromState = from === 0 ? this.state : this.state_history[this.state_history.length + from];
    const toState = to === 0 ? this.state : this.state_history[this.state_history.length + to];
    const shorter = Math.min(fromState.length, toState.length);
    // console.log('F:', fromState.length, fromState);
    // console.log('T:', toState.length, toState);
    const diffs = [...Array(shorter)].map((v, i) => fromState[i] !== toState[i]);
    // for (var i = 0; i < shorter; i++) {
    //   if (fromState[i] !== toState[i]) {
    //     diffs[i] = true;
    //   }
    // }
    return diffs;
  }

  memSet(idx, val) {
    this.state[idx] = val;
  }

  showState() {
    let idx = 0;

    const diffs = this.stateDiff();

    // console.log(diffs);

    const st = [];
    while (idx < this.state.length) {
      const op = this.state.slice(idx, idx + 4);
      st.push(
        op
          .map((v, i) => {
            let val = sprintf('%03d', v)
            if (diffs[i]) { val = chalk.red(val); }
            return val;
          })
          .join(',')
      );
      idx += 4;
    }
    console.log(st.join("\n"));
    // process.exit(0);
  }

  eval(cmdIdx = false) {
    this.state_history.push([...this.state]);
    let ptr = cmdIdx === false ? this.cmd_ptr : cmdIdx;
    const operation = this.getOp(ptr);
    this.cmd_ctr++;

    // this.showState();
    // console.log(`CMD(${this.cmd_ctr}@${this.cmd_ptr}):${this.state.slice(ptr, ptr + 4)}`); //, JSON.stringify(operation));
    // console.log(operation);
    switch (operation.operator) {
      case Computer.OP_ADD:
        // console.log(`${operation.operand1} + ${operation.operand2} = ${operation.operand1 + operation.operand2} ==> state[${operation.outaddr}]`);
        this.state[operation.outaddr] = operation.operand1 + operation.operand2;
        break;
      case Computer.OP_MULT:
        // console.log(`${operation.operand1} x ${operation.operand2} = ${operation.operand1 + operation.operand2} ==> state[${operation.outaddr}]`);
        this.state[operation.outaddr] = operation.operand1 * operation.operand2;
        break;
      case Computer.OP_HALT:
        // console.log(`HALT! AFTER ${this.cmd_ptr}.  Pointer = ${this.cmd_ptr} = "${this.state.slice(this.cmd_ptr, this.cmd_ptr + 4)}"`);
        // console.log("STATE:", this.state.join(","));
        // process.exit(0);
        return this.state[0];
    }
    // this.showState();
    // console.log("A:", this.state.join(','));
    // console.log('/////////////////////////////////////////////////////////////////');
    // process.exit(0);
    // console.log(`Ctr ${this.cmd_ctr}, Ptr: ${this.cmd_ptr}`);
    this.cmd_ptr += 4;
    return this.eval()
  }

  run() {
    return this.eval();
  }
}

module.exports = {
  Computer,
};
