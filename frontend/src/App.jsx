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
import EarringsCollection from './collection/earrings_collection'
import GoldEarrings from './gold_silver/gold_earrings'
import SilverEarrings from './gold_silver/silver_earrings'
import ChainsCollection from './collection/chains_collection'
import GoldChain from './gold_silver/gold_chain'
import SilverChain from './gold_silver/silver_chain'
import NecklacesCollection from './collection/necklaces_collection'
import GoldNecklaces from './gold_silver/gold_necklaces'
import SilverNecklaces from './gold_silver/silver_necklaces'
import CardSection from './collection/card_section'
import ProductDisplay from './collection/product_display'
import AddProduct from './Products/add_product'
import AddBanners from './Products/banners/add_banners'
import HomeBanner from './Products/banners/home_banner'
import AllCollection from './collection/all_collection'
import BraceletsCollection from './collection/bracelets_collection'
import GoldBracelets from './gold_silver/gold_bracelets'
import SilverBracelets from './gold_silver/silver_bracelets'
import CoinsCollection from './collection/coins_collection'
import GoldCoins from './gold_silver/gold_coins'
import SilverCoins from './gold_silver/silver_coins'
import WishlistPage from './collection/WishlistPage'


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

              {/* Earring Routes */}
        <Route path="/collection/earrings" element={<EarringsCollection />} />
        <Route path="/gold-earrings" element={<GoldEarrings />} />
        <Route path="/silver-earrings" element={<SilverEarrings />} />

               {/* Chain Routes */}
        <Route path="/collection/chains" element={<ChainsCollection />} />
        <Route path="/gold-chain" element={<GoldChain />} />
        <Route path="/silver-chain" element={<SilverChain />} />

                {/* Necklace Routes */}
        <Route path="/collection/necklaces" element={<NecklacesCollection />} />
        <Route path="/gold-necklaces" element={<GoldNecklaces />} />
        <Route path="/silver-necklaces" element={<SilverNecklaces />} />

               {/* card section */}
        <Route path="/cart" element={<CardSection />} />

       <Route path="/product-display" element={<ProductDisplay />} />
<Route path="/add-product" element={
  <ProtectedRoute role="super_admin"><AddProduct /></ProtectedRoute>
} />

<Route path="/add-banners" element={
  <ProtectedRoute role="super_admin"><AddBanners /></ProtectedRoute>
} />
<Route path="/home-banner" element={
  <ProtectedRoute role="super_admin"><HomeBanner /></ProtectedRoute>
} />

<Route path="/collection/all" element={<AllCollection />} />
<Route path="/collection/coins" element={<CoinsCollection />} />
<Route path="/gold-coins" element={<GoldCoins />} />
<Route path="/silver-coins" element={<SilverCoins />} />

<Route path="/collection/bracelets" element={<BraceletsCollection />} />
<Route path="/gold-bracelets" element={<GoldBracelets />} />
<Route path="/silver-bracelets" element={<SilverBracelets />} />

<Route path="/wishlist" element={
  <ProtectedRoute role="customer"><WishlistPage /></ProtectedRoute>
} />

      </Routes>
    </BrowserRouter>
  )
}


