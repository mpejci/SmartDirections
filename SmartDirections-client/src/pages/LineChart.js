import { Line } from 'vue-chartjs'
export default {
  watch: {
    update () {
      this.$data._chart.update()
    }
  },
  extends: Line,
  props: ['chartData', 'update'],
  mounted () {
    this.renderChart(this.chartData)
  }
}
