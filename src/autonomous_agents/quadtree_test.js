class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

class Rectangle {
  constructor (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  contains (point) {
    const { x: px, y: py } = point
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    )
  }

  intersects(range) {
    return !(
      range.x > this.x + this.width ||
      range.x + range.width < this.x ||
      range.y > this.y + this.height ||
      range.y + range.height < this.y
    )
  }
}

class QuadTree {
  constructor (boundary, capcity = 8) {
    this.boundary = boundary
    this.capcity = capcity
    this.points = []
    this.subSections = null
    this.divided = false
  }

  subdivide () {
    const { x, y, width: w, height: h } = this.boundary
    const halfW = w / 2
    const halfH = h / 2

    this.subSections = {
      ne: new QuadTree(new Rectangle(x, y, halfW, halfH)),
      nw: new QuadTree(new Rectangle(x + halfW, y, halfW, halfH)),
      se: new QuadTree(new Rectangle(x, y + halfH, halfW, halfH)),
      sw: new QuadTree(new Rectangle(x + halfW, y + halfH, halfW, halfH))
    }
    this.divided = true
  }

  insert (point) {
    if (!this.boundary.contains(point)) { return false }

    if (this.points.length < this.capcity) {
      this.points.push(point)
      return true
    } else {
      if (!this.divided) { this.subdivide() }
      return this.findSubSectionAndInsert(point)
    }
  }

  findSubSectionAndInsert (point) {
    const foundSubSection = Object.values(this.subSections).find(sub => sub.boundary.contains(point))

    if (foundSubSection) {
      return foundSubSection.insert(point)
    } else {
      return false
    }
  }

  query (range, found) {
    if (!found) { found = [] }

    if (this.boundary.intersects(range)) {
      for (const p of this.points) {
        if (range.contains(p)) {
          found.push(p)
        }
      }

      if (this.divided) {
        Object.values(this.subSections).forEach(section => section.query(range, found))
      }
    }

    return found
  }

  show () {
    stroke(0)
    noFill()
    strokeWeight(1)
    rect(this.boundary.x, this.boundary.y, this.boundary.width, this.boundary.height)

    for (let p of this.points) {
      point(p.x, p.y)
    }

    if (this.divided) {
      Object.values(this.subSections).forEach(section => section.show())
    }
  }
}

const POINT_COUNT = 1000
let qTree

function setup () {
  createCanvas(640, 320)
  qTree = new QuadTree(new Rectangle(0, 0, width, height))

  const [halfW, halfH] = [width / 2, height / 2]
  for (let i = 0; i < POINT_COUNT; i++) {
    const x = randomGaussian(halfW, halfW / 4)
    const y = randomGaussian(halfH, halfH / 4)
    aTree.insert(new Point(x, y))
  }
}

function draw () {
  background(255)
  qTree.show()

  const mouse = new Point(mouseX, mouseY)
  if (!qTree.boundary.contains(mouse)) { return }

  const hoverRange = new Rectangle(mouse.x - 25, mouse.y - 25, 50, 50)

  push()
  strokeWeight(2)
  stroke(255, 50, 50)
  fill(255, 50, 50, 50)
  rect(hoverRange.x, hoverRange.y, hoverRange.width, hoverRange.height)
  const foundPoints = qTree.query(hoverRange)
  foundPoints.forEach(p => {
    strokeWeight(3)
    stroke(50, 50, 50)
    point(p.x, p.y)
  })
  pop()
}
