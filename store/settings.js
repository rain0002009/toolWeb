import store from 'store2'
import _ from 'lodash'

export const state = () => ({
  background: {
    enable: false,
    data: ''
  }
})

export const mutations = {
  setBackground(state, background) {
    store.set('background', background)
    _.assign(state.background, background)
  }
}

export const getters = {
  getBackground: (state) => {
    return state.background.data ? state.background : store.has('background') ? store.get('background') : {
      enable: false,
      data: `:doodle {
        @grid: 50x1 / 50vmin;
        perspective: 23vmin;
        }

        background: @multi(@r(200, 240), (
        radial-gradient(
        @p(#00b8a9, #f8f3d4, #f6416c, #ffde7d) 15%,
        transparent 50%
        ) @r(100%) @r(100%) / @r(1%, 3%, .1) @lr() no-repeat
        ));

        @size: 80%;
        @place-cell: center;

        border-radius: 50%;
        transform-style: preserve-3d;
        animation: scale-up 20s linear infinite;
        animation-delay: calc(@i() * -.4s);

        @keyframes scale-up {
        0% {
        opacity: 0;
        transform: translate3d(0, 0, 0) rotate(0);
        }
        10% {
        opacity: 1;
        }
        95% {
        transform:
        translate3d(0, 0, @r(50vmin, 55vmin))
        rotate(@r(-360deg, 360deg));
        }
        100% {
        opacity: 0;
        transform: translate3d(0, 0, 1vmin);
        }
        }`
    }
  }
}
