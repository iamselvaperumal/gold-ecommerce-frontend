const DEFAULT_HOVER_SELECTORS = [
  '[data-glitter-hover]',
  '.product-card',
  '.store-promo',
  '.store-cat',
  '.store-btn',
  '.view-all-link',
  '.newsletter-form button',
  '.product-cart-btn',
  '.promo-carousel-controls button',
  '.store-cat-arrow',
  '.store-banner',
]

export class HoverInteraction {
  constructor(onHover, onLeave, selectors = DEFAULT_HOVER_SELECTORS) {
    this.onHover = onHover
    this.onLeave = onLeave
    this.selectors = selectors?.length ? selectors : DEFAULT_HOVER_SELECTORS
    this.attached = new Set()
    this.current = null
    this._handleEnter = this._handleEnter.bind(this)
    this._handleLeave = this._handleLeave.bind(this)
  }

  scan() {
    const elements = document.querySelectorAll(this.selectors.join(','))
    elements.forEach(el => {
      if (this.attached.has(el)) return
      el.addEventListener('mouseenter', this._handleEnter, { passive: true })
      el.addEventListener('mouseleave', this._handleLeave, { passive: true })
      this.attached.add(el)
    })

    for (const el of this.attached) {
      if (document.contains(el)) continue
      el.removeEventListener('mouseenter', this._handleEnter)
      el.removeEventListener('mouseleave', this._handleLeave)
      el.classList.remove('luxury-glitter-hover')
      this.attached.delete(el)
    }
  }

  _handleEnter(event) {
    if (this.current && this.current !== event.currentTarget) {
      this.current.classList.remove('luxury-glitter-hover')
    }
    this.current = event.currentTarget
    this.current.classList.add('luxury-glitter-hover')
    this.onHover(this.current)
  }

  _handleLeave() {
    if (this.current) this.current.classList.remove('luxury-glitter-hover')
    this.current = null
    this.onLeave()
  }

  destroy() {
    for (const el of this.attached) {
      el.removeEventListener('mouseenter', this._handleEnter)
      el.removeEventListener('mouseleave', this._handleLeave)
      el.classList.remove('luxury-glitter-hover')
    }
    this.attached.clear()
  }
}