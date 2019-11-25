export default class MusicPlayer {
  // 确定频域的快速傅里叶变换大小
  static fftSize = 2048
  // 这个属性可以让最后一个分析帧的数据随时间使值之间的过渡更平滑。
  static smoothingTimeConstant = 0.6

  constructor (readyCallback) {
    this.ctx = new (AudioContext || window.webkitAudioContext)()
    this.gainNode = this.ctx.createGain()
    this.source = this.ctx.createBufferSource()
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = MusicPlayer.fftSize
    this.analyser.smoothingTimeConstant = MusicPlayer.smoothingTimeConstant
    this.callback = readyCallback ? [readyCallback] : []
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
  }

  decodeAudio (buffer) {
    this.ctx.decodeAudioData(buffer, this.getBufferSuccess.bind(this))
  }

  getBufferSuccess (buffer) {
    // 填充音频buffer数据
    this.source.buffer = buffer
    // 连接节点对象
    this.source.connect(this.gainNode)
    this.gainNode.connect(this.analyser)
    this.analyser.connect(this.ctx.destination)
    this.callback.forEach(f => f && f())
  }

  play (index = 0) {
    this.source.start(index)
  }

  getData () {
    this.analyser.getByteFrequencyData(this.dataArray)
    return this.dataArray
  }

  ready (f) {
    this.callback.push(f)
  }
}
