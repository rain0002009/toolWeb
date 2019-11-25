import { Chess } from './Chess'
import Game from './Game'
export default class Player {
  constructor (color) {
    this.color = color
  }

  run (closeX, closeY) {
    if (Game.isEnd) { return false }
    if (!Chess.has(closeX, closeY)) {
      const chess = new Chess(closeX, closeY, this.color)
      Chess.addFamily(chess)
      Game.ai.run()
    }
  }
}
