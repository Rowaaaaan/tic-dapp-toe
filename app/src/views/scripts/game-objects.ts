export class Tile {
  value: string | null;
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.value = null;
    this.x = x || 0;
    this.y = y || 0;
  }

  get() {
    return this.value;
  }

  set(value: string) {
    this.value = value;
  }

  isSet() {
    return this.value ? true : false;
  }
}

export class Board {
  rows: Array<Array<Tile>>;

  constructor() {
    let tempRows: Array<Array<Tile>> = [];
    for (let i = 0; i < 3; i++) {
      let row = new Array<Tile>();
      for (let j = 0; j < 3; j++) {
        row.push(new Tile(i, j));
      }
      tempRows.push(row);
    }
    this.rows = tempRows;
  }

  setTile(value: string, tile?: Tile, x?: number, y?: number) {
    let posX = x || tile?.x || 0;
    let posY = y || tile?.y || 0;
    this.rows[posX][posY].set(value);
  }
}
