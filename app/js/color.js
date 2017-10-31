import * as d3 from 'd3';
import Chart from './chart'

export default class ColorHistogram extends Chart {
  constructor(selector, image) {
    super(selector, 1000, 400, {top: 20, right: 20, bottom: 20, left: 50})

    this.scaleX = d3.scaleLinear().domain([0, 255]).range([0, this.innerWidth])
    this.scaleY = d3.scaleLinear().domain([0, 20000]).range([this.innerHeight, 0])

    this.appendAxis(this.scaleX, this.scaleY)
    this.loadImage(selector, image)
  }

  loadImage(selector, path) {
    let image = new Image()

    image.crossOrigin = 'anonymous'

    let canvas = document.createElement('canvas')
    document.querySelector(selector).appendChild(canvas)
    let context = canvas.getContext('2d')

    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height

      context.drawImage(image, 0, 0)
      let imageData = context.getImageData(0, 0, image.width, image.height)
      this.pixels = imageData.data
      this.initColors()
      this.drawChart()
    }

    image.src = path
  }

  initColors() {
    this.green = []
    this.blue = []
    this.red = []
    let size = 256
    while(size--) this.red[size] = this.green[size] = this.blue[size] = 0

    for(let i = 0; i < this.pixels.length; i += 4) {
      ++this.red[this.pixels[i]]
      ++this.green[this.pixels[i + 1]]
      ++this.blue[this.pixels[i + 2]]
    }
  }

  drawChart() {
    const barWidth = this.innerWidth / this.red.length

    let red = this.chart.selectAll('g.bar')
        .data(this.red)
        .enter().append('g')
        .attr('transform', (d, i) => { return `translate(${i * barWidth}, 0)`})

    red.append('rect')
      .attr('y', (d) => { return this.scaleY(d) })
      .attr('height', d => { console.log(this.scaleY(d)); return this.innerHeight - this.scaleY(d) })
      .attr('width', barWidth)
      .style('fill', 'red')

    let green = this.chart.selectAll('g.bar')
        .data(this.green)
        .enter().append('g')
        .attr('transform', (d, i) => { return `translate(${i * barWidth}, 0)`})


    green.append('rect')
      .attr('y', (d) => { return this.scaleY(d) })
      .attr('height', d => { console.log(this.scaleY(d)); return this.innerHeight - this.scaleY(d) })
      .attr('width', barWidth)
      .style('fill', 'green')

    let blue = this.chart.selectAll('g.bar')
        .data(this.blue)
        .enter().append('g')
        .attr('transform', (d, i) => { return `translate(${i * barWidth}, 0)`})


    blue.append('rect')
      .attr('y', (d) => { return this.scaleY(d) })
      .attr('height', d => { console.log(this.scaleY(d)); return this.innerHeight - this.scaleY(d) })
      .attr('width', barWidth)
      .style('fill', 'blue')
  }
}
