// import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

// export default function PageLoader() {
//   const location = useLocation()
//   const [show, setShow] = useState(false)

//   useEffect(() => {
//     setShow(true)
//     const timer = setTimeout(() => setShow(false), 500)
//     return () => clearTimeout(timer)
//   }, [location.pathname])

//   if (!show) return null

//   return (
//     <img
//       src="/BJ-logo.png"
//       alt="Loading"
//       style={{
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         height: '400px',
//         width: 'auto',
//         objectFit: 'contain',
//         zIndex: 99999,
//         pointerEvents: 'none',
//         opacity: 0.25,
//       }}
//     />
//   )
// }