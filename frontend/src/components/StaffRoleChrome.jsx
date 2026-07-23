import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import goldCoin from '../assets/gold-coin-transparent.png'

const roleMeta = {
  super_admin: { title: 'Super Admin', subtitle: 'Administrator', home: '/super-admin' },
  admin: { title: 'Admin', subtitle: 'Network manager', home: '/admin' },
  dealer: { title: 'Dealer', subtitle: 'Dealer desk', home: '/dealer' },
  sub_dealer: { title: 'Sub Dealer', subtitle: 'Sub dealer desk', home: '/sub-dealer' },
  promotor: { title: 'Promoter', subtitle: 'Promoter desk', home: '/promotor' },
}

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    box: <><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    orders: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 3h6v3H9z" /><path d="M8 11h8M8 15h5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    rate: <><path d="M4 20h16" /><path d="M6 20V10" /><path d="M12 20V4" /><path d="M18 20v-7" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    logout: <><path d="M10 17 15 12 10 7" /><path d="M15 12H3" /><path d="M21 3v18" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function StaffRoleChrome({ role = 'admin', children }) {
  const navigate = useNavigate()
  const meta = roleMeta[role] || roleMeta.admin
  const initial = useMemo(() => meta.title.split(' ').map(x => x[0]).join('').slice(0, 2), [meta.title])

  const navItems = [
    ['Dashboard', 'home', meta.home],
    ['Products', 'box', '/add-product'],
    ['Orders', 'orders', '/admin-orders'],
    ['Customers', 'users', null],
    ['Dealers', 'users', null],
    ['Sub Dealers', 'users', null],
    ['Promoters', 'users', null],
    ['Reports', 'rate', '/sales-report'],
    ['Gold Rate', 'rate', null],
    ['Notifications', 'bell', null],
  ]

  return (
    <div className="staff-shell">
      <style>{`
        .staff-shell{
          --main-white:#FDFDFC;--warm-off:#F3F3F0;--mist:#E7EDEC;--soft:#D1DFDE;--dust:#BDCFCE;
          --teal:#0C4044;--teal-dark:#073B3F;--champagne:#F3E8DE;--gold:#CCA881;--antique:#BB8958;
          --grey:#7A8987;--black:#111817;--red:#C92035;
          min-height:100vh;background:linear-gradient(135deg,var(--main-white),var(--warm-off) 52%,var(--mist));color:var(--black);
          font-family:"Manrope","Inter",system-ui,sans-serif;
        }
        .staff-shell *{box-sizing:border-box}
        .staff-side{position:fixed;inset:0 auto 0 0;width:276px;background:rgba(253,253,252,.96);border-right:1px solid rgba(189,207,206,.72);box-shadow:22px 0 54px rgba(7,59,63,.06);z-index:60;padding:28px 16px;display:flex;flex-direction:column}
        .staff-brand{display:flex;gap:12px;align-items:center;padding:0 8px 24px;border-bottom:1px solid rgba(189,207,206,.65)}
        .staff-brand img{width:52px;height:52px;object-fit:contain}
        .staff-brand-title{font-family:Georgia,"Times New Roman",serif;font-size:30px;line-height:1;font-weight:800;color:var(--teal-dark);letter-spacing:.03em}
        .staff-brand-role{margin-top:5px;color:var(--antique);font-size:11px;font-weight:900;letter-spacing:.24em;text-transform:uppercase}
        .staff-nav{display:flex;flex-direction:column;gap:8px;margin-top:22px}
        .staff-nav button{height:46px;border:0;border-radius:10px;background:transparent;color:var(--teal);display:flex;align-items:center;gap:12px;padding:0 14px;font-size:15px;font-weight:850;cursor:pointer;text-align:left}
        .staff-nav button:hover{background:var(--mist);transform:translateX(2px)}
        .staff-nav button.active{background:linear-gradient(135deg,var(--teal),var(--teal-dark));color:var(--main-white);box-shadow:0 12px 28px rgba(7,59,63,.18)}
        .staff-rate-card{margin-top:auto;border-radius:16px;overflow:hidden;background:var(--champagne);border:1px solid rgba(204,168,129,.48);box-shadow:0 18px 42px rgba(7,59,63,.08)}
        .staff-rate-card img{display:block;width:100%;height:142px;object-fit:contain;padding:18px;background:linear-gradient(135deg,#F3E8DE,#FDFDFC)}
        .staff-rate-body{padding:14px 16px 16px;text-align:center}
        .staff-rate-body strong{display:block;font-family:Georgia,"Times New Roman",serif;font-size:25px;color:var(--teal-dark)}
        .staff-rate-body span{display:block;margin-top:4px;font-size:11px;color:var(--grey);font-weight:900;letter-spacing:.14em}
        .staff-top{position:sticky;top:0;margin-left:276px;z-index:50;min-height:96px;background:rgba(253,253,252,.9);backdrop-filter:blur(18px);border-bottom:1px solid rgba(189,207,206,.72);box-shadow:0 16px 34px rgba(7,59,63,.04);display:flex;align-items:center;gap:18px;padding:20px 28px}
        .staff-menu{width:42px;height:42px;border:0;background:transparent;color:var(--antique);display:grid;place-items:center}
        .staff-search{height:58px;min-width:320px;max-width:520px;flex:1;border:1px solid rgba(189,207,206,.82);border-radius:16px;background:var(--mist);display:flex;align-items:center;gap:12px;padding:0 18px;color:var(--grey);font-weight:700}
        .staff-actions{display:flex;align-items:center;gap:10px;white-space:nowrap}
        .staff-action,.staff-icon{height:52px;border:1px solid rgba(189,207,206,.78);border-radius:12px;background:rgba(253,253,252,.92);color:var(--teal);display:flex;align-items:center;justify-content:center;gap:8px;padding:0 14px;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 8px 22px rgba(7,59,63,.04)}
        .staff-action.primary{background:linear-gradient(135deg,var(--teal),var(--teal-dark));border-color:var(--teal-dark);color:var(--main-white)}
        .staff-action.gold{background:linear-gradient(135deg,var(--gold),var(--antique));border-color:rgba(159,97,48,.45);color:var(--black)}
        .staff-icon{width:52px;padding:0;position:relative}
        .staff-badge{position:absolute;top:-8px;right:-7px;min-width:18px;height:18px;border-radius:99px;background:var(--red);color:white;font-size:10px;font-weight:900;display:grid;place-items:center;border:2px solid var(--main-white)}
        .staff-profile{display:flex;align-items:center;gap:10px;margin-left:4px}
        .staff-avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold),var(--antique));color:white;font-weight:900}
        .staff-profile strong{display:block;color:var(--teal-dark);font-size:13px}
        .staff-profile span{display:block;color:var(--grey);font-size:11px;font-weight:700}
        .staff-content{margin-left:276px;min-height:calc(100vh - 96px)}
        .staff-content > div > div[style*="position: sticky"][style*="top: 0"]{display:none!important}
        @media (max-width:1100px){
          .staff-side{width:92px;padding:20px 10px}.staff-brand{justify-content:center}.staff-brand div,.staff-nav span,.staff-rate-card{display:none}
          .staff-nav button{justify-content:center;padding:0}.staff-top,.staff-content{margin-left:92px}.staff-actions{overflow-x:auto}.staff-search{min-width:220px}
        }
      `}</style>

      <aside className="staff-side">
        <div className="staff-brand">
          <img src={logo} alt="Luxiva" />
          <div>
            <div className="staff-brand-title">LUXIVA</div>
            <div className="staff-brand-role">{meta.title}</div>
          </div>
        </div>

        <nav className="staff-nav">
          {navItems.map(([label, icon, route], index) => (
            <button key={label} className={index === 0 ? 'active' : ''} type="button" onClick={() => route && navigate(route)}>
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="staff-rate-card">
          <img src={goldCoin} alt="" />
          <div className="staff-rate-body">
            <strong>Live Gold Rate</strong>
            <span>22K staff pricing</span>
          </div>
        </div>
      </aside>

      <header className="staff-top">
        <button className="staff-menu" type="button" aria-label="Menu"><Icon name="menu" size={24} /></button>
        <div className="staff-search"><Icon name="search" /><span>Search orders, products, users...</span></div>
        <div className="staff-actions">
          <button className="staff-action primary" type="button"><Icon name="rate" />Gold Rate</button>
          <button className="staff-action gold" type="button" onClick={() => navigate('/add-product')}><Icon name="plus" />Add Product</button>
          <button className="staff-action" type="button" onClick={() => navigate('/admin-orders')}><Icon name="orders" />Orders</button>
          <button className="staff-action" type="button"><Icon name="mail" />Requests</button>
          <button className="staff-icon" type="button"><Icon name="users" /><span className="staff-badge">2</span></button>
          <button className="staff-icon" type="button"><Icon name="bell" /><span className="staff-badge">7</span></button>
          <button className="staff-action" type="button"><Icon name="rate" />Today Rates</button>
          <button className="staff-action" type="button">Light</button>
          <div className="staff-profile">
            <div className="staff-avatar">{initial}</div>
            <div><strong>{meta.title}</strong><span>{meta.subtitle}</span></div>
          </div>
          <button className="staff-icon" type="button" onClick={() => { localStorage.clear(); navigate('/login') }}><Icon name="logout" /></button>
        </div>
      </header>

      <main className="staff-content">{children}</main>
    </div>
  )
}
