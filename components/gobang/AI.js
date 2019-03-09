import _ from 'lodash'
import Game from './Game'
import { Chess } from './Chess'

export default class AI {
  static criticalArray = []
  static color

  constructor(color) {
    AI.color = this.color = color
  }

  run() {
    if (Game.isEnd) return false
    AI.criticalArray.sort(function (a, b) {
      return a.priorityLevel < b.priorityLevel
    })
    while (AI.criticalArray.length) {
      const point = AI.criticalArray.pop()
      if (!Chess.has(point.x, point.y)) {
        const aiInstance = new Chess(point.x, point.y, this.color)
        return Chess.addFamily(aiInstance)
      }
    }
    const activeIndexArray = []
    _.forEach(Chess.activeInstance, (item, index) => {
      if (!_.isEmpty(item)) {
        activeIndexArray.push(index)
      }
    })
    if (activeIndexArray.length) {
      const chooseIndex = activeIndexArray[_.random(0, activeIndexArray.length - 1)]
      const chooseArray = Chess.activeInstance[chooseIndex]
      const instanceKey = _.random(chooseArray.length - 1)
      const instance = chooseArray[instanceKey]
      const findEmpty = Chess.findChess(instance, chooseIndex)
      const aiInstance = new Chess(findEmpty.x, findEmpty.y, this.color)
      Chess.addFamily(aiInstance)
    }
  }
}
