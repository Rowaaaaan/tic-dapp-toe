export class Tile {
	value: string;
	row: number;
	column: number;

	constructor(row?: number, column?: number) {
		this.value = "";
		this.row = row || 0;
		this.column = column || 0;
	}

	set(value: string) {
		this.value = value;
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

	setTile(value: string, pos?: { x: number, y: number }, tile?: Tile) {
		let posX = tile?.row || pos?.x || 0;
		let posY = tile?.column || pos?.y || 0;
		this.rows[posX][posY].set(value);
	}
}
