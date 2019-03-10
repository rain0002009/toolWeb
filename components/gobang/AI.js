import _ from 'lodash'
import Game from './Game'
import { Chess } from './Chess'

export default class AI {
  static criticalArray = []
  static color

  constructor(color) {
    AI.color = this.color = color
  }

  static addCriticalArray(instance) {
    instance.family.forEach((item, type) => {
      if (item) {
        const familyLength = Chess.chessFamily[item[0]]
        const oppositeDirection = type + 4
        const p1 = Chess.findEmpty(instance, type)
        const p2 = Chess.findEmpty(instance, oppositeDirection)
        _.compact([p1, p2]).forEach((p) => {
          let priorityLevel = familyLength >= 3 ? familyLength : 0
          const nearInstance = Chess.findChess(p, p.direction).instance
          if (nearInstance) {
            priorityLevel = nearInstance.family[type] ? familyLength + 2 : familyLength + 1
          }
          priorityLevel *= 2
          priorityLevel && AI.criticalArray.push({ priorityLevel, ...p })
        })
      }
    })
  }

  run() {
    if (Game.isEnd) return false
    AI.criticalArray.sort(function (a, b) {
      return b.priorityLevel - a.priorityLevel
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
