<template>
  <div class="flip-item down" :class="{'is-animating': isAnimating}">
    <!-- 位于前面的纸牌 -->
    <div class="digital front" :data-number="frontValue" @animationend="handleAnimationend" />
    <!-- 位于后面的纸牌 -->
    <div class="digital back" :data-number="back" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class FlipItem extends Vue {
  @Prop() readonly front
  @Prop() readonly back
  isAnimating = 0
  frontValue = 0

  @Watch('front', { immediate: true })
  onFrontChange () {
    !this.isAnimating && this.animate()
  }

  animate () {
    this.isAnimating = 1
  }

  async handleAnimationend () {
    await this.$nextTick()
    this.frontValue = this.back
    this.isAnimating = 0
  }
}
</script>

<style lang="scss">
  .flip-item {
    $baseColor: lighten(#001529, 5%);
    $borderColor: lighten(rgba($baseColor, .5), 40%);
    $borderRadius: 5px;
    display: inline-block;
    position: relative;
    width: 60px;
    height: 100px;
    line-height: 100px;
    border-radius: $borderRadius;
    background: transparent;
    font-size: 80%;
    color: #fff;
    box-shadow: 0 0 6px rgba($baseColor, .5);
    text-align: center;

    .digital {
      &::after, &::before {
        content: attr(data-number);
        position: absolute;
        left: 0;
        right: 0;
        background: $baseColor;
        overflow: hidden;
        box-sizing: border-box;
      }

      &::before {
        top: 0;
        bottom: 50%;
        border-radius: $borderRadius $borderRadius 0 0;
        border-bottom: solid 1px $borderColor;
      }

      &::after {
        top: 50%;
        bottom: 0;
        border-radius: 0 0 $borderRadius $borderRadius;
        line-height: 0;
      }
    }

    &.down {
      .front {
        &::before {
          z-index: 3;
        }

        &::after {
          z-index: 1;
        }
      }

      .back {
        &::after {
          z-index: 2;
          transform-origin: 50% 0;
          transform: perspective(160px) rotateX(180deg);
        }

        &::before {
          z-index: 1;
        }
      }

      &.is-animating {
        .front {
          &::before {
            transform-origin: 50% 100%;
            animation: flip-down .6s ease-in-out both;
            backface-visibility: hidden;
          }
        }

        .back {
          &::after {
            animation: flip-down-back .6s ease-in-out both;
          }
        }
      }
    }

    @keyframes flip-down {
      0% {
        transform: perspective(160px) rotateX(0deg);
      }

      100% {
        transform: perspective(160px) rotateX(-180deg);
      }
    }

    @keyframes flip-down-back {
      0% {
        transform: perspective(160px) rotateX(180deg);
      }

      100% {
        transform: perspective(160px) rotateX(0deg);
      }
    }
  }
</style>
