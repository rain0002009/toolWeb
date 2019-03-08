<template>
  <div ref="gobang" class="gobang-main-box" :style="{padding: GOBANG_PADDING + 'px'}" @click="createChess">
    <div ref="boardBox" class="board-box">
      <div v-for="row in SIZE" :key="'row' + row" class="row">
        <div v-for="col in SIZE" :key="'row' + row+'col'+col" class="col"></div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

const CHESSBOARD_SIZE = 25 // 棋盘格子大小
const SIZE = 15 // 棋盘格子数量
const GOBANG_SIZE = CHESSBOARD_SIZE * SIZE // 棋盘大小
const HALF_CHESSBOARD_SIZE = CHESSBOARD_SIZE / 2
const GOBANG_PADDING = 30 // 棋盘的padding
const CHESS_SIZE = 8 // 棋子大小
const keyMap = ['垂直', '水平', '反斜线', '正斜线']

class Game {
  static ai
  static box
  static isEnd = false

  constructor(playerColor, aiColor, box, gameEndCallback) {
    Chess.gameEndCallback = gameEndCallback
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
      this.box.removeChild(this.box.firstChild)
    }
  }
}

class Chess {
  static chessInstance = {}
  static chessFamily = {}
  static activeInstance = [[], [], [], [], [], [], [], []]
  static gameEndCallback

  constructor(x, y, colorName) {
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

  static addFamily(instance) {
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
          if (Chess.chessFamily[instance.family[type][0]] >= 5) {
            Game.isEnd = true
            Chess.gameEndCallback(instance)
          }
        }
      } else {
        const MAX_BOUNDARY = SIZE * CHESSBOARD_SIZE - HALF_CHESSBOARD_SIZE
        const inconformity = new Set()
        if (instance.x <= 0) {
          inconformity.add(5)
          inconformity.add(6)
          inconformity.add(7)
        }
        if (instance.y <= 0) {
          inconformity.add(0)
          inconformity.add(1)
          inconformity.add(7)
        }
        if (instance.x >= MAX_BOUNDARY) {
          inconformity.add(1)
          inconformity.add(2)
          inconformity.add(3)
        }
        if (instance.y >= MAX_BOUNDARY) {
          inconformity.add(3)
          inconformity.add(4)
          inconformity.add(5)
        }
        if (!inconformity.has(i)) {
          Chess.activeInstance[i].push(instance)
        }
      }
    }
  }

  static findChess(instance, direction, step = 1) {
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
      instance: Chess.chessInstance['' + x + y],
      x,
      y
    }
  }

  static has(x, y) {
    return !!Chess.chessInstance['' + x + y]
  }
}

class Player {
  constructor(color) {
    this.color = color
  }

  run(closeX, closeY) {
    if (!Chess.has(closeX, closeY)) {
      const chess = new Chess(closeX, closeY, this.color)
      Chess.addFamily(chess)
      !Game.isEnd && Game.ai.run()
    }
  }
}

class AI {
  constructor(color) {
    this.color = color
  }

  run() {
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

export default {
  name: 'GoBang',
  data() {
    return {
      GOBANG_PADDING,
      SIZE,
      round: true
    }
  },
  computed: {
    boardBox() {
      return this.$refs.boardBox
    },
    gobang() {
      return this.$refs.gobang
    },
    gobangBoundingClientRect() {
      return this.gobang.getBoundingClientRect()
    }
  },
  mounted() {
    window.Chess = Chess
    this.startGame()
  },
  methods: {
    startGame() {
      this.game = new Game('black', 'white', this.boardBox, (instance) => {
        this.$message.info(instance.color + ' win')
      })
    },
    createChess(e) {
      let x = e.clientX - this.gobangBoundingClientRect.left - GOBANG_PADDING
      let y = e.clientY - this.gobangBoundingClientRect.top - GOBANG_PADDING
      x = x < 0 ? 0 : x > GOBANG_SIZE ? GOBANG_SIZE : x
      y = y < 0 ? 0 : y > GOBANG_SIZE ? GOBANG_SIZE : y
      const xIndex = x / HALF_CHESSBOARD_SIZE >> 0
      const yIndex = y / HALF_CHESSBOARD_SIZE >> 0
      const xSize = xIndex & 1 ? (xIndex + 1) / 2 : xIndex / 2
      const ySize = yIndex & 1 ? (yIndex + 1) / 2 : yIndex / 2
      const closeX = xSize * CHESSBOARD_SIZE - HALF_CHESSBOARD_SIZE
      const closeY = ySize * CHESSBOARD_SIZE - HALF_CHESSBOARD_SIZE
      this.game.player.run(closeX, closeY)
    }
  }
}
</script>

<style lang="scss">
  .gobang-main-box {
    $SIZE: 25px;
    display: inline-block;
    margin-top: 40px;
    width: ($SIZE + 4) * 15;

    .board-box {
      position: relative;
    }

    .white {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;

      .inner-ball {
        content: '';
        display: inline-block;
        background-color: #fff;
        border-radius: 50%;
      }
    }

    .black {
      @extend .white;

      .inner-ball {
        background-color: #000;
      }
    }

    .row {
      display: flex;
      position: relative;

      & + .row {
        .col {
          border-top: 0;
        }
      }

      .col {
        width: $SIZE;
        height: $SIZE;
        border: 1px solid #000;
        flex-basis: $SIZE;

        & + .col {
          border-left: 0;
        }
      }
    }
  }
</style>
