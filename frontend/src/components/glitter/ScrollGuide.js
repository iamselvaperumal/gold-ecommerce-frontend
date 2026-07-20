const DEFAULT_WAYPOINT_SELECTORS = [
  '[data-glitter-guide="hero"]',
  '[data-glitter-guide="rate"]',
  '[data-glitter-guide="categories"]',
  '[data-glitter-guide="coins"]',
  '[data-glitter-guide="featured"]',
  '[data-glitter-guide="cta"]',
  '.store-banner',
  '.store-category-card',
  '.store-promo-grid',
  '.product-grid',
  '.newsletter',
]

function pointForElement(el, index) {
  const rect = el.getBoundingClientRect()
  const sideBias = index % 2 === 0 ? 0.26 : 0.72
  return {
    x: rect.left + rect.width * sideBias,
    y: rect.top + rect.height * 0.5,
  }
}

function isUsablePoint(point) {
  return Number.isFinite(point.x) && Number.isFinite(point.y)
}

export class ScrollGuide {
  constructor(selectors = DEFAULT_WAYPOINT_SELECTORS) {
    this.selectors = selectors?.length ? selectors : DEFAULT_WAYPOINT_SELECTORS
    this.waypoints = []
    this._build = this._build.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._build()
    window.addEventListener('scroll', this._onScroll, { passive: true })
    window.addEventListener('resize', this._build, { passive: true })
  }

  _build() {
    const pts = []
    this.selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        if (rect.width < 12 || rect.height < 12) return
        if (rect.bottom < -window.innerHeight * 0.5 || rect.top > window.innerHeight * 1.5) return
        const point = pointForElement(el, pts.length + index)
        if (isUsablePoint(point)) pts.push(point)
      })
    })

    pts.sort((a, b) => a.y - b.y || a.x - b.x)
    const filtered = []
    for (const point of pts) {
      const previous = filtered[filtered.length - 1]
      if (!previous || Math.hypot(previous.x - point.x, previous.y - point.y) > 90) filtered.push(point)
    }

    this.waypoints = filtered.length ? filtered : [
      { x: window.innerWidth * 0.14, y: window.innerHeight * 0.36 },
      { x: window.innerWidth * 0.78, y: window.innerHeight * 0.45 },
      { x: window.innerWidth * 0.36, y: window.innerHeight * 0.68 },
    ]
  }

  _onScroll() {
    if (this.scrollFrame) return
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = null
      this._build()
    })
  }

  destroy() {
    if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame)
    window.removeEventListener('scroll', this._onScroll)
    window.removeEventListener('resize', this._build)
  }
}