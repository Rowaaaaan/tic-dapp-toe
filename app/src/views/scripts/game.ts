import { ref, reactive } from "vue";
import { Board, Tile } from "./game-objects";

export default {
  setup() {
    const playerOneTurn = ref(true);
    const board = reactive(new Board());

    const setTile = (tile: Tile) => {
      console.log(tile);
      if (!tile.isSet()) {
        playerOneTurn.value
          ? board.setTile("O", tile)
          : board.setTile("X", tile);
        playerOneTurn.value = !playerOneTurn.value;
      } else {
        console.log("Error: Tile already set!");
      }
    };
    return { board, setTile };
  },
};
