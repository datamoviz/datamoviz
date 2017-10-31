import * as d3 from 'd3';

export default class Chart {
  constructor(selector, width, height, padding) {
    this.innerWidth = width - padding.left - padding.right
    this.innerHeight = height - padding.top - padding.bottom

    this.chart = d3.select(selector).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
        .attr('transform', `translate(${padding.left}, ${padding.top})`)
  }

  appendAxis(scaleX, scaleY) {
    const axisX = d3.axisBottom(scaleX)
    const axisY = d3.axisLeft(scaleY)

    this.chart.append('g')
      .attr('class', 'axis axis-y')
      .call(axisY)

    this.chart.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${this.innerHeight})`)
      .call(axisX)
  }
}
