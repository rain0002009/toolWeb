import _ from 'lodash'
import Game from './Game'
import { Chess } from './Chess'

export default class AI {
  static criticalArray = []
  static color

  constructor(color) {
    AI.color = this.color = color
  }

  static addCriticalArray(instance, familyLength, i) {
    if (familyLength >= 3) {
      const p1 = Chess.findEmpty(instance, i)
      const p2 = Chess.findEmpty(instance, i >= 4 ? i - 4 : i + 4)
      const priorityLevel = instance.color !== AI.color ? familyLength + 1 : familyLength
      p1 && AI.criticalArray.push({ priorityLevel, ...p1 })
      p2 && AI.criticalArray.push({ priorityLevel, ...p2 })
    }
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
