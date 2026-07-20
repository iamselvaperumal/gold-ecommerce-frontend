function hexToRgb(hex, fallback) {
  const clean = String(hex || '').replace('#', '')
  if (clean.length !== 6) return fallback
  const value = Number.parseInt(clean, 16)
  if (Number.isNaN(value)) return fallback
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

function drawTinyStar(ctx, x, y, radius, rotation) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.lineCap = 'round'
  ctx.lineWidth = Math.max(0.35, radius * 0.16)
  ctx.beginPath()
  ctx.moveTo(-radius, 0)
  ctx.lineTo(radius, 0)
  ctx.moveTo(0, -radius)
  ctx.lineTo(0, radius)
  ctx.stroke()
  ctx.restore()
}

export class GlitterTrail {
  constructor(config) {
    this.config = config
    this.points = []
    this.maxPoints = config.trailLength ?? 58
    this.primary = hexToRgb(config.palette?.primary, [212, 175, 55])
    this.highlight = hexToRgb(config.palette?.highlight, [247, 231, 169])
  }

  push(x, y) {
    this.points.push({ x, y })
    if (this.points.length > this.maxPoints) this.points.shift()
  }

  draw(ctx, hoverStrength = 0) {
    if (this.points.length < 4) return

    const intensity = this.config.intensity ?? 1
    const len = this.points.length
    const clock = this.config.clock ?? 0

    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    for (let i = 1; i < len - 1; i += 2) {
      const headAmount = i / (len - 1)
      const tailFade = Math.pow(headAmount, 1.55)
      const [r, g, b] = mix(this.primary, this.highlight, Math.pow(headAmount, 2) * 0.85)
      const point = this.points[i]
      const drift = Math.sin(clock * 0.035 + i * 1.7)
      const side = Math.cos(clock * 0.026 + i * 1.3)
      const radius = (0.7 + tailFade * 1.85 + hoverStrength * 0.55) * (0.85 + Math.abs(drift) * 0.35)
      const alpha = Math.min(0.46, (0.05 + tailFade * 0.28 + hoverStrength * 0.08) * intensity)
      const x = point.x + side * (3 + tailFade * 8)
      const y = point.y + drift * (2 + tailFade * 6)

      ctx.globalAlpha = alpha
      ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.45)`
      ctx.shadowBlur = radius * 2.2
      drawTinyStar(ctx, x, y, radius, clock * 0.01 + i)
    }

    const head = this.points[len - 1]
    if (head) {
      ctx.globalAlpha = Math.min(0.72, 0.34 + hoverStrength * 0.22)
      ctx.strokeStyle = this.config.palette?.sparkle || '#FFF8D6'
      ctx.shadowColor = 'rgba(212, 175, 55, 0.52)'
      ctx.shadowBlur = 9 + hoverStrength * 6
      drawTinyStar(ctx, head.x, head.y, 4 + hoverStrength * 1.8, clock * 0.035)
    }

    ctx.restore()
  }
}
