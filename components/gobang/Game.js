import { Chess } from './Chess'
import Player from './Player'
import AI from './AI'

export default class Game {
  static ai
  static box
  static isEnd = false
  static gameEndCallback

  constructor(playerColor, aiColor, box, gameEndCallback) {
    Game.gameEndCallback = gameEndCallback
    Game.box = box
    this.player = new Player(playerColor)
    Game.ai = new AI(aiColor)
  }

  restart() {
    Game.isEnd = false
    Chess.chessInstance = {}
    Chess.chessFamily = {}
    Chess.activeInstance = [[], [], [], [], [], [], [], []]
    while (this.box.firstChild) {
      Game.box.removeChild(this.box.firstChild)
    }
  }
}
