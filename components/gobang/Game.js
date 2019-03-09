import { Chess } from './Chess'
import Player from './Player'
import AI from './AI'

export default class Game {
  static ai
  static box
  static isEnd = false
  static gameEndCallback

  constructor(playerColor, aiColor, box, gameEndCallback) {
    this.playerColor = playerColor
    this.aiColor = aiColor
    Game.gameEndCallback = gameEndCallback
    Game.box = box
    this.player = new Player(this.playerColor)
    Game.ai = new AI(aiColor)
  }

  restart() {
    AI.criticalArray = []
    Game.isEnd = false
    Chess.chessInstance = {}
    Chess.chessFamily = {}
    Chess.activeInstance = [[], [], [], [], [], [], [], []]
    const chessNodes = [...Game.box.querySelectorAll(`.${this.playerColor}`), ...Game.box.querySelectorAll(`.${this.aiColor}`)]
    chessNodes.forEach((node) => {
      Game.box.removeChild(node)
    })
  }
}
