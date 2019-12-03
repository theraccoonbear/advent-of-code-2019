const rgxWDI = /^(?<direction>[UDLR])(?<units>\d+)$/i;

class WireDiagramNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class WireDiagramInstruction {  
  constructor(insStr) {
    if (!rgxWDI.test(insStr)) {
      throw new Error(`Invalid instruction "${insStr}"`);
    }
    const match = rgxWDI.exec(insStr);
    this.direction = match.groups.direction.toUpperCase();
    this.unitss = parseInt(match.groups.units, 10);
  }

  delta() {
    switch(i.direction) {
      case 'U':
        return { x: 0, y: i.units };
      case 'D':
        return { x: 0, y: -i.units };
      case 'R':
        return { x: i.units, y: 0 };        
      case 'L':
        return { x: -i.units, y: 0 };
    }
  }

  fromPos(pos) {
    const d = this.delta();
    return {
      x: pos.x + d.x,
      y: pos.y + d.y
    };
  }
}

class WireDiagramSegment {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class WireDiagram {
  static getBounds(diagram) {
    let maxX = 0, maxY = 0;
    let minX = 0, minY = 0;
    let x = 0, y = 0;
    diagram.forEach(i => {
      switch(i.direction) {
        case 'U':
          y += i.units;
          maxY = Math.max(y, maxY);
          break;
        case 'D':
          y -= i.units;
          minY = Math.min(y, minY);
          break;
        case 'R':
          x += i.units;
          maxX = Math.max(x, maxX);
          break;
        case 'L':
          x -= i.units;
          minX = Math.min(x, minX);
          break;
      }
    });

    return {
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  constructor(diagStr) {
    this.instructions = diagStr
      .split(/\n/)
      .map(line => {
        let curNode = new WireDiagramNode(0, 0);
        const newDiag = { instructions: [], segments: []}
        
        newDiag.instructions = line
          .split(/,/)
          .map(i => {
            const inst = new WireDiagramInstruction(i);
            const nextNode = inst.fromPos(curNode);
            const seg = new WireDiagramSegment(curNode, nextNode);
            newDiag.segments.push(seg);
            curNode = nextNode;
            return inst;
          });
        return newDiag;
      });

    this.segments = this.instructions.map(i => {
      
    });
  }
}

module.exports = {
  WireDiagram,
  WireDiagramInstruction,
  WireDiagramNode,
};
