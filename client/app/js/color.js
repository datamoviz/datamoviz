import * as d3 from 'd3';
import Chart from './chart'

export default class ColorHistogram extends Chart {
  constructor(selector) {
    super(selector, 1000, 400, {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    })

    this.scaleX = d3.scaleLinear().domain([0, 255]).range([0, this.innerWidth])
    this.scaleY = d3.scaleLinear().domain([0, 20000]).range([this.innerHeight, 0])

    this.renderAxis(this.scaleX, this.scaleY)
  }

  render(path) {
    this.loadImage(path)
  }

  loadImage(path) {
    let image = new Image()

    image.crossOrigin = 'anonymous'

    let canvas = document.createElement('canvas')
    document.querySelector(this.selector).appendChild(canvas)
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
    while (size--) this.red[size] = this.green[size] = this.blue[size] = 0

    for (let i = 0; i < this.pixels.length; i += 4) {
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
      .attr('transform', (d, i) => {
        return `translate(${i * barWidth}, 0)`
      })

    red.append('rect')
      .attr('y', d => {
        return this.scaleY(d)
      })
      .attr('height', d => {
        return this.innerHeight - this.scaleY(d)
      })
      .attr('width', barWidth)
      .style('fill', 'red')

    let colors = {
      'red': this.red,
      'green': this.green,
      'blue': this.blue
    }

    Object.keys(colors).forEach(color => {
      this.chart.selectAll('g.bar')
        .data(colors[color])
        .enter().append('g')
        .attr('transform', (d, i) => {
          return `translate(${i * barWidth}, 0)`
        })
        .append('rect')
        .attr('y', (d) => {
          return this.scaleY(d)
        })
        .attr('height', d => {
          return this.innerHeight - this.scaleY(d)
        })
        .attr('width', barWidth)
        .style('fill', color)
    });
  }
}
