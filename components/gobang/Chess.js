import _ from 'lodash'
import Game from './Game'
import AI from './AI'

export const CHESSBOARD_SIZE = 25 // 棋盘格子大小
export const SIZE = 15 // 棋盘格子数量
export const GOBANG_SIZE = CHESSBOARD_SIZE * SIZE // 棋盘大小
export const HALF_CHESSBOARD_SIZE = CHESSBOARD_SIZE / 2
export const GOBANG_PADDING = 30 // 棋盘的padding
export const CHESS_SIZE = 8 // 棋子大小
export const MAX_BOUNDARY = SIZE * CHESSBOARD_SIZE - HALF_CHESSBOARD_SIZE
export const keyMap = ['垂直', '水平', '反斜线', '正斜线']

export class Chess {
  static chessInstance = {}
  static chessFamily = {}
  static activeInstance = [[], [], [], [], [], [], [], []]

  constructor (x, y, colorName) {
    this.x = x
    this.y = y
    this.color = colorName
    this.el = document.createElement('div')
    this.el.innerHTML = `<span class="inner-ball" style="width: ${CHESS_SIZE}px; height: ${CHESS_SIZE}px"></span>`
    this.el.classList.add(colorName)
    this.el.style.cssText = `left: ${x}px; top: ${y}px; width: ${CHESSBOARD_SIZE}px; height: ${CHESSBOARD_SIZE}px`
    this.el.addEventListener('click', function (e) {
      e.stopPropagation()
    })
    Game.box.appendChild(this.el)
    this.family = new Array(4).fill(null)
    Chess.chessInstance['' + x + y] = this
  }

  static draw (point) {
    const el = document.createElement('div')
    el.innerHTML = `<span class="inner-ball" style="width: ${CHESS_SIZE}px;height: ${CHESS_SIZE}px;"></span>`
    el.style.cssText = `left: ${point.x}px; top: ${point.y}px; width: ${CHESSBOARD_SIZE}px; height: ${CHESSBOARD_SIZE}px`
    el.classList.add('focal-point')
    Game.box.appendChild(el)
  }

  /**
   * 检测8个方向上棋子是否相连
   * @param instance
   */
  static addFamily (instance) {
    for (let i = 0; i < 8; i++) {
      const type = i >= 4 ? i - 4 : i
      const foundInstance = Chess.findChess(instance, i).instance
      if (foundInstance) {
        _.remove(Chess.activeInstance[i >= 4 ? i - 4 : i + 4], v => v === foundInstance)
        if (foundInstance.color === instance.color) {
          if (instance.family[type]) {
            const instanceFamilyKey = instance.family[type][0]
            if (foundInstance.family[type]) {
              const foundFamilyKey = foundInstance.family[type][0]
              const foundFamilyInstances = Chess.chessFamily[foundFamilyKey]
              Chess.chessFamily[instanceFamilyKey] += foundFamilyInstances
              foundInstance.family[type] = instance.family[type]
              delete Chess.chessFamily[foundFamilyKey]
            } else {
              foundInstance.family[type] = instance.family[type]
              Chess.chessFamily[instanceFamilyKey]++
            }
          } else if (foundInstance.family[type]) {
            const foundFamilyKey = foundInstance.family[type][0]
            instance.family[type] = foundInstance.family[type]
            Chess.chessFamily[foundFamilyKey]++
          } else {
            const key = instance.family[type] = foundInstance.family[type] = [Symbol(keyMap[type])]
            Chess.chessFamily[key[0]] = 2
          }
          const familyLength = Chess.chessFamily[instance.family[type][0]]
          // 游戏结束 平局
          if (familyLength === SIZE * SIZE) {
            Game.isEnd = true
            Game.gameEndCallback(null)
          }
          // 游戏结束
          if (familyLength >= 5) {
            Game.isEnd = true
            Game.gameEndCallback(instance)
          }
        }
      } else {
        const incongruity = new Set()
        if (instance.x <= 0) {
          incongruity.add(5)
          incongruity.add(6)
          incongruity.add(7)
        }
        if (instance.y <= 0) {
          incongruity.add(0)
          incongruity.add(1)
          incongruity.add(7)
        }
        if (instance.x >= MAX_BOUNDARY) {
          incongruity.add(1)
          incongruity.add(2)
          incongruity.add(3)
        }
        if (instance.y >= MAX_BOUNDARY) {
          incongruity.add(3)
          incongruity.add(4)
          incongruity.add(5)
        }
        if (!incongruity.has(i)) {
          Chess.activeInstance[i].push(instance)
        }
      }
    }
    AI.addCriticalArray(instance)
  }

  /**
   * 检查棋子是否超出棋盘
   * @param instance
   * @returns {boolean}
   */
  static beyondBoundary (instance) {
    return instance.x <= 0 || instance.x >= MAX_BOUNDARY || instance.y <= 0 || instance.y >= MAX_BOUNDARY
  }

  /**
   * 查找棋子的端点是否有空位
   * @param instance
   * @param direction
   * @returns {*}
   */
  static findEmpty (instance, direction) {
    let output
    let step = 1
    while (output === undefined) {
      const foundInstance = Chess.findChess(instance, direction, step)
      if (Chess.beyondBoundary(foundInstance)) {
        output = null
      } else if (foundInstance.instance) {
        if (foundInstance.instance.color === instance.color) {
          step++
        } else {
          output = null
        }
      } else {
        output = foundInstance
      }
    }
    return output
  }

  /**
   * 查找相邻棋子
   * @param instance
   * @param direction
   * @param step
   * @returns {{instance: *, x: number, y: number}}
   */
  static findChess (instance, direction, step = 1) {
    let x, y
    const instanceStep = CHESSBOARD_SIZE * step
    switch (direction) {
      case 0: // ↑
        x = instance.x
        y = (instance.y - instanceStep)
        break
      case 1: // ↗
        x = (instance.x + instanceStep)
        y = (instance.y - instanceStep)
        break
      case 2: // →
        x = (instance.x + instanceStep)
        y = instance.y
        break
      case 3: // ↘
        x = (instance.x + instanceStep)
        y = (instance.y + instanceStep)
        break
      case 4: // ↓
        x = instance.x
        y = (instance.y + instanceStep)
        break
      case 5: // ↙
        x = (instance.x - instanceStep)
        y = (instance.y + instanceStep)
        break
      case 6: // ←
        x = (instance.x - instanceStep)
        y = instance.y
        break
      case 7: // ↖
        x = (instance.x - instanceStep)
        y = (instance.y - instanceStep)
    }
    return {
      direction,
      instance: Chess.chessInstance['' + x + y],
      x,
      y
    }
  }

  /**
   * 检查棋子是否已创建
   * @param x
   * @param y
   * @returns {boolean}
   */
  static has (x, y) {
    return !!Chess.chessInstance['' + x + y]
  }
}
