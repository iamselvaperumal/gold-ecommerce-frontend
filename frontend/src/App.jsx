import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import AdminDashboard from './pages/AdminDashboard'
import DealerDashboard from './pages/DealerDashboard'
import SubDealerDashboard from './pages/SubDealerDashboard'
import PromotorDashboard from './pages/PromotorDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import RingCollection from './collection/ring_collection'
import BanglesCollection from './collection/bangles_collection'
import GoldRings from './gold_silver/gold_rings'
import SilverRings from './gold_silver/silver_rings'
import GoldBangles from './gold_silver/gold_bangles'
import SilverBangles from './gold_silver/silver_bangles'


function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')
  if (!token || token === 'undefined' || token === 'null') {
    return <Navigate to="/login" replace />
  }
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/super-admin" element={
          <ProtectedRoute role="super_admin"><SuperAdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/dealer" element={
          <ProtectedRoute role="dealer"><DealerDashboard /></ProtectedRoute>
        } />
        <Route path="/sub-dealer" element={
          <ProtectedRoute role="sub_dealer"><SubDealerDashboard /></ProtectedRoute>
        } />
        <Route path="/promotor" element={
       <ProtectedRoute role="promotor"><PromotorDashboard /></ProtectedRoute>
       } />
      <Route path="/customer" element={
      <ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>
       } />

        {/* ring Routes */}
       <Route path="/collection/rings" element={<RingCollection />} />
       <Route path="/gold-rings" element={<GoldRings />} />
       <Route path="/silver-rings" element={<SilverRings />} />

               {/* Bangle Routes */}
        <Route path="/collection/bangles" element={<BanglesCollection />} />
        <Route path="/gold-bangles" element={<GoldBangles />} />
        <Route path="/silver-bangles" element={<SilverBangles />} />


      </Routes>
    </BrowserRouter>
  )
}


