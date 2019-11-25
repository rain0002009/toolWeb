<template>
  <div ref="gobang" class="gobang-main-box" :style="{padding: GOBANG_PADDING + 'px'}" @click="createChess">
    <div ref="boardBox" class="board-box">
      <div v-for="row in SIZE" :key="'row' + row" class="row">
        <div v-for="col in SIZE" :key="'row' + row+'col'+col" class="col" />
      </div>
    </div>
  </div>
</template>

<script>
import { SIZE, GOBANG_PADDING, GOBANG_SIZE, HALF_CHESSBOARD_SIZE, CHESSBOARD_SIZE } from './Chess'
import Game from './Game'

export default {
  name: 'GoBang',
  props: {
    gameEndCallback: {
      type: Function,
      default () {
        return () => {
        }
      }
    }
  },
  data () {
    return {
      GOBANG_PADDING,
      SIZE,
      round: true
    }
  },
  computed: {
    boardBox () {
      return this.$refs.boardBox
    },
    gobang () {
      return this.$refs.gobang
    },
    gobangBoundingClientRect () {
      return this.gobang.getBoundingClientRect()
    }
  },
  mounted () {
    this.startGame()
  },
  methods: {
    restart () {
      this.game.restart()
    },
    startGame () {
      this.game = new Game('black', 'white', this.boardBox, this.gameEndCallback)
    },
    createChess (e) {
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

    .focal-point {
      @extend .white;

      .inner-ball {
        background-color: rgba(red, .7);
        border: 1px solid;
        z-index: 1;
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
