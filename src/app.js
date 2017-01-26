import p5, { Vector } from 'p5'
import _ from 'lodash'

class Particle {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
  }

  update(gravity) {
    this.velocity.add(gravity);
    this.position.add(this.velocity);
  }

  display(p) {
    const to = this.position.copy().add(this.velocity)
    p.line(this.position.x, this.position.y, to.x, to.y).strokeWeight(2)
  }
}

class Text {
  constructor(position, text) {
    this.position = position;
    this.text = text
    this.size = 12
  }

  update(gravity) {
    this.size = this.size + 5
  }

  display(p, r, g, b, alpha) {
    p.textSize(this.size).fill(r, g, b, alpha).strokeWeight(0)
    p.text(this.text, this.position.x - this.size / 2, this.position.y + this.size / 2)
  }
}

class Particles {
  constructor(p, pos, step, count, color, text) {
    this.step = step
    this.stepMax = step
    this.particles = _.times(count, () => { return new Particle(pos.copy(), Vector.fromAngle(p.random(p.TAU)).mult(p.random(100))) })
    this.text = new Text(pos.copy(), text)
    this.color = color;
  }

  update(gravity) {
    this.particles.forEach(p => p.update(gravity) )
    this.text.update(gravity)
    this.step--;
    return this
  }

  display(p) {
    const r = p.red(this.color),
          g = p.green(this.color),
          b = p.blue(this.color),
          a = 256 * this.step / this.stepMax
    p.push()
    p.colorMode(p.BLEND)
    p.stroke(r, g, b, a)
    this.particles.forEach(pt => pt.display(p))
    this.text.display(p, r, g, b, a)
    p.pop()
  }
}

const createParticles = (p, text) => {
  return new Particles(
    p,
    p.createVector(p.random(p.width - 100) + 50, p.random(p.height / 2) + 100),
    p.random(50, 200),
    Math.floor(p.random(100, 200)),
    p.color(p.random(255), p.random(255), p.random(255)),
    text
  )
}

const update = (particles, gravity) => {
  return particles.map(p => p.update(gravity)).filter(p => p.step > 0)
}

const display = (p, particles) => {
  p.push();
  p.blendMode(p.ADD);
  particles.forEach(pt => pt.display(p))
  p.pop();
}

const sketch = (p) => {
  const gravity = Vector.fromAngle(p.HALF_PI).mult(0.25),
        TEXT = 'おつかれたかし'
  let particles = [],
      texts = TEXT.split('')

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = () => {
    p.blendMode(p.BLEND);
    p.background(0);
    if (p.random(1) < 0.02) {
      particles.push(createParticles(p, texts.shift()))
      if (texts.length === 0) {
        texts = TEXT.split('')
      }
    }
    particles = update(particles, gravity);
    display(p, particles);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}

const app = new p5(sketch, document.body)

