import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#f472b6', '#f59e0b', '#60a5fa']

// ── SVG ICONS ──
const IconShield = ({ color, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconStore = ({ color, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1-5h16l1 5"/><path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/>
    <path d="M4 9v10h16V9"/><path d="M9 21v-6h6v6"/>
  </svg>
)
const IconLink = ({ color, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)
const IconStar = ({ color, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconUser = ({ color, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconPhone = ({ color, size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const IconMapPin = ({ color, size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconPrinter = ({ color, size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
)
const IconChart = ({ color, size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const IconSearch = ({ color, size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconX = ({ color, size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconBack = ({ color, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)
const IconBuilding = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20"/><line x1="9" y1="6" x2="9" y2="6"/><line x1="15" y1="6" x2="15" y2="6"/>
    <line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="9" y2="14"/>
    <line x1="15" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/>
  </svg>
)
const IconChevronDown = ({ color, size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const ROLE_CFG = {
  admin: { color: '#22d3ee', Icon: IconShield, label: 'ADMIN', idKey: 'admin_id' },
  dealer: { color: '#4ade80', Icon: IconStore, label: 'DEALER', idKey: 'dealer_id' },
  sub_dealer: { color: '#f59e0b', Icon: IconLink, label: 'SUB DEALER', idKey: 'sub_dealer_id' },
  promotor: { color: '#a78bfa', Icon: IconStar, label: 'PROMOTOR', idKey: 'promotor_id' },
  customer: { color: '#f472b6', Icon: IconUser, label: 'CUSTOMER', idKey: 'customer_id' },
}

// ── raw SVG strings for innerHTML (DOM popup-ku react component use panna mudiyathu) ──
function iconSvg(paths, color, size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
}
const ICON_PATHS = {
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  store: '<path d="M3 9l1-5h16l1 5"/><path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/><path d="M4 9v10h16V9"/><path d="M9 21v-6h6v6"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mappin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
}
const ICON_BY_TYPE = { admin: 'shield', dealer: 'store', sub_dealer: 'link', promotor: 'star', customer: 'user' }

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

let _chainHideTimer = null
function removeChainPopup() {
  document.querySelectorAll('#chain-popup').forEach(el => el.remove())
}
function scheduleHideChainPopup() {
  clearTimeout(_chainHideTimer)
  _chainHideTimer = setTimeout(() => removeChainPopup(), 200)
}

function printPersonCard(node, role, cfg, color, ancestors, superAdminEmail) {
  const chain = [
    { type: 'super_admin', data: { email: superAdminEmail } },
    ...ancestors.map(a => ({ type: a.role, data: a.node })),
    { type: role, data: node },
  ]
  const chainHtml = chain.map((item, idx) => {
    const isLast = idx === chain.length - 1
    if (item.type === 'super_admin') {
      return `<div class="chain-item ${isLast ? 'current' : ''}">
        <div class="chain-role">SUPER ADMIN</div>
        <div class="chain-email">${item.data.email || '—'}</div>
      </div>${idx < chain.length - 1 ? `<div class="chain-arrow">↓</div>` : ''}`
    }
    const r = ROLE_CFG[item.type]
    if (!r) return ''
    const d = item.data || {}
    const idVal = d[r.idKey] || d.id || '—'
    const name = [d.first_name, d.last_name].filter(Boolean).join(' ') || '—'
    const phone = d.mobile_number || '—'
    const city = d.city_name || '—'
    return `<div class="chain-item ${isLast ? 'current' : ''}">
      <div class="chain-role">${r.label}</div>
      <div class="chain-id">${idVal}</div>
      <div class="chain-name">${name}</div>
      <div class="chain-info">Tel: ${phone}</div>
      <div class="chain-info">${city}</div>
    </div>${idx < chain.length - 1 ? `<div class="chain-arrow">↓</div>` : ''}`
  }).join('')
  const currentName = [node.first_name, node.last_name].filter(Boolean).join(' ') || '—'
  const roleLabel = ROLE_CFG[role]?.label || role.toUpperCase()
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html><html><head><title>${roleLabel} — ${currentName}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:'Inter',system-ui,sans-serif; background:#f8fafc; padding:40px; display:flex; justify-content:center; }
      .wrapper { max-width:480px; width:100%; }
      .header { text-align:center; margin-bottom:28px; }
      .header h1 { font-size:20px; font-weight:800; color:#020617; }
      .header p { font-size:12px; color:#64748b; margin-top:4px; }
      .chain-item { background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px 18px; margin-bottom:8px; }
      .chain-item.current { border-color:${color}; background:${color}11; }
      .chain-role { font-size:10px; font-weight:800; color:#64748b; letter-spacing:1px; margin-bottom:4px; text-transform:uppercase; }
      .chain-item.current .chain-role { color:${color}; }
      .chain-id { font-family:monospace; font-size:11px; color:${color}; margin-bottom:4px; }
      .chain-name { font-size:16px; font-weight:800; color:#020617; margin-bottom:6px; }
      .chain-email { font-size:12px; color:#475569; }
      .chain-info { font-size:12px; color:#475569; margin-top:3px; }
      .chain-arrow { text-align:center; color:#94a3b8; margin:4px 0; font-size:14px; }
      .footer { text-align:center; font-size:10px; color:#94a3b8; margin-top:24px; letter-spacing:0.5px; }
      @media print { body { background:white; padding:20px; } }
    </style></head>
    <body><div class="wrapper">
      <div class="header"><h1>BitByte — ${roleLabel} Profile</h1><p>Hierarchy Chain Report</p></div>
      ${chainHtml}
      <div class="footer">Printed on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
    </div>
    <script>window.onload = () => { window.print() }<\/script>
    </body></html>
  `)
  printWindow.document.close()
}

function showChainPopup(anchorEl, ancestors, current, dark, text, subtext, superAdminEmail) {
  clearTimeout(_chainHideTimer)
  removeChainPopup()

  const chain = [
    { type: 'super_admin', data: { email: superAdminEmail } },
    ...ancestors.map(a => ({ type: a.role, data: a.node })),
    { type: current.role, data: current.node },
  ]

  const el = document.createElement('div')
  el.id = 'chain-popup'

  if (!document.getElementById('chain-popup-styles')) {
    const s = document.createElement('style')
    s.id = 'chain-popup-styles'
    s.textContent = `
      #chain-popup::-webkit-scrollbar{width:6px}
      #chain-popup::-webkit-scrollbar-track{background:rgba(255,255,255,0.03);border-radius:10px;margin:4px 0}
      #chain-popup::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#22d3ee,#4ade80);border-radius:10px;box-shadow:0 0 6px rgba(34,211,238,0.4)}
      #chain-popup::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#67e8f9,#86efac)}
      #chain-popup{scrollbar-color:rgba(34,211,238,0.5) rgba(255,255,255,0.03)}
      @keyframes acpSlideIn{from{opacity:0;transform:translateX(18px) scale(0.95)}to{opacity:1;transform:translateX(0) scale(1)}}
      @keyframes acpPulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
      @keyframes acpGlow{0%,100%{box-shadow:0 0 0px rgba(34,211,238,0)}50%{box-shadow:0 0 20px rgba(34,211,238,0.22)}}
      @keyframes acpShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      @keyframes acpBadgePop{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
    `
    document.head.appendChild(s)
  }

  const isDark = dark
  el.style.cssText = `
    position:fixed; z-index:9999;
    background:${isDark ? 'rgba(5,10,20,0.97)' : 'rgba(248,250,252,0.98)'};
    border:1px solid ${isDark ? 'rgba(34,211,238,0.22)' : 'rgba(37,99,235,0.18)'};
    border-radius:20px; padding:20px;
    box-shadow:${isDark
      ? '0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(34,211,238,0.06), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(37,99,235,0.05)'};
    animation:acpSlideIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
    min-width:200px; max-width:260px;
    max-height:85vh; overflow-y:auto; overflow-x:hidden;
    scroll-behavior:smooth; scrollbar-width:thin;
    scroll-padding:8px;
    -webkit-overflow-scrolling:touch;
    backdrop-filter:blur(28px);
    font-family:'Inter',system-ui,sans-serif;
  `

  const totalNodes = chain.length

  const itemsHtml = chain.map((item, idx) => {
    const isLast = idx === chain.length - 1
    const isSuperAdmin = item.type === 'super_admin'

    const arrowHtml = idx > 0 ? `
      <div style="display:flex;justify-content:center;padding:5px 0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;">
          <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:7px solid rgba(34,211,238,0.5);"></div>
          <div style="width:1.5px;height:16px;background:linear-gradient(180deg,rgba(34,211,238,0.1),rgba(34,211,238,0.65));"></div>
        </div>
      </div>` : ''

    if (isSuperAdmin) {
      return `
        ${arrowHtml}
        <div style="
          border-radius:14px;padding:14px 16px;
          background:${isDark ? 'linear-gradient(135deg,rgba(255,215,0,0.09),rgba(255,140,0,0.04))' : 'linear-gradient(135deg,rgba(255,215,0,0.14),rgba(255,140,0,0.06))'};
          border:1px solid rgba(255,215,0,0.28);
          position:relative;overflow:hidden;
        ">
          <div style="position:absolute;top:-10px;right:-10px;width:70px;height:70px;background:radial-gradient(circle,rgba(255,215,0,0.14),transparent 70%);pointer-events:none;"></div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#ffd700,#ff8c00);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(255,215,0,0.35);">${iconSvg(ICON_PATHS.shield, '#1a1200', 15)}</div>
            <div>
              <div style="font-size:9px;color:#ffd700;font-weight:800;letter-spacing:1.8px;">SUPER ADMIN</div>
              <div style="font-size:8px;color:rgba(255,215,0,0.45);margin-top:2px;letter-spacing:0.5px;">ROOT • FULL ACCESS</div>
            </div>
            <div style="margin-left:auto;display:flex;align-items:center;gap:5px;">
              <div style="width:7px;height:7px;border-radius:50%;background:#4ade80;animation:acpPulse 1.8s ease-in-out infinite;box-shadow:0 0 8px rgba(74,222,128,0.9);"></div>
              <span style="font-size:9px;color:#4ade80;font-weight:700;">LIVE</span>
            </div>
          </div>
          <div style="font-size:12px;color:${isDark ? '#cbd5e1' : '#475569'};word-break:break-all;font-family:monospace;letter-spacing:0.3px;">${item.data.email || '—'}</div>
        </div>
      `
    }

    const cfg = ROLE_CFG[item.type]
    if (!cfg) return ''
    const d = item.data || {}
    const idVal = d[cfg.idKey] || d.id || '—'
    const name = [d.first_name, d.last_name].filter(Boolean).join(' ') || '—'
    const phone = d.mobile_number || '—'
    const city = d.city_name || ''
    const rc = hexToRgb(cfg.color)
    const iconKey = ICON_BY_TYPE[item.type]

    return `
      ${arrowHtml}
      <div style="
        border-radius:14px;padding:14px 16px;
        background:${isLast
        ? `linear-gradient(135deg,rgba(${rc},0.13),rgba(${rc},0.05))`
        : `rgba(${rc},0.04)`};
        border:${isLast
        ? `1.5px solid rgba(${rc},0.55)`
        : `1px solid rgba(${rc},0.16)`};
        position:relative;overflow:hidden;
        ${isLast ? `animation:acpGlow 3s ease-in-out infinite;` : ''}
      ">
        ${isLast ? `<div style="position:absolute;top:-15px;right:-15px;width:80px;height:80px;background:radial-gradient(circle,rgba(${rc},0.18),transparent 70%);pointer-events:none;"></div>` : ''}

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:11px;">
          <div style="width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,${cfg.color},rgba(${rc},0.45));display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(${rc},0.3);">${iconSvg(ICON_PATHS[iconKey], '#020617', 15)}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:9px;color:${cfg.color};font-weight:800;letter-spacing:1.8px;">${cfg.label}</div>
            <div style="font-size:9px;color:${cfg.color};font-family:monospace;opacity:0.6;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${idVal}</div>
          </div>
          ${isLast ? `
          <div style="font-size:8px;font-weight:800;padding:3px 9px;border-radius:20px;
            background:rgba(${rc},0.18);color:${cfg.color};
            border:1px solid rgba(${rc},0.4);
            animation:acpBadgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
            white-space:nowrap;letter-spacing:0.5px;">● CURRENT</div>` : ''}
        </div>

        <div style="font-size:14px;color:${isDark ? '#f1f5f9' : '#0f172a'};font-weight:700;margin-bottom:9px;letter-spacing:-0.3px;">${name}</div>

        <div style="display:flex;flex-direction:column;gap:6px;">
          ${phone !== '—' ? `
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:20px;height:20px;border-radius:6px;background:rgba(${rc},0.12);border:1px solid rgba(${rc},0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${iconSvg(ICON_PATHS.phone, cfg.color, 11)}</div>
            <span style="font-size:12px;color:${isDark ? '#94a3b8' : '#64748b'};">${phone}</span>
          </div>` : ''}
          ${city ? `
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:20px;height:20px;border-radius:6px;background:rgba(${rc},0.12);border:1px solid rgba(${rc},0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${iconSvg(ICON_PATHS.mappin, cfg.color, 11)}</div>
            <span style="font-size:12px;color:${isDark ? '#94a3b8' : '#64748b'};">${city}</span>
          </div>` : ''}
        </div>
      </div>
    `
  }).join('')

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid ${isDark ? 'rgba(34,211,238,0.1)' : 'rgba(37,99,235,0.08)'};">
      <div style="display:flex;align-items:center;gap:9px;">
        <div style="width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#22d3ee,#4ade80);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(34,211,238,0.4);">${iconSvg(ICON_PATHS.link, '#020617', 13)}</div>
        <div>
          <div style="font-size:11px;color:${isDark ? '#22d3ee' : '#2563eb'};font-weight:800;letter-spacing:1.8px;">HIERARCHY CHAIN</div>
          <div style="font-size:9px;color:${isDark ? '#475569' : '#94a3b8'};margin-top:2px;">${totalNodes} level${totalNodes !== 1 ? 's' : ''} deep</div>
        </div>
      </div>
      <div style="
        font-size:9px;font-weight:800;padding:4px 11px;border-radius:20px;
        background:linear-gradient(90deg,rgba(34,211,238,0.15),rgba(74,222,128,0.12),rgba(34,211,238,0.15));
        background-size:200% auto;
        animation:acpShimmer 2.5s linear infinite;
        border:1px solid rgba(34,211,238,0.22);
        color:${isDark ? '#67e8f9' : '#2563eb'};
        letter-spacing:1px;">● LIVE</div>
    </div>

    ${itemsHtml}

    <div style="margin-top:14px;padding-top:12px;border-top:1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'};">
      <div style="font-size:9px;color:${isDark ? '#334155' : '#cbd5e1'};text-align:center;letter-spacing:0.8px;font-weight:600;">BitByte Network • Hierarchy View</div>
    </div>
  `

  document.body.appendChild(el)
  el.style.scrollBehavior = 'auto'
  el.scrollTop = el.scrollHeight
  requestAnimationFrame(() => { el.style.scrollBehavior = 'smooth' })

  const rect = anchorEl.getBoundingClientRect()
  const popW = 280
  const popH = Math.min(el.scrollHeight || 460, window.innerHeight * 0.85)
  let left = rect.right + 18
  let top = rect.top + (rect.height / 2) - (popH / 2)
  if (left + popW > window.innerWidth - 12) left = rect.left - popW - 18
  if (top < 12) top = 12
  if (top + popH > window.innerHeight - 12) top = window.innerHeight - popH - 12
  el.style.left = left + 'px'
  el.style.top = top + 'px'

  el.addEventListener('mouseenter', () => clearTimeout(_chainHideTimer))
  el.addEventListener('mouseleave', () => scheduleHideChainPopup())
}

function TreeNode({ node, role, depth = 0, dark, text, subtext, colorIdx = 0, ancestors = [], superAdminEmail = '', flatMode = false }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(depth < 2)
  const cfg = ROLE_CFG[role]
  const c = COLORS[colorIdx % COLORS.length]
  const Icon = cfg.Icon

  const childRole = { admin: 'dealer', dealer: 'sub_dealer', sub_dealer: 'promotor', promotor: 'customer' }[role]
  const children = { admin: node.dealers, dealer: node.sub_dealers, sub_dealer: node.promotors, promotor: node.customers }[role] || []
  const hasChildren = !flatMode && children.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
      <div
        onClick={() => hasChildren && setExpanded(!expanded)}
        style={{
          background: dark ? `rgba(${hexToRgb(c)},0.06)` : `rgba(${hexToRgb(c)},0.08)`,
          border: `1px solid rgba(${hexToRgb(c)},0.35)`, borderRadius: '12px', padding: '12px 16px',
          minWidth: '160px', maxWidth: '200px', cursor: hasChildren ? 'pointer' : 'default',
          transition: 'all 0.3s ease', position: 'relative',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = `0 8px 24px rgba(${hexToRgb(c)},0.25)`
          e.currentTarget.style.borderColor = `rgba(${hexToRgb(c)},0.7)`
          showChainPopup(e.currentTarget, ancestors, { node, role }, dark, text, subtext, superAdminEmail)
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = `rgba(${hexToRgb(c)},0.35)`
          scheduleHideChainPopup()
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', marginBottom: '8px', background: `rgba(${hexToRgb(c)},0.15)`, color: c, border: `1px solid rgba(${hexToRgb(c)},0.35)` }}>
          <Icon color={c} size={11} /> {cfg.label}
        </div>
        <div style={{ color: c, fontFamily: 'monospace', fontSize: '10px', marginBottom: '4px', wordBreak: 'break-all' }}>
          {node[cfg.idKey]}
        </div>
        <div style={{ color: text, fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
          {node.first_name} {node.last_name || ''}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: subtext, fontSize: '11px', marginBottom: '2px' }}>
          <IconPhone color={subtext} /> {node.mobile_number}
        </div>
        {node.city_name && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: subtext, fontSize: '11px' }}>
            <IconMapPin color={subtext} /> {node.city_name}
          </div>
        )}
        <div style={{ marginTop: '8px', width: '100%', height: 2, borderRadius: 2, background: `linear-gradient(90deg,rgba(${hexToRgb(c)},0.2),${c})` }} />

        <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
          <button
            onClick={e => { e.stopPropagation(); printPersonCard(node, role, cfg, c, ancestors, superAdminEmail) }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '3px 0', fontSize: '9px', fontWeight: 700, background: `rgba(${hexToRgb(c)},0.1)`, border: `1px solid rgba(${hexToRgb(c)},0.35)`, borderRadius: '6px', color: c, cursor: 'pointer' }}
          >
            <IconPrinter color={c} /> PRINT
          </button>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/hierarchy-sales-count?role=${role}&id=${node.id}`) }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '3px 0', fontSize: '9px', fontWeight: 700, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: '6px', color: '#4ade80', cursor: 'pointer' }}
          >
            <IconChart color="#4ade80" /> SALES
          </button>
        </div>

        {hasChildren && (
          <div style={{ position: 'absolute', top: '8px', right: '10px', color: c, transition: 'transform 0.3s ease', transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
            <IconChevronDown color={c} />
          </div>
        )}
        {hasChildren && (
          <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', background: c, color: '#000', fontSize: '9px', fontWeight: 800, padding: '1px 7px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
            {children.length} {childRole?.replace('_', ' ')}
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div style={{ width: 2, height: 28, background: `linear-gradient(180deg,${c},rgba(${hexToRgb(c)},0.3))`, marginTop: '10px' }} />
          <div style={{ position: 'relative', width: '100%' }}>
            {children.length > 1 && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `rgba(${hexToRgb(c)},0.45)` }} />
            )}
            <div style={{ display: 'flex', justifyContent: children.length === 1 ? 'center' : 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              {children.map((child, ci) => (
                <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: children.length === 1 ? '0 0 auto' : 1 }}>
                  <div style={{ width: 2, height: 20, background: `rgba(${hexToRgb(c)},0.5)` }} />
                  <TreeNode node={child} role={childRole} depth={depth + 1} dark={dark} text={text} subtext={subtext} colorIdx={colorIdx + ci + 1} ancestors={[...ancestors, { node, role }]} superAdminEmail={superAdminEmail} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SuperadminHierarchy() {
  const navigate = useNavigate()
  const [dark] = useState(true)
  const [hierarchyData, setHierarchyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const text = '#f8fafc'
  const subtext = '#94a3b8'
  const inpBg = 'rgba(255,255,255,0.05)'
  const inpBorder = '#374151'
  const border = 'rgba(255,255,255,0.1)'

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 120)
    return () => clearTimeout(t)
  }, [search])

  const fetchHierarchy = async () => {
    setLoading(true)
    try {
      const res = await api.get('/hierarchy/full/')
      setHierarchyData(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  useEffect(() => { fetchHierarchy() }, [])

  const flattenByRole = (role) => {
    if (!hierarchyData) return []
    const result = []
    hierarchyData.admins.forEach(admin => {
      if (role === 'admin') { result.push({ node: admin, ancestors: [] }); return }
      admin.dealers.forEach(dealer => {
        if (role === 'dealer') { result.push({ node: dealer, ancestors: [{ node: admin, role: 'admin' }] }); return }
        dealer.sub_dealers.forEach(sd => {
          if (role === 'sub_dealer') { result.push({ node: sd, ancestors: [{ node: admin, role: 'admin' }, { node: dealer, role: 'dealer' }] }); return }
          sd.promotors.forEach(pr => {
            if (role === 'promotor') { result.push({ node: pr, ancestors: [{ node: admin, role: 'admin' }, { node: dealer, role: 'dealer' }, { node: sd, role: 'sub_dealer' }] }); return }
            pr.customers.forEach(cus => {
              if (role === 'customer') { result.push({ node: cus, ancestors: [{ node: admin, role: 'admin' }, { node: dealer, role: 'dealer' }, { node: sd, role: 'sub_dealer' }, { node: pr, role: 'promotor' }] }) }
            })
          })
        })
      })
    })
    return result
  }

  const searchAllHierarchy = (query) => {
    if (!hierarchyData || !query.trim()) return []
    const q = query.trim().toLowerCase()
    const result = []
    const checkMatch = (node, idKey) => {
      const idVal = (node[idKey] || '').toString().toLowerCase()
      const nameVal = `${node.first_name || ''} ${node.last_name || ''}`.toLowerCase()
      const phoneVal = (node.mobile_number || '').toString().toLowerCase()
      return idVal.includes(q) || nameVal.includes(q) || phoneVal.includes(q)
    }
    hierarchyData.admins.forEach(admin => {
      if (checkMatch(admin, 'admin_id')) result.push({ node: admin, role: 'admin', ancestors: [] })
      admin.dealers.forEach(dealer => {
        if (checkMatch(dealer, 'dealer_id')) result.push({ node: dealer, role: 'dealer', ancestors: [{ node: admin, role: 'admin' }] })
        dealer.sub_dealers.forEach(sd => {
          if (checkMatch(sd, 'sub_dealer_id')) result.push({ node: sd, role: 'sub_dealer', ancestors: [{ node: admin, role: 'admin' }, { node: dealer, role: 'dealer' }] })
          sd.promotors.forEach(pr => {
            if (checkMatch(pr, 'promotor_id')) result.push({ node: pr, role: 'promotor', ancestors: [{ node: admin, role: 'admin' }, { node: dealer, role: 'dealer' }, { node: sd, role: 'sub_dealer' }] })
            pr.customers.forEach(cus => {
              if (checkMatch(cus, 'customer_id')) result.push({ node: cus, role: 'customer', ancestors: [{ node: admin, role: 'admin' }, { node: dealer, role: 'dealer' }, { node: sd, role: 'sub_dealer' }, { node: pr, role: 'promotor' }] })
            })
          })
        })
      })
    })
    return result
  }

  const searchResults = useMemo(() => {
    if (!debouncedSearch) return []
    return searchAllHierarchy(debouncedSearch)
  }, [debouncedSearch, hierarchyData])

  const totalStats = hierarchyData ? {
    admins: hierarchyData.admins.length,
    dealers: hierarchyData.admins.reduce((a, ad) => a + ad.dealers.length, 0),
    subDealers: hierarchyData.admins.reduce((a, ad) => a + ad.dealers.reduce((b, d) => b + d.sub_dealers.length, 0), 0),
    promotors: hierarchyData.admins.reduce((a, ad) => a + ad.dealers.reduce((b, d) => b + d.sub_dealers.reduce((c, sd) => c + sd.promotors.length, 0), 0), 0),
    customers: hierarchyData.admins.reduce((a, ad) => a + ad.dealers.reduce((b, d) => b + d.sub_dealers.reduce((c, sd) => c + sd.promotors.reduce((e, pr) => e + pr.customers.length, 0), 0), 0), 0),
  } : null

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: text, fontFamily: '"Inter",system-ui,sans-serif', padding: '28px 32px' }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconBuilding color="#a5f3fc" />
            <span style={{ color: '#a5f3fc', fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Full Organization Hierarchy
            </span>
          </div>
          {totalStats && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
              {[
                { label: 'Super Admin', roleKey: 'super_admin', count: 1, color: '#ffd700' },
                { label: 'Admins', roleKey: 'admin', count: totalStats.admins, color: '#22d3ee' },
                { label: 'Dealers', roleKey: 'dealer', count: totalStats.dealers, color: '#4ade80' },
                { label: 'Sub Dealers', roleKey: 'sub_dealer', count: totalStats.subDealers, color: '#f59e0b' },
                { label: 'Promotors', roleKey: 'promotor', count: totalStats.promotors, color: '#a78bfa' },
                { label: 'Customers', roleKey: 'customer', count: totalStats.customers, color: '#f472b6' },
              ].map(s => {
                const isActive = filter === s.roleKey
                return (
                  <div key={s.label} onClick={() => setFilter(isActive ? null : s.roleKey)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isActive ? `rgba(${hexToRgb(s.color)},0.22)` : `rgba(${hexToRgb(s.color)},0.08)`, border: `1px solid rgba(${hexToRgb(s.color)},${isActive ? 0.8 : 0.25})`, borderRadius: '20px', padding: '4px 14px', cursor: 'pointer', transition: 'all 0.25s ease' }}>
                    <span style={{ color: s.color, fontWeight: 800, fontSize: '13px' }}>{s.count}</span>
                    <span style={{ color: subtext, fontSize: '11px' }}>{s.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <IconSearch color={subtext} />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, Name, Phone..."
              style={{ width: '240px', background: inpBg, border: `1px solid ${inpBorder}`, borderRadius: '10px', padding: '9px 14px 9px 34px', color: text, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: subtext, cursor: 'pointer' }}>
                <IconX color={subtext} />
              </button>
            )}
          </div>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '10px', padding: '9px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
            <IconBack color="#f87171" /> Back
          </button>
        </div>
      </div>

<div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, borderRadius: '20px', padding: '28px 32px', overflowX: 'auto', minHeight: '100vh' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: '16px' }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(34,211,238,0.2)', borderTop: '3px solid #22d3ee', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: subtext, fontSize: '14px' }}>Loading hierarchy...</span>
          </div>
        )}

        {!loading && hierarchyData && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'max-content', margin: '0 auto' }}>
            {debouncedSearch ? (() => {
              const filteredResults = filter && filter !== 'super_admin' ? searchResults.filter(item => item.role === filter) : searchResults
              if (filteredResults.length === 0) {
                return <div style={{ color: subtext, padding: '60px', textAlign: 'center', fontSize: '15px' }}>No results found for "{debouncedSearch}"</div>
              }
              return (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1100px' }}>
                  {filteredResults.map((item, idx) => (
                    <TreeNode key={item.node.id || idx} node={item.node} role={item.role} depth={0} dark={dark} text={text} subtext={subtext} colorIdx={idx} ancestors={item.ancestors} superAdminEmail={localStorage.getItem('email') || ''} flatMode={true} />
                  ))}
                </div>
              )
            })() : (
              <>
                {filter && (
                  <button onClick={() => { setFilter(null); setSearch('') }} style={{ marginBottom: '20px', padding: '8px 18px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.35)', borderRadius: '10px', color: '#22d3ee', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    ← Back to Full Tree
                  </button>
                )}

                {(!filter || filter === 'super_admin') && (
                  <>
                    <div style={{ background: 'linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,215,0,0.05))', border: '1px solid rgba(255,215,0,0.5)', borderRadius: '20px', padding: '24px 64px', fontWeight: 800, fontSize: '20px', color: '#ffd700', textAlign: 'center' }}>
                      Super Admin
                      <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 400, marginTop: '6px' }}>
                        {localStorage.getItem('email')}
                      </div>
                    </div>
                    {!filter && <div style={{ width: 2, height: 32, background: 'rgba(34,211,238,0.6)' }} />}
                  </>
                )}

                {!filter && hierarchyData.admins.length > 0 && (
                  <>
                    <div style={{ height: 2, background: 'rgba(34,211,238,0.5)', width: '100%' }} />
                    <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {hierarchyData.admins.map((admin, ai) => (
                        <div key={admin.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: 2, height: 24, background: 'rgba(255,215,0,0.5)' }} />
                          <TreeNode node={admin} role="admin" depth={0} dark={dark} text={text} subtext={subtext} colorIdx={ai} ancestors={[]} superAdminEmail={localStorage.getItem('email') || ''} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {!filter && hierarchyData.admins.length === 0 && (
                  <div style={{ color: subtext, padding: '60px', textAlign: 'center', fontSize: '15px' }}>No admins created yet.</div>
                )}

                {filter && filter !== 'super_admin' && (() => {
                  const idKeyMap = ROLE_CFG[filter]?.idKey || 'id'
                  const flatList = flattenByRole(filter)
                  if (flatList.length === 0) {
                    return <div style={{ color: subtext, padding: '60px', textAlign: 'center', fontSize: '15px' }}>No {filter.replace('_', ' ')} found.</div>
                  }
                  return (
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px' }}>
                      {flatList.map((item, idx) => (
                        <TreeNode key={item.node.id || idx} node={item.node} role={filter} depth={0} dark={dark} text={text} subtext={subtext} colorIdx={idx} ancestors={item.ancestors} superAdminEmail={localStorage.getItem('email') || ''} flatMode={true} />
                      ))}
                    </div>
                  )
                })()}
              </>
            )}
          </div>
        )}

        {!loading && !hierarchyData && (
          <div style={{ color: subtext, padding: '60px', textAlign: 'center', fontSize: '15px' }}>Failed to load hierarchy.</div>
        )}
      </div>

      {!loading && (
        <div style={{ marginTop: '20px', padding: '14px 0', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {[
            { role: 'Super Admin', color: '#ffd700' },
            { role: 'Admin', color: '#22d3ee' },
            { role: 'Dealer', color: '#4ade80' },
            { role: 'Sub Dealer', color: '#f59e0b' },
            { role: 'Promotor', color: '#a78bfa' },
            { role: 'Customer', color: '#f472b6' },
          ].map(l => (
            <div key={l.role} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: l.color }} />
              <span style={{ color: subtext, fontSize: '11px' }}>{l.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}